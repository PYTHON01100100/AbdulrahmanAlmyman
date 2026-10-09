---
llm-serving-litellm-vllm-ack:
  name: Serving Large Language Models at Scale with LiteLLM and vLLM on Alibaba Cloud ACK
  caseStudyId: llm-serving-litellm-vllm-ack
  description: Building a multi-model, OpenAI-compatible inference platform on GPU nodes in Alibaba Cloud ACK, with vLLM, LiteLLM and OSS-backed model storage.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2026-10-22"
  type: "blog"
---

Publish date: `2026-10-22`

# Serving Large Language Models at Scale with LiteLLM and vLLM on Alibaba Cloud ACK

Once a team starts using more than one open-source LLM, things get messy fast. Every model wants different hardware, a different deployment, and a different endpoint for developers to remember. I built a reference platform on Alibaba Cloud ACK that hides all of that behind **one OpenAI-compatible endpoint**, and this is how it works.

The stack:

- **ACK** for container orchestration
- **vLLM** for high-performance GPU inference
- **LiteLLM** as the unified API gateway
- **OSS** for model storage, mounted with PV/PVC
- **Open WebUI** to validate that everything works

## Architecture

![High-level design of the multi-model LLM platform on ACK](/llm-serving-ack/hld.png)

The diagram is also available as an editable draw.io file, so you can adapt it to your own environment:

<a href="/llm-serving-ack/Example-HLD.drawio" download="Example-HLD.drawio">⬇ Download the editable diagram (Example-HLD.drawio)</a>

The platform has four layers:

- **Client layer:** applications, internal users, AI agents or Open WebUI, all talking to a single endpoint.
- **Gateway layer:** LiteLLM speaks the OpenAI API and routes each request to the right model backend.
- **Inference layer:** every model runs on its own GPU node using vLLM.
- **Storage layer:** model weights live in OSS and are mounted into the pods through a PV and PVC.

## Infrastructure for 4 concurrent models

| Component | Quantity | Notes |
| --- | --- | --- |
| ACK Cluster | 1 | Managed Kubernetes |
| CPU Node | 1 | Runs the LiteLLM gateway |
| GPU Nodes | 4 | `ecs.gn8is.2xlarge` (NVIDIA L20) |
| OSS Bucket | 1 | Model storage |
| CLB / Ingress | 1 | Access to the gateway |
| NAT Gateway + EIP | 1 | Outbound internet so nodes can pull images from Docker Hub |
| PV / PVC | 4+ | One per model mount |

```text
ACK Cluster
├── CPU Node
│   └── LiteLLM Gateway
├── GPU Node 1 → Llama-3.1-8B-Instruct
├── GPU Node 2 → Qwen2.5-14B-Instruct
├── GPU Node 3 → Qwen3-32B-AWQ
└── GPU Node 4 → Qwen3-30B-A3B
```

## Choosing a GPU

This is probably the most important decision in the whole design. Alibaba's [GPU-accelerated instance families](https://www.alibabacloud.com/help/en/egs/gpu-accelerated-compute-optimized-instance-families) cover quite a range:

| Instance family | GPU | VRAM | Use case |
| --- | --- | --- | --- |
| `ecs.gn6i.*` | NVIDIA T4 | 16 GB | Entry-level inference (8B-class models) |
| `ecs.gn6v.*` | NVIDIA V100 | 16 GB | General-purpose inference |
| `ecs.gn8is.*` | NVIDIA L20 | 48 GB | **Production LLM inference** |
| `ecs.gn8ia.*` | NVIDIA H20 | 96 GB | Large-scale training and inference |

I went with the L20 (48 GB). With quantization, everything up to ~32B parameters fits on a single card:

| Model | Params | Quantization | GPUs | Approx. VRAM |
| --- | --- | --- | --- | --- |
| Llama 3.1 8B Instruct | 8B | FP16 | 1 × L20 | ~16-20 GB |
| Gemma 3 12B | 12B | FP16 | 1 × L20 | ~24-30 GB |
| Qwen2.5 14B Instruct | 14B | FP16 | 1 × L20 | ~28-35 GB |
| GPT-OSS 20B | 20B | AWQ | 1 × L20 | ~20-30 GB |
| Qwen3 32B AWQ | 32B | AWQ 4-bit | 1 × L20 | ~20-28 GB |
| Qwen3 30B A3B | 30B MoE | BitsAndBytes | 1 × L20 | ~17-22 GB |
| Llama 3.3 70B | 70B | AWQ | 4 × L20 | Multi-GPU |
| GPT-OSS 120B | 120B | Quantized | 8 × L20 | Multi-GPU |

