---
train-cv-model-oss:
  name: "Training an Image Classifier on Alibaba Cloud with Data in OSS"
  caseStudyId: train-cv-model-oss
  description: How I trained a model to recognise 9 types of Saudi dates on Alibaba Cloud CPUs, once by pre-downloading the data from OSS and once by streaming it, and when to use each approach.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2026-10-27"
  type: "blog"
---

Publish date: `2026-10-27`

# Training an Image Classifier on Alibaba Cloud with Data in OSS

I built a model that looks at a photo of a date fruit and tells you which of 9 Saudi varieties it is: Ajwa, Galaxy, Mejdool, Meneifi, Nabtat Ali, Rutab, Shaishe, Sokari or Sugaey.

The dataset has 1,156 training images and 502 test images, about 20 MB in total, with one folder per class:

```text
dataset/train/<class>/<image>
dataset/test/<class>/<image>
```

![The local dataset folder with its train and test subfolders](/train-cv-model-oss/01-dataset-folder.png)

One thing to know up front: GPU instances were sold out in my region (Riyadh, `me-central-1`), so **everything in this article ran on CPU**. I used a **c9i** instance with 32 vCPUs. These Intel CPUs have **AMX** (built-in matrix units), which speeds up training when it runs in **bfloat16** precision (a smaller number format that is fast and accurate enough for training).

