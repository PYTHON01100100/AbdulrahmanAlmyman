---
distrobox-guide:
  name: "Distrobox: Any Linux Distro Inside Your Terminal"
  caseStudyId: distrobox-guide
  description: A simple guide to Distrobox. What problems it solves, how to install it with apt, dnf and pacman, how to run GUI apps, and a ready-made toolbox for cloud architects.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2026-10-16"
  type: "blog"
---

Publish date: `2026-10-16`

# Distrobox: Any Linux Distro Inside Your Terminal

Have you ever wanted an app that exists only on another Linux distro? Or needed a newer (or older) version of a tool, but upgrading it would break something else on your machine? Distrobox is the tool that fixed this for me. This guide explains what it is, why it is useful, and how to use it step by step, in simple language.

Project page: [github.com/89luca89/distrobox](https://github.com/89luca89/distrobox)

## What is Distrobox?

Distrobox lets you run **another Linux distribution inside your terminal**. You can be on Fedora and open an Ubuntu box, or be on Ubuntu and open an Arch box. Inside it you use that distro's own package manager (`apt`, `dnf`, `pacman`) and install things there, without touching your main system.

It is a thin wrapper around a container manager (`podman`, `docker` or `lilipod`). But unlike a normal container, a Distrobox container is **integrated with your host**:

- it shares your **home directory**, so your files are right there,
- it shares your **display**, so GUI apps open as normal windows,
- it shares audio, USB devices, the network, and the SSH agent.

So it feels like using a second distro on the same machine, with none of the weight of a virtual machine.

## What problems does it solve?

| Problem | How Distrobox helps |
| --- | --- |
| An app or package exists only for another distro (for example the AUR on Arch, or a `.deb` on Ubuntu) | Make a box of that distro, install it there, and run it from your desktop |
| Two tools need conflicting versions of the same library | Put each one in its own box, so they never fight |
| Your distro is **immutable** (Fedora Silverblue, SteamOS, Vanilla OS) and you can't just `apt install` things | Install everything inside a box, and keep the host untouched |
| You want to test something risky or messy | Do it in a box. If it breaks, delete the box and make a new one |
| Your host gets cluttered with dev tools | Keep your toolchain in a box and the host stays clean |
| Working on several clients or cloud accounts, with credentials mixed together | One box per client, each with its own home folder |
| You want to rebuild your setup on a new machine | Write the setup in one file and recreate it with a single command |
| Virtual machines are too heavy and slow | Containers start in seconds and use almost no extra memory |

In short: Distrobox gives you **a safe, disposable, per-project Linux** without leaving your own desktop.

## Install

You need two things: a container manager and Distrobox. I recommend **Podman**, because it runs without root by default.

### Ubuntu / Debian (`apt`)

```bash
sudo apt update
sudo apt install -y podman distrobox
```

### Fedora (`dnf`)

```bash
sudo dnf install -y podman distrobox
```

### Arch / Manjaro (`pacman`)

```bash
sudo pacman -S --needed podman distrobox
```

Distro repositories can ship an older Distrobox version. If `distrobox` is missing or too old on your release, use the install script from the project (stable version):

```bash
curl -fsSL https://raw.githubusercontent.com/89luca89/distrobox/legacy/install | sh
```

Add `-s -- --prefix ~/.local` after `sh` to install into your home folder instead of system-wide, and make sure `~/.local/bin` is in your `PATH`.

Check it works:

```bash
distrobox --version
```

## Create and enter your first container

```bash
distrobox create --name ubuntu-box --image ubuntu:24.04
distrobox enter ubuntu-box
```

The first time, it downloads the image and sets everything up, which takes a minute. After that, your prompt changes. You are now inside Ubuntu, in the same home folder you always use:

```bash
cat /etc/os-release     # shows Ubuntu
sudo apt update         # works inside the box
exit                    # back to your host
```

Other images work the same way: `fedora:latest`, `archlinux:latest`, `debian:latest`, `registry.opensuse.org/opensuse/toolbox:latest`.

## The commands you will use every day

| Command | What it does |
| --- | --- |
| `distrobox create -n NAME -i IMAGE` | Create a container |
| `distrobox enter NAME` | Open a shell inside it |
| `distrobox enter NAME -- COMMAND` | Run one command inside it |
| `distrobox list` (or `ls`) | Show all containers |
| `distrobox stop NAME` | Stop a running container |
| `distrobox rm NAME` | Delete a container |
| `distrobox upgrade --all` | Update the packages in all containers |
| `distrobox ephemeral` | Temporary container, removed when you exit |
| `distrobox assemble create` | Create containers from a manifest file |

## Example 1: A GUI app from Ubuntu, in your app menu

This is the shortest useful example: install an app in a box, then **export** it so it shows up in your normal launcher, like any other app.

I use GIMP here because it is in every repository, but the steps are the same for any desktop app.

```bash
# 1. create and enter an Ubuntu box
distrobox create --name ubuntu-apps --image ubuntu:24.04
distrobox enter ubuntu-apps

# 2. inside the box, install the app
sudo apt update
sudo apt install -y gimp

# 3. export it to the host menu
distrobox-export --app gimp
```

Now open your application launcher and search for **GIMP**. It starts like a native app, but it lives in the Ubuntu box. To remove it from the menu later:

```bash
distrobox-export --app gimp --delete
```

**What about Claude Desktop?** The steps are the same: inside the box, install the app, then run `distrobox-export --app <name>`. If you have a `.deb` package for it that you trust, install it with `sudo apt install ./your-package.deb`. Check whether the vendor offers an official Linux build first, and treat community builds as unofficial software.

You can also export a **command-line tool** so it works from your host terminal:

```bash
distrobox-export --bin /usr/bin/git --export-path ~/.local/bin
```

## Example 2: GUI apps on Fedora and Arch

GUI apps work out of the box on most desktops, because the container shares your X11 and Wayland sockets. The idea is the same everywhere, only the package manager changes.

**Fedora box** (works from any host):

```bash
distrobox create --name fedora-apps --image fedora:latest
distrobox enter fedora-apps

sudo dnf install -y gimp
distrobox-export --app gimp
```

**Arch box:**

```bash
distrobox create --name arch-apps --image docker.io/library/archlinux:latest
distrobox enter arch-apps

sudo pacman -Syu --noconfirm gimp
distrobox-export --app gimp
```

You can also run an app directly without exporting it:

```bash
distrobox enter arch-apps -- gimp
```

### If a GUI app won't open

If you see an error like "cannot open display", the container can't reach the host's X server. Install `xhost` on the **host**, then run:

```bash
xhost +si:localuser:$USER
```

To make it permanent, add this line to `~/.distroboxrc`:

```bash
xhost +si:localuser:$USER >/dev/null
```

If the app still has no clipboard, install `xsel` inside the box on an Xorg desktop.

### Using an NVIDIA GPU

Intel and AMD GPUs work without extra steps. For NVIDIA, create the box with the `--nvidia` flag:

```bash
distrobox create --nvidia --name ubuntu-nvidia --image ubuntu:24.04
```

## Example 3: A toolbox for a cloud architect

This is where Distrobox really shines for my work. Cloud engineers juggle many CLIs (AWS, Alibaba Cloud, Kubernetes, Terraform), several accounts, and credentials that must not get mixed up. A dedicated box per client or account keeps all of it tidy.

Create a box with its **own home folder**, so its credentials and config files stay separate from your main home:

```bash
mkdir -p ~/boxes/client-a
distrobox create --name cloud-client-a --image ubuntu:24.04 --home ~/boxes/client-a
distrobox enter cloud-client-a
```

Inside the box, install the basics and the tools you need:

```bash
sudo apt update
sudo apt install -y git curl unzip jq

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip && sudo ./aws/install

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# ossutil (Alibaba Cloud OSS)
curl -o ossutil.zip https://gosspublic.alicdn.com/ossutil/v2/2.2.0/ossutil-2.2.0-linux-amd64.zip
unzip ossutil.zip && chmod 755 ossutil && sudo mv ossutil /usr/local/bin/
```

Check it:

```bash
aws --version
kubectl version --client
ossutil version
```

Run `aws configure` or `ossutil config` inside this box, and those credentials stay in `~/boxes/client-a`, never in your real home. Make another box for the next client, and the two never touch.

### Save the whole setup in one file

Instead of repeating commands, write the box as a manifest. Create `distrobox.ini`:

```ini
[cloud-client-a]
image=ubuntu:24.04
home=/home/YOUR_USER/boxes/client-a
additional_packages="git curl unzip jq"
init_hooks="echo 'cloud toolbox ready'"
replace=true
```

Then create it (or recreate it on a new laptop) with one command:

```bash
distrobox assemble create
```

Remove everything in the manifest with `distrobox assemble rm`. Add `--dry-run` to preview what would run.

## Good habits

- **Keep boxes small and specific.** One box for GUI apps, one per project or client.
- **Update them.** Run `distrobox upgrade --all` now and then.
- **Throw away what you don't need.** `distrobox rm NAME` is cheap, and a fresh box takes a minute.
- **Back up the manifest, not the box.** The `distrobox.ini` file is what you actually need to rebuild.

## Security: it is not a sandbox

Distrobox is built for **convenience, not isolation**. Containers can read and write your home folder, and if you use Docker (or Podman with `--root`), the container runs as root, which can affect the host. For a safer setup use **rootless Podman**, and don't run software you don't trust inside a box that shares your home. A separate `--home` folder, as in Example 3, helps limit what a box can see.

## Troubleshooting

- **`distrobox: command not found`:** if you installed to `~/.local`, add `export PATH="$HOME/.local/bin:$PATH"` to your shell profile.
- **Image won't download:** check your internet connection, or use the full registry name, for example `docker.io/library/archlinux:latest`.
- **A GUI app doesn't open:** see the `xhost` step above.
- **A box misbehaves:** `distrobox stop NAME`, then `distrobox rm NAME`, then create it again. This is the "cattle, not pets" idea in action.
- **Docker complaining about rootless mode:** rootless Docker doesn't work as expected with Distrobox. Use Podman instead.

## Conclusion

Distrobox gives you the freedom of every Linux distro on one machine. You can run apps your distro doesn't ship, keep your host clean, separate your cloud accounts, and rebuild everything from a single file. Start with one Ubuntu box and one GUI app. Once you see how quickly you can create and delete a box, you will use it for everything.

## References

- [Distrobox on GitHub](https://github.com/89luca89/distrobox)
- [Distrobox: useful tips (NVIDIA, GUI, separate home)](https://github.com/89luca89/distrobox/blob/main/docs/useful_tips.md)
- [distrobox-export usage](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-export.md)
- [distrobox-assemble usage](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-assemble.md)
- [Podman](https://podman.io/)