These numbers are estimates. Before committing to a node type, check your model against [Can I Run It?](https://www.canirun.ai/) or the [Hugging Face memory calculator](https://alvarobartt.com/hf-mem/).

## Why OSS + PV/PVC for model weights?

Model weights are tens of gigabytes. Downloading them every time a pod starts makes startups slow and unpredictable. Instead, the models are uploaded to OSS once and mounted straight into the vLLM pods:

```text
OSS → Persistent Volume → Persistent Volume Claim → vLLM Pod
```

### Giving the PV access to the bucket (AccessKey + SecretKey)

The PV mounts the bucket through the OSS CSI driver, which needs credentials to read it. So before creating the PV you need an **AccessKey ID** and **AccessKey Secret**:

1. In the RAM console, create a **RAM user** just for this (never use the root account keys).
2. Grant it only what it needs. Read access to the models bucket is enough for serving, so `AliyunOSSReadOnlyAccess`, or a custom policy limited to that one bucket. Use `AliyunOSSFullAccess` only on the user you upload models with.
3. Open the user and click **Create AccessKey**. Copy the AccessKey ID and Secret right away, because the secret is shown only once.
4. Store them in a Kubernetes Secret in the same namespace as the models:

```bash
kubectl create secret generic oss-secret -n your-namespace \
  --from-literal=akId=<ACCESS_KEY_ID> \
  --from-literal=akSecret=<ACCESS_KEY_SECRET>
```

5. Reference that Secret from the PV, so the driver can authenticate when the pod mounts the volume:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: qwen3-32b-awq-pv
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadOnlyMany
  persistentVolumeReclaimPolicy: Retain
  csi:
    driver: ossplugin.csi.alibabacloud.com
    volumeHandle: qwen3-32b-awq-pv
    nodePublishSecretRef:
      name: oss-secret
      namespace: your-namespace
    volumeAttributes:
      bucket: modelshugging
      url: oss-me-central-1-internal.aliyuncs.com
      path: /Qwen3-32B-AWQ
      otherOpts: "-o umask=022 -o allow_other"
```

Bind it with a PVC (`qwen3-32b-awq-pvc` in the manifests) and the vLLM pod can mount the model folder.

**Security notes:** never commit the keys to Git, keep the RAM user read-only, use the **internal** OSS endpoint (`-internal`) so traffic stays inside the VPC, and rotate the AccessKey regularly.

### Uploading the models to OSS

Install `ossutil`, then run `ossutil config` once. It asks five things, and only some of them need an answer:

| Prompt | What to do |
| --- | --- |
| Config file name | Press **Enter** (use the default `~/.ossutilconfig`) |
| Access Key ID | **Type it** (the RAM user's AccessKey ID) |
| Access Key Secret | **Type it** (the RAM user's AccessKey Secret) |
| Region | **Type it**, for example `me-central-1` |
| Endpoint | Press **Enter** (the public endpoint is used by default) |

![ossutil config: press Enter for the config file and the endpoint, but type the AccessKey ID, AccessKey Secret and region](/llm-serving-ack/ossutil-config.png)

For uploading, use a RAM user that is allowed to write to the bucket. The read-only user above is only for the PV.

Now there are two ways to upload, depending on how many models you have.

**1. One model at a time:**

```bash
ossutil cp -r ./Qwen3-32B-AWQ oss://modelshugging/Qwen3-32B-AWQ
```

**2. Many models at once (better when you pull a lot from Hugging Face):** clone every model with Git LFS into one local folder, one sub-folder per model, then upload the whole folder to the bucket root in a single command:

```bash
sudo apt install git-lfs -y
git lfs install

mkdir -p ~/llms && cd ~/llms

# clone from Hugging Face (gated models such as Llama need your HF username + access token)
git clone https://huggingface.co/Qwen/Qwen3-32B-AWQ
git clone https://huggingface.co/Qwen/Qwen2.5-14B-Instruct
git clone https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct

# optional: drop the .git folders, they roughly double the size you upload
rm -rf ~/llms/*/.git

# upload everything to the root of the bucket
ossutil cp -r ~/llms/ oss://modelshugging/
```

Check the result with `ossutil ls oss://modelshugging/`. Each model should now be a folder at the bucket root, which is the layout the PVs expect (`path: /Qwen3-32B-AWQ`).

### Creating the PV and PVC from the ACK console

Instead of hand-writing the YAML above, you can create both from the ACK console under **Storage**. It is faster and less error-prone, as long as these details are right.

**Step 1: create the PV** (Storage → Persistent Volumes → Create)

![Create PV in the ACK console with the OSS type, the model's OSS path, the existing secret and the internal endpoint](/llm-serving-ack/create-pv.png)

- **PV Type:** `OSS`.
- **Volume Name:** `<model>-pv`, all lowercase, for example `qwen3-32b-awq-pv`. Use the same model name for the PVC so they are easy to match.
- **Capacity:** only a reference value for OSS (the real capacity is unlimited), so pick something at least as large as the model, such as `20Gi`.
- **Access Mode:** `ReadOnlyMany`. The pods only read the weights.
- **Access Certificate:** choose **Select Existing Secret**, then the namespace and the Secret that holds your AccessKey ID and AccessKey Secret (the `oss-secret` from the previous step). The bucket list in the next field is loaded with this AccessKey, so if the bucket doesn't show up, the keys or their permissions are wrong.
- **Bucket ID:** select your models bucket.
- **OSS Path:** the folder of **this one model, at the bucket root**, written exactly as it appears in the bucket, for example `/Muse-Glimmer-30B`. It is case-sensitive, and it must match what you uploaded with `ossutil` (`oss://modelshugging/Muse-Glimmer-30B/`). A wrong path mounts an empty folder and vLLM then fails with "model path not found".
- **Endpoint:** `Internal Endpoint`, so traffic stays inside the VPC.

**Step 2: create the PVC** (Storage → Persistent Volume Claims → Create)

![Create PVC in the ACK console bound to the existing OSS volume](/llm-serving-ack/create-pvc.png)

- **PVC Type:** `OSS`.
- **Name:** `<model>-pvc`, for example `qwen3-32b-awq-pvc`. This exact name goes into the Deployment as `claimName`, so a typo here means the pod stays in `Pending`.
- **Allocation Mode:** `Existing Volumes`, then **Select PV** and pick the PV you just made.
- **Capacity:** the same value as the PV (`20Gi`).
- Create the PVC in the **same namespace as the vLLM pods**.

**Naming rule of thumb:** one model, one folder, one PV, one PVC, all with the same name.

| Model folder in OSS | OSS Path | PV | PVC |
| --- | --- | --- | --- |
| `Qwen3-32B-AWQ` | `/Qwen3-32B-AWQ` | `qwen3-32b-awq-pv` | `qwen3-32b-awq-pvc` |
| `Qwen2.5-14B-Instruct` | `/Qwen2.5-14B-Instruct` | `qwen2.5-14b-instruct-pv` | `qwen2.5-14b-instruct-pvc` |

Check that both are bound before you deploy the model:

```bash
kubectl get pv
kubectl get pvc -n your-namespace
```

Both should show `Bound`.

**Important: mind the namespace.** A PV is cluster-wide, but a **PVC lives in a namespace**. The console creates the PVC in whichever namespace is selected at the top of the page, and that is `default` if you never changed it. The vLLM Deployment must be in that **same namespace**, or it can't find the claim. The same goes for every `kubectl` command: without `-n`, kubectl only looks in `default`, so a PVC in another namespace seems to be missing.

```bash
# PVC in the default namespace
kubectl get pvc

# PVC in your own namespace
kubectl get pvc -n your-namespace

# or set it once so you can drop -n from every command
kubectl config set-context --current --namespace=your-namespace
```

Pick one namespace for the whole stack (PVCs, the OSS Secret, the models and LiteLLM) and use it everywhere, including the `namespace:` field in the YAML manifests. The Deployment then mounts it with the PVC name (`claimName: qwen3-32b-awq-pvc`) and the model path from `vllm serve`.

## How a request flows

1. The user reaches the cluster through the Load Balancer / Ingress.
2. The request lands on LiteLLM, running on the CPU node.
3. LiteLLM reads the requested model name and forwards to the matching vLLM service.
4. vLLM runs inference on its GPU and returns the response.
5. LiteLLM hands it back in the standard OpenAI format.

Because every model is registered in LiteLLM's config, switching models is just changing the `model` field in your request. Existing OpenAI SDK code works as is.

## Container images and internet access (NAT Gateway)

The manifests pull both images straight from Docker Hub:

```bash
docker pull litellm/litellm:latest
docker pull vllm/vllm-openai:latest
```

```yaml
image: vllm/vllm-openai:latest      # model Deployments
image: litellm/litellm:latest       # LiteLLM Deployment
```

Cluster nodes in a private VPC have no route to the internet, so these pulls will hang in `ImagePullBackOff` unless you give them one. The simple way is to create the resources on Alibaba Cloud yourself:

1. Create a **NAT Gateway** in the cluster's VPC.
2. Create an **Elastic IP (EIP)** and associate it with the NAT Gateway.
3. Add an **SNAT entry** for the vSwitches the ACK nodes use, so the nodes can reach the internet through the EIP.

Both of these cost money (the NAT Gateway and the EIP), and the model weights are not downloaded through them, because those come from OSS over the internal endpoint. The same NAT also lets pods reach Hugging Face or other external APIs if you need that.

If you can't open outbound access, or you hit Docker Hub pull limits, push the two images to your own **ACR** registry instead and replace the `image:` lines with your ACR address.

Check that the pull worked with `kubectl describe pod <pod-name> -n your-namespace`, and look at the Events at the bottom.

## Deploying a model with vLLM

Each model is a Deployment plus a ClusterIP Service. This is the heart of the Qwen3 32B AWQ one:

```yaml title="Qwen3-32B-AWQ.yaml (excerpt)" download="/llm-serving-ack/Qwen3-32B-AWQ.yaml"
args:
  - >
    vllm serve /mnt/OSSbuket/Qwen3-32B-AWQ
    --served-model-name Qwen3-32B-AWQ
    --quantization awq
    --kv-cache-dtype fp8
    --gpu-memory-utilization 0.85
    --max-model-len 10240
    --max-num-seqs 16
    --enable-chunked-prefill
    --enable-auto-tool-choice
    --tool-call-parser hermes
resources:
  limits:
    nvidia.com/gpu: "1"
```

A few things worth calling out:

- `--gpu-memory-utilization 0.85` leaves headroom so the pod doesn't OOM under load.
- `--kv-cache-dtype fp8` and `--max-model-len` keep the KV cache small enough to serve several requests at once on a single card.
- `--enable-auto-tool-choice` with `--tool-call-parser hermes` enables function calling, which matters for agentic workflows.
- An in-memory `emptyDir` mounted at `/dev/shm` gives vLLM the shared memory it needs.
- Readiness and liveness probes hit `/health` with a 120s initial delay, because loading a 32B model takes a while.

The models are `ClusterIP` only; LiteLLM is the single door in.

Full manifests (namespace, node names and IPs replaced by placeholders): <a href="/llm-serving-ack/Llama-3.1-8B-Instruct.yaml" download>Llama-3.1-8B</a> · <a href="/llm-serving-ack/Qwen2.5-14B-Instruct.yaml" download>Qwen2.5-14B</a> · <a href="/llm-serving-ack/Qwen3-32B-AWQ.yaml" download>Qwen3-32B-AWQ</a> · <a href="/llm-serving-ack/Qwen3-30B-A3B.yaml" download>Qwen3-30B-A3B</a> · <a href="/llm-serving-ack/litellm-config.yaml" download>litellm-config</a> · <a href="/llm-serving-ack/litellm-deployment.yaml" download>litellm-deployment</a>

## The LiteLLM gateway

LiteLLM's ConfigMap maps each public model name to its internal vLLM service:

```yaml title="litellm-config.yaml (excerpt)" download="/llm-serving-ack/litellm-config.yaml"
model_list:
  - model_name: Qwen3-32B-AWQ
    litellm_params:
      model: openai/Qwen3-32B-AWQ
      api_base: "http://qwen3-32b-awq:8000/v1"
      api_key: "dummy"
```

The gateway itself is exposed through an internal `LoadBalancer` Service. Adding a model later means one new vLLM Deployment and one new entry in this list.

## Why Redis? Caching in LiteLLM

The LiteLLM config also turns on a **Redis cache**:

```yaml
litellm_settings:
  cache: true
  cache_params:
    type: "redis"
    host: "redis-master"          # your Redis address
    port: 6379
    password: "your_redis_password"
    ttl: 300                      # seconds a cached answer is kept
    namespace: "litellm_cache"
```

Why it is in this project:

- **Saves GPU time:** when the same request (same model, messages and parameters) arrives again, LiteLLM answers from Redis and never touches vLLM. GPUs are the expensive part, and repeated prompts are common (health checks, tests, popular questions, retries).
- **Faster answers:** a cache hit returns in milliseconds instead of waiting for generation.
- **Shared by every replica:** the cache lives outside the LiteLLM pod, so it survives restarts and stays consistent if you scale LiteLLM to more than one pod. An in-memory cache would be lost on every restart.
- **Expires on its own:** `ttl` keeps old answers from living forever, and `namespace` keeps this cache separate from anything else using the same Redis.

If you don't need caching, set `cache: false` and remove `cache_params`. LiteLLM works without Redis.

### Getting the Redis URL and password

You need an instance first, and you copy two things from it into the config: the **connection address** (`host` and `port`) and the **password**.

- Create a managed Redis instance on Alibaba Cloud by following the [Tair (Redis OSS-compatible) documentation](https://www.alibabacloud.com/help/en/redis). Put it in the same VPC as the cluster, use its **private** connection address as `host`, and set or reset the account password in the instance console.
- Or run Redis inside the cluster (the example config uses a Service called `redis-master`) and follow the [Redis documentation](https://redis.io/docs/latest/) to set a password.

Then put the address and password in `litellm-config.yaml` before you deploy. Treat the password like any other secret and don't commit the real value to Git.

## Validating with Open WebUI

To check the whole chain (routing, inference, networking, OSS-backed loading), I pointed Open WebUI at LiteLLM:

```bash
OPENAI_API_BASE_URL=http://litellm-service:4000/v1
OPENAI_API_KEY=dummy
```

If every model shows up in the dropdown and answers, the platform works end to end.

## Scaling and performance notes

- **Single GPU:** quantize (AWQ, BitsAndBytes), use continuous batching, and watch `nvidia-smi`.
- **70B+ models:** use vLLM tensor parallelism across 2-4+ L20s.
- **More throughput:** add GPU nodes and replicas behind the same LiteLLM entry.

## Debugging cheat sheet

Most problems I hit were one of these:

- **Pod stuck in `Pending`:** not enough GPU/CPU/memory, or the PVC isn't bound. Check `kubectl describe pod` and `kubectl get events --sort-by='.lastTimestamp'`.
- **`CrashLoopBackOff`:** wrong model path, OOM, bad container args, or no GPU available. Use `kubectl logs <pod> --previous`.
- **Rollout stuck:** `kubectl rollout status`, and `kubectl rollout undo` to get back to a working version.
- **YAML won't apply:** validate first with `--dry-run=client`.

## What's next

- Gemma 3 27B and bigger models through multi-GPU tensor parallelism
- Multi-region ACK for HA/DR
- RAG pipelines and agentic workloads on top of the gateway
- Cost optimization with spot instances

## Conclusion

Putting LiteLLM in front of vLLM turns a pile of GPU deployments into a single, boring API, and boring is exactly what you want from infrastructure. Grab the draw.io file above and adapt the design to your own setup.

## References

- [Alibaba Cloud ACK documentation](https://www.alibabacloud.com/help/en/container-service-for-kubernetes)
- [ACK: Deploy a vLLM inference application](https://www.alibabacloud.com/help/en/ack/cloud-native-ai-suite/user-guide/deploy-a-vllm-inference-application)
- [vLLM documentation](https://docs.vllm.ai/)
- [LiteLLM documentation](https://docs.litellm.ai/)
- [Open WebUI](https://github.com/open-webui/open-webui)