I trained the model twice, loading the data from **OSS** (Object Storage Service, Alibaba Cloud's file storage) in two different ways. This article shows both, and explains when each one makes sense.

<a href="/train-cv-model-oss/date-fruit-oss-training.zip" download>⬇ Download the project package (scripts, notebook and guides, .zip)</a>

## Step 1: Upload the dataset to OSS

First, put the dataset in an OSS bucket. You do this with **ossutil**, the OSS command-line tool.

Open the ossutil config file:

```bash
nano ~/.ossutilconfig
```

This opens the file in the `nano` editor. Add the following, with your own AccessKey ID and secret:

```ini
[default]
language=EN
accessKeyID = YOUR_ACCESS_KEY_ID
accessKeySecret = YOUR_ACCESS_KEY_SECRET
region = me-central-1
endpoint = oss-me-central-1.aliyuncs.com
```

This tells ossutil who you are and which region your bucket is in.

> **Never share this file or commit it to Git.** It contains your secret key.

Now upload the dataset:

```bash
ossutil cp -r -u -j 10 /path/to/dataset/ oss://your-bucket-name/
```

This copies the dataset folder into your bucket:

- `-r` (recursive) copies the folder with all its subfolders and files.
- `-u` skips files that are already uploaded and unchanged, so if the upload stops, you can run the same command again to resume.
- `-j 10` uploads 10 files in parallel, which is much faster for many small images.

![ossutil uploading the dataset: 1,662 files in 21 folders (about 21 MB) uploaded successfully](/train-cv-model-oss/02-ossutil-upload.png)

Check that it worked:

```bash
ossutil ls oss://your-bucket-name/ -d
```

This lists the folders in your bucket. You should see `train/` and `test/`.

![The bucket in the OSS console, with the train and test folders at the root](/train-cv-model-oss/03-oss-bucket-console.png)

> **Tip: "no such host" error.** If the upload fails with "no such host" and the address contains `oss-accesspoint`, your endpoint is set to an access point. Change it in the config file to the regional endpoint, `oss-me-central-1.aliyuncs.com`, and run the upload again.

> **Note: uploading through an access point.** An OSS **access point** is an extra entry point to a bucket, with its own name (an alias) and its own permissions. When you create one, you choose its **network origin**: **Internet** or **VPC** (a specific private network in Alibaba Cloud). A VPC access point is tied to that VPC, so it is meant for machines inside it, such as an ECS or PAI instance, not for your own computer. To upload the dataset from your computer, use the regional endpoint as above, or an access point with the **Internet** origin. In ossutil you then use the access point's alias in place of the bucket name: `oss://<alias>/`.

## Round 1: PAI-DSW notebook, pre-downloading the data

![Round 1: the PAI-DSW instance downloads the whole dataset from the OSS bucket once](/train-cv-model-oss/round1-diagram.png)

For the first round I used **PAI-DSW** (Data Science Workshop), Alibaba Cloud's hosted Jupyter notebooks. I picked the TensorFlow 2.14 CPU image.

![Creating the PAI-DSW instance: ecs.c9i.8xlarge (32 vCPU, 64 GiB) with the TensorFlow 2.14 CPU image, and the OSS bucket mounted read-only](/train-cv-model-oss/04-pai-dsw-create.png)

Before training, the notebook downloaded all **1,658 files** from OSS once, using the **oss2** Python SDK (the official OSS library for Python) over the **internal endpoint**. The internal endpoint is the address that works inside Alibaba Cloud's own network, in the same region. The whole download took **2.6 seconds**. After that, the images were cached in RAM, so training never touched OSS again.

The model was a small **CNN** (convolutional neural network, a common model type for images) trained from scratch. It ran **29 epochs in about 30 seconds** (an epoch is one full pass over the training images) and reached **82.5% test accuracy**.

![The notebook running in PAI-DSW: 32 vCPUs detected, AMX available and the mixed_bfloat16 precision policy active](/train-cv-model-oss/05-pai-dsw-notebook.png)

![Round 1 training curves: the small CNN reaches about 0.83 validation accuracy over 29 epochs](/train-cv-model-oss/06-round1-curves.png)

## Round 2: ECS and Python scripts, streaming from OSS

![Round 2: the ECS instance streams the dataset from the OSS bucket during training](/train-cv-model-oss/round2-diagram.png)

For the second round I used Python scripts on an **ECS** instance (a regular cloud virtual machine), run with **uv**, a fast Python package manager that installs each script's dependencies automatically.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
export OSS_ACCESS_KEY_ID=...
export OSS_ACCESS_KEY_SECRET=...
uv run train.py --bucket your-bucket-name --model effnet --epochs 15 --fine-tune-epochs 5
```

The first line installs uv. The two `export` lines give the script your OSS keys for this terminal session. The last line installs everything the script needs and starts training.

This time the data was **streamed**. In simple terms: the script lists the file names in the bucket once. Then, in every epoch, it fetches the images from OSS 64 at a time, uses them in memory, and throws them away. **No images are ever saved on the machine.**

The model was **EfficientNetB0**, a model that was already trained on millions of general images (pretrained). I first trained only its last layer for the date classes, then fine-tuned the whole network. Training took about **2.1 minutes**, images were streamed at about **250 images per second**, and it reached **91.4% test accuracy**.

When training finishes, the script uploads the results automatically to `oss://your-bucket-name/runs/<run-name>/`.

![The end of round 2 in the terminal: training took 2.1 minutes at a median of 250 images/s, and the test accuracy is 0.9143 on 502 images](/train-cv-model-oss/07-round2-results.png)

![Training and validation accuracy and loss over 20 epochs; the dashed line marks where fine-tuning of the whole network starts](/train-cv-model-oss/training_curves.png)

![Confusion matrix on the 502 test images; most predictions are on the diagonal, and Meneifi is the class most often confused with others](/train-cv-model-oss/confusion_matrix.png)

## Download the results to your computer

```bash
ossutil ls oss://your-bucket-name/runs/ -d
ossutil cp -r -u oss://your-bucket-name/runs/ ./runs/
```

The first command lists your training runs. The second copies all of them into a `runs/` folder on your computer, skipping anything you already downloaded.

![The bucket after training, with the new runs folder next to train and test](/train-cv-model-oss/08-oss-runs-folder.png)

You can also download my own round 2 results: the training logs, the test report and the plots (the model file itself is not included).

<a href="/train-cv-model-oss/run-20261027-232349.zip" download>⬇ Download my round 2 results (run-20261027-232349.zip)</a>

## Streaming vs. pre-downloading: when to use which

First, an important point: **the accuracy difference between the two rounds came from the model, not from how the data was loaded.** Round 1 used a small CNN trained from scratch; round 2 used a pretrained EfficientNet. Pre-downloading and streaming give the model exactly the same images, so with the same model they give the same accuracy.

**Pre-download when the dataset is small** and fits on the machine's disk and in RAM:

- Epochs are as fast as possible, because the images come from memory.
- Each file is fetched from OSS only once.
- The setup is the simplest.

This was the better choice for my 20 MB dataset.

**Stream when the dataset is bigger than the machine's disk or RAM**, or when you don't want copies of the data on your compute machines:

- It works at any dataset size, because only the current images are in memory.
- Training starts immediately, without waiting for a download.

The trade-off is one OSS request per file, per epoch. So keep your machine in the **same region** as the bucket and use the **internal endpoint**.

A rule of thumb:

| Dataset size | Approach |
|---|---|
| MBs to a few GB (fits in RAM) | Pre-download once, cache in memory |
| Bigger than RAM, fits on disk | Either works |
| Bigger than disk (hundreds of GB to TBs) | Stream from OSS, on GPU instances |

## What about really big datasets?

Say you have 5 TB of images and audio. A few things change:

- **Train on an ECS GPU instance (or PAI-DLC)** in the same region as the bucket, and stream the data from OSS. Don't copy terabytes onto the machine.
- **Pack the files into large shards** (TFRecord or WebDataset files of about 100 MB to 1 GB each) instead of streaming millions of tiny files.
- **For audio, precompute features** (like spectrograms) once, instead of computing them again in every epoch.
- **Save checkpoints to OSS regularly**, so a long training job can resume after a failure.

Why isn't CPU enough at that size? At 250 images per second, 20 million images would take about **22 hours per epoch**.

## Wrap-up

- Keep your dataset in OSS, and train in the same region using the internal endpoint.
- For small datasets, pre-download once and cache in memory: it is the fastest and simplest.
- For datasets bigger than your machine, stream from OSS, and for terabytes, use shards and GPUs.
- A better model (pretrained EfficientNet) made the real accuracy difference, not the loading method.

When you are done, **stop or release your instances**. Your data and results stay safe in OSS.

The full scripts and the notebook are available in the <a href="/train-cv-model-oss/date-fruit-oss-training.zip" download>project package</a>.
