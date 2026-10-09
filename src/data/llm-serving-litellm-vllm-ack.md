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

```bash
ossutil cp Qwen3-32B-AWQ oss://modelshugging/Qwen3-32B-AWQ -r
```

**Tip:** create the PV and PVC from the ACK console (Storage). It is faster and a lot less error-prone than hand-writing the YAML.

## How a request flows

1. The user reaches the cluster through the Load Balancer / Ingress.
2. The request lands on LiteLLM, running on the CPU node.
3. LiteLLM reads the requested model name and forwards to the matching vLLM service.
4. vLLM runs inference on its GPU and returns the response.
5. LiteLLM hands it back in the standard OpenAI format.

Because every model is registered in LiteLLM's config, switching models is just changing the `model` field in your request. Existing OpenAI SDK code works as is.

## Deploying a model with vLLM

Each model is a Deployment plus a ClusterIP Service. This is the heart of the Qwen3 32B AWQ one:

```yaml
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

## The LiteLLM gateway

LiteLLM's ConfigMap maps each public model name to its internal vLLM service:

```yaml
model_list:
  - model_name: Qwen3-32B-AWQ
    litellm_params:
      model: openai/Qwen3-32B-AWQ
      api_base: "http://qwen3-32b-awq:8000/v1"
      api_key: "dummy"
```

The gateway itself is exposed through an internal `LoadBalancer` Service. Adding a model later means one new vLLM Deployment and one new entry in this list.

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
