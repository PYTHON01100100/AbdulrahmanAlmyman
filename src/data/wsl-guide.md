---
wsl-guide:
  name: "WSL: Use Linux on Windows Without a Virtual Machine"
  caseStudyId: wsl-guide
  description: A simple guide to Windows Subsystem for Linux (WSL). What problems it solves, how to install it, how to try Ubuntu, Arch, Fedora and Kali, and how DevOps and AI engineers use it, including GPU acceleration.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2026-10-16"
  type: "blog"
---

Publish date: `2026-10-16`

# WSL: Use Linux on Windows Without a Virtual Machine

Many people use Windows every day, but sooner or later a task needs Linux. A DevOps tool only has Linux instructions. An AI tutorial starts with `apt install`. A teacher says "open a terminal" and means a Linux one. Or you simply want to **try Linux for the first time** and learn its commands, without wiping your computer.

You don't need a virtual machine or a dual boot for that anymore. **Windows Subsystem for Linux (WSL)** gives you a real Linux terminal inside Windows, installed with one command. This guide explains what it is, the problems it solves, who benefits, and how to use it step by step, in simple language.

## What is WSL?

WSL is a feature of Windows that lets you **run a Linux environment on your Windows machine**, without a separate virtual machine and without dual booting. You install a Linux distribution such as Ubuntu, Debian, Kali, Arch or Fedora, and use Linux apps, utilities and Bash command-line tools directly on Windows, unmodified.

A short history, so the names make sense:

| Version | What it is |
| --- | --- |
| **WSL 1** (2016) | A compatibility layer. Windows translated Linux system calls. It is lighter, but it can't run all Linux software |
| **WSL 2** (2019 and later) | Runs a **real Linux kernel** inside a lightweight virtual machine that Windows manages for you. More compatible and faster for files inside Linux |
| **Open source** (May 2025) | Microsoft released most of WSL as open source. Its code is on GitHub at [microsoft/WSL](https://github.com/microsoft/WSL) |

New installs use **WSL 2** by default, and you can run WSL 1 and WSL 2 distributions side by side.

## What problems does it solve?

| Problem | How WSL helps |
| --- | --- |
| A tool, tutorial or course only supports Linux | Open a Linux terminal in seconds and follow it exactly |
| You want to learn Linux, but you are afraid to break your computer | WSL is separate from your Windows files. Break it, delete it, and reinstall it |
| Virtual machines are heavy and slow to start | WSL starts in about a second and uses far less memory than a full VM |
| Dual boot means rebooting and repartitioning | You stay in Windows and use Linux in a window next to your normal apps |
| Windows tools don't match the servers you deploy to | Develop in the same Linux environment as production (Ubuntu, Debian and others) |
| You need a GPU for machine learning, and Linux support is better | WSL can use your GPU for ML workloads |
| You want to test several distros | Install Ubuntu, Arch, Fedora and Kali side by side, each in its own space |

In short: WSL gives you **the best of both worlds**. Windows for your daily apps, Linux for your tools.

## Who is it for, and what changes for you?

**If you want to try Linux for the first time.** You learn real commands (`ls`, `cd`, `grep`, `apt`) with no risk. If you make a mistake, nothing on Windows is harmed. This is the safest way to start, and the skills transfer directly to servers and cloud machines.

**If you are a DevOps or cloud engineer.** Most of your tools live on Linux: shell scripts, `kubectl`, Terraform, Ansible, Docker, SSH, and cloud CLIs. With WSL you use the same commands as your servers while keeping Windows for email, meetings and office apps. Your scripts behave the same on your laptop and in the pipeline.

**If you want to become an AI engineer.** Most ML tutorials and frameworks are written for Linux. WSL lets you use Python, virtual environments, Docker containers, and your **GPU** from Windows. You can follow tutorials as written and train or run models locally.

**If you are a student or web developer.** Use Node.js, Python, Git, databases and web servers in a Linux environment, and edit the code from VS Code on Windows.

## How it works, simply

With WSL 2, Windows starts a small, lightweight virtual machine in the background and runs a real Linux kernel inside it. Each distro you install lives in its own isolated space on top of that, with its own files, users and processes. You don't manage the VM yourself. Windows starts and stops it as you need it.

![WSL architecture: Windows components (wsl.exe, wslservice.exe) talk over hvsocket to the Linux side (mini_init, the distribution's init, plan9 and more)](/wsl-guide/wsl-architecture.png)

In the diagram, the top box is Windows (the `wsl.exe` command and the `wslservice.exe` service). The bottom box is the Linux side inside the lightweight VM, where each distribution runs. They talk to each other over a fast channel called `hvsocket`, and `plan9` is what shares Linux files with Windows. You can read more about each component on [wsl.dev](https://wsl.dev/).

Two things make it feel integrated:

- **Files are shared.** Windows drives appear in Linux under `/mnt/c`, and Linux files show up in Windows Explorer under `\\wsl.localhost\`.
- **Commands mix.** You can call Windows programs from Linux and Linux programs from PowerShell.

WSL can also run **Linux GUI apps** on the Windows desktop (this part is called WSLg).

## What you need

- **Windows 11**, or **Windows 10 version 2004 or later** (build 19041 and above) for the one-command install below.
- Virtualization enabled in your computer's firmware (BIOS/UEFI). Most computers have it on already.
- An administrator account for the first install.

For older Windows builds or servers, see the manual steps later in this guide.

## Install WSL

Open **PowerShell as Administrator** (right-click the Start menu, then choose Terminal or PowerShell as administrator) and run:

```powershell title="PowerShell (Windows)"
wsl --install
```

This turns on the features WSL needs and installs **Ubuntu** by default. Restart your computer when it asks.

The first time you open Ubuntu from the Start menu, wait a minute while it unpacks, then choose a **username and password** for Linux. Later launches take about a second.

### Pick a different distro

List what you can install, then install the one you want by its name:

```powershell title="PowerShell (Windows)"
wsl --list --online
wsl --install -d <DistroName>
```

Replace `<DistroName>` with a name from the list. If the install seems stuck at 0.0%, download the distro first:

```powershell title="PowerShell (Windows)"
wsl --install --web-download -d <DistroName>
```

If you run `wsl --install` and only see help text, WSL is already installed. Use the two commands above to add a distro.

### Check that it works

```powershell title="PowerShell (Windows)"
wsl --list --verbose
```

You should see your distro with the **VERSION** column set to `2`.

![My WSL setup: Ubuntu 24.04 updating with apt, neofetch showing the WSL 2 kernel, and the vllm and kubectl commands installed](/wsl-guide/wsl-setup.jpg)

This is my own setup. In the screenshot, one Ubuntu 24.04 window is downloading updates with `apt`. In PowerShell, typing `wsl` opens Ubuntu and `neofetch` shows the system information, including the **WSL 2 kernel**. The third window already has `vllm` and `kubectl` installed, the same tools I use for LLM serving and Kubernetes work.

## Your first minutes in Linux

Open Ubuntu from the Start menu, or type `wsl` in PowerShell. You are now in a Linux shell. Try some basics:

```bash title="Ubuntu terminal (inside WSL)"
pwd                  # where am I?
ls -la               # list files, including hidden ones
mkdir projects       # create a folder
cd projects          # go into it
echo "hello" > a.txt # write a file
cat a.txt            # read it
cd ~                 # go back to your home folder
```

Then update the system and install a tool. On Ubuntu and Debian the package manager is `apt`:

```bash title="Ubuntu terminal (inside WSL)"
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl unzip jq
```

Every distro has its own package manager, which is a good reason to try more than one:

| Distro family | Package manager | Example |
| --- | --- | --- |
| Ubuntu, Debian, Kali | `apt` | `sudo apt install git` |
| Fedora | `dnf` | `sudo dnf install git` |
| Arch | `pacman` | `sudo pacman -S git` |

## Try Arch, Fedora and Kali

You can install several distros and switch between them. Run `wsl --list --online` to see the exact names, then install each one:

```powershell title="PowerShell (Windows)"
# use the exact names from "wsl --list --online"
wsl --install -d <ArchName>
wsl --install -d <FedoraName>
wsl --install -d <KaliName>
```

Then start a specific one:

```powershell title="PowerShell (Windows)"
wsl -d <DistroName>
```

- **Ubuntu or Debian:** the easiest start, with the most tutorials online.
- **Fedora:** a modern, well-maintained distro that uses `dnf`.
- **Arch:** a minimal system you build yourself with `pacman`. Great for learning how Linux fits together.
- **Kali:** a distro with security tools. Use those tools **only on systems you own or have written permission to test**.

If a distro isn't in the list, you can [import it from a TAR file](https://learn.microsoft.com/en-us/windows/wsl/use-custom-distro) instead.

## Working with files

Windows and Linux can reach each other's files, but one rule makes a big difference to speed:

> **Keep your projects inside the Linux file system** (for example `~/projects`), not under `/mnt/c`. Files in Linux are much faster to work with, and tools like Git and package managers behave better there.

Useful tricks:

```bash title="Ubuntu terminal (inside WSL)"
ls /mnt/c/Users            # your Windows drive, seen from Linux
explorer.exe .             # open the current Linux folder in Windows Explorer
code .                     # open the folder in VS Code (if it is installed on Windows)
```

From PowerShell you can run Linux commands without opening a shell:

```powershell title="PowerShell (Windows)"
wsl ls -la
wsl date
```

## The commands you will use every day

| Command (in PowerShell) | What it does |
| --- | --- |
| `wsl --install -d <Distro>` | Install a distro |
| `wsl --list --online` | Show distros you can install |
| `wsl --list --verbose` | Show installed distros, their state and WSL version |
| `wsl -d <Distro>` | Start a specific distro |
| `wsl --set-default <Distro>` | Choose which distro `wsl` opens by default |
| `wsl --terminate <Distro>` | Stop one distro |
| `wsl --shutdown` | Stop all distros and the WSL virtual machine |
| `wsl --update` | Update WSL |
| `wsl --export <Distro> <file.tar>` | Back up a distro to a file |
| `wsl --import <Name> <folder> <file.tar>` | Restore or clone a distro from a backup |
| `wsl --unregister <Distro>` | **Delete** a distro and all its files |

Be careful with `--unregister`. It removes everything inside that distro, so back it up first with `--export` if you care about the data.

## Use case 1: A DevOps toolbox

Because WSL is real Linux, you install tools the same way you do on a server. For example:

```bash title="Ubuntu terminal (inside WSL)"
sudo apt update
sudo apt install -y git curl unzip jq

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip && sudo ./aws/install

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# check
aws --version
kubectl version --client
```

For containers, you can use **Docker Desktop** (it can use WSL 2) or install the Docker engine directly inside WSL (see the GPU example below).

Want one separate toolbox per client or account? Combine WSL with Distrobox. I explain it in my guide [Distrobox: Any Linux Distro Inside Your Terminal](/case-study/distrobox-guide).

## Use case 2: GPU acceleration for AI and machine learning

This is why many AI engineers use WSL. The Microsoft tutorial [GPU accelerated ML training in WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gpu-compute) shows two ways to use your graphics card for ML:

- **NVIDIA CUDA**, if you have an NVIDIA GPU. You run a machine learning framework in a container.
- **TensorFlow-DirectML and PyTorch-DirectML**, which work on AMD, Intel or NVIDIA GPUs.

**What you need first:** Windows 11 (or Windows 10 21H2 or later), WSL installed, and the **latest driver for your GPU installed on Windows**. You install the driver on Windows, not inside Linux.

### Example: NVIDIA CUDA with Docker (from the tutorial)

Install Docker inside WSL:

```bash title="Ubuntu terminal (inside WSL)"
curl https://get.docker.com | sh
sudo service docker start
```

If you installed the Docker engine directly (and not Docker Desktop), you also need the **NVIDIA Container Toolkit**. The tutorial adds its repository and installs it:

```bash title="Ubuntu terminal (inside WSL)"
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-docker-keyring.gpg
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-docker-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-docker2
```

Then run a machine learning framework container with GPU access, and try the sample model inside it:

```bash title="Ubuntu terminal (inside WSL)"
docker run --gpus all -it --shm-size=1g --ulimit memlock=-1 --ulimit stack=67108864 nvcr.io/nvidia/tensorflow:20.03-tf2-py3

# inside the container
cd nvidia-examples/cnn/
python resnet.py --batch_size=64
```

These steps are copied from the Microsoft tutorial, which has not been rewritten in a while. Container versions and NVIDIA's package repositories change, so check the [NVIDIA CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl) for the current steps before you copy them.

### Example: DirectML (AMD, Intel or NVIDIA)

The tutorial sets up a Python environment with Miniconda, then installs the framework:

```bash title="Ubuntu terminal (inside WSL)"
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
conda create --name directml python=3.7 -y
conda activate directml

pip install tensorflow-directml
```

Or, for PyTorch:

```bash title="Ubuntu terminal (inside WSL)"
sudo apt install libblas3 libomp5 liblapack3
pip install torch-directml
```

The tutorial uses an old Python version (3.7), so pick a version that your framework supports today.

If you have **more than one GPU**, WSL can use only one at a time. Choose it with an environment variable, using the name from Windows Device Manager:

```bash title="Ubuntu terminal (inside WSL)"
export MESA_D3D12_DEFAULT_ADAPTER_NAME="<NameFromDeviceManager>"
```

### My own test: Ollama and OpenCode with qwen3:8b in WSL

I also tried this myself. In my video I run **Ollama** inside WSL with the **qwen3:8b** model and connect **OpenCode** to it, so the model runs locally on my own GPU:

**Video: [using opencode with ollama inside wsl](https://youtu.be/CCG23ATWdfU)**

The Ollama part takes only a few commands inside your distro:

```bash title="Ubuntu terminal (inside WSL)"
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen3:8b
ollama run qwen3:8b
```

**Want to try the same with vLLM?** vLLM can serve the same kind of model with an OpenAI-compatible API. Inside WSL (with your GPU driver installed on Windows):

```bash title="Ubuntu terminal (inside WSL)"
python3 -m venv ~/vllm-env && source ~/vllm-env/bin/activate
pip install vllm
vllm serve Qwen/Qwen3-8B
```

The server listens on `http://localhost:8000/v1`, so you can point any tool that supports an OpenAI-compatible endpoint (such as OpenCode) at that address and compare it with Ollama. An 8B model in full precision needs a lot of GPU memory (roughly 16 GB), so on a smaller card use a quantized version of the model. For a production-style setup of the same idea, see my article [Serving Large Language Models with LiteLLM and vLLM on Alibaba Cloud ACK](/case-study/llm-serving-litellm-vllm-ack).

## Run Linux GUI apps

WSL can show Linux graphical apps in normal Windows windows. Try a tiny one:

```bash title="Ubuntu terminal (inside WSL)"
sudo apt install -y x11-apps
xcalc
```

A calculator opens on your Windows desktop. Any Linux GUI app you install works the same way.

## systemd and services

Many Linux services expect `systemd`. You can turn it on per distro by editing `/etc/wsl.conf`:

```bash title="Ubuntu terminal (inside WSL)"
sudo nano /etc/wsl.conf
```

Add these two lines:

```text title="/etc/wsl.conf"
[boot]
systemd=true
```

Then restart WSL from PowerShell with `wsl --shutdown` and open your distro again.

## Limit how much memory WSL uses

WSL 2 can use a lot of RAM on a small laptop. Create a file named `.wslconfig` in your Windows user folder (`C:\Users\YOUR_NAME\.wslconfig`):

```text title=".wslconfig"
[wsl2]
memory=8GB
processors=4
```

Run `wsl --shutdown` for it to take effect.

## WSL, virtual machine, dual boot, or Distrobox?

| | WSL | Virtual machine | Dual boot |
| --- | --- | --- | --- |
| Setup | One command | Install an OS in VirtualBox or similar | Repartition disk, install, reboot |
| Start time | About a second | Boot a whole OS | Reboot |
| Resource use | Low | High | Full machine |
| Linux next to Windows apps | Yes | In a separate window | No, one OS at a time |
| Full Linux desktop and any kernel | Not the goal | Yes | Yes |
| Best for | CLI tools, dev, DevOps, ML, learning | Testing a full OS or desktop | Using Linux as your main OS |

**WSL vs Distrobox:** WSL brings Linux to **Windows**. Distrobox runs different distros as containers on **a Linux machine**. They work well together: you can run Distrobox inside a WSL distro if you want many separate toolboxes.

## Good habits and limits

- **Keep code in the Linux file system**, not `/mnt/c`, for speed.
- **Back up** important distros with `wsl --export`.
- **Update** WSL and your distro now and then: `wsl --update`, then `sudo apt update && sudo apt upgrade` inside Linux.
- **WSL is made for development**, not as a production server. Disk access across Windows and Linux can be slower than on a native Linux machine.
- **WSL is not exactly a full Linux install.** WSL 2 has a real kernel, but for example a full desktop environment or custom kernel modules need more work.

## Troubleshooting

- **"Virtualization is not enabled" or error `0x80370102`:** turn on virtualization (Intel VT-x or AMD-V) in your BIOS/UEFI settings.
- **Install stuck at 0.0%:** use `wsl --install --web-download -d <DistroName>`.
- **`wsl --install` only prints help:** WSL is already installed. Use `wsl --list --online`, then `wsl --install -d <DistroName>`.
- **An old version of Windows:** use the manual steps below.
- **Something feels broken after an update:** run `wsl --update`, then `wsl --shutdown` and open your distro again.

### Manual install (older Windows builds and servers)

If `wsl --install` isn't supported on your build, enable the two Windows features by hand. In PowerShell as Administrator:

```powershell title="PowerShell (Windows)"
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Restart, then download and run the WSL 2 Linux kernel update package from the [manual install guide](https://learn.microsoft.com/en-us/windows/wsl/install-manual), and set WSL 2 as the default:

```powershell title="PowerShell (Windows)"
wsl --set-default-version 2
```

Finally, install a distro from the Microsoft Store. If the Store isn't available, the same guide lists direct download links and the `Add-AppxPackage` command.

## Conclusion

WSL removes the biggest barrier to using Linux on Windows: you don't have to choose. With one command you get a real Linux terminal, a fast way to learn commands, the tools DevOps engineers use every day, and a path to GPU-powered AI work, all without leaving Windows. Start with Ubuntu, try Fedora or Arch when you are curious, back up what you care about, and keep your projects inside Linux. After a week of using it, you will wonder why you ever thought you needed a virtual machine.

## References

- [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Microsoft Learn)
- [Manual installation steps for older versions of WSL](https://learn.microsoft.com/en-us/windows/wsl/install-manual) (Microsoft Learn)
- [What is Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/about) (Microsoft Learn)
- [Open Source WSL](https://learn.microsoft.com/en-us/windows/wsl/opensource) (Microsoft Learn)
- [GPU accelerated ML training in WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gpu-compute) (Microsoft Learn tutorial, used for the GPU examples)
- [wsl.dev](https://wsl.dev/): the developer documentation site for WSL (architecture, building and testing WSL, and APIs)
- [Windows Subsystem for Linux](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux) (Wikipedia)
- [microsoft/WSL on GitHub](https://github.com/microsoft/WSL)
- [My video: using opencode with ollama inside wsl](https://youtu.be/CCG23ATWdfU)
- [NVIDIA CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl)
