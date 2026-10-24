---
aws-alibaba-ipsec-direct-vpc:
  name: "AWS to Alibaba Cloud IPsec VPN, Direct to the VPC (No Transit Router)"
  caseStudyId: aws-alibaba-ipsec-direct-vpc
  description: A simpler version of my AWS and Alibaba Cloud site-to-site VPN lab, terminating the IPsec tunnels on an Alibaba VPN gateway attached directly to the VPC, with BGP and the troubleshooting I had to do.
  repo: ""
  url: ""
  images: []
  show: true
  date: "2026-10-25"
  type: "blog"
---

Publish date: `2026-10-25`

# AWS to Alibaba Cloud IPsec VPN, Direct to the VPC (No Transit Router)

In my [previous lab](/case-study/aws-alibaba-ipsec-vpn) I connected AWS and Alibaba Cloud through a **CEN Transit Router**, with a Cloud Firewall in the middle. That design is great when you have many VPCs, but it has more moving parts and more cost.

This time I built the same connection the **direct** way: the IPsec tunnels end on an **Alibaba VPN gateway attached straight to the VPC**. Same goal (an EC2 in AWS and an ECS in Alibaba Cloud talking over private IPs, encrypted, with BGP), fewer components.

> **Note:** the Alibaba Cloud public IPs in this article and its screenshots are replaced with example IPs (`44.44.23.13` and `44.44.23.14`), and all pre-shared keys are hidden. Use your own values.

## Transit Router or direct to the VPC?

| | Direct to VPC (this article) | Through a Transit Router ([previous lab](/case-study/aws-alibaba-ipsec-vpn)) |
| --- | --- | --- |
| Alibaba components | VPN gateway in the VPC | CEN, Transit Router, VPN and VPC attachments |
| Reaches | One VPC | Many VPCs and regions through CEN |
| Cloud Firewall on the path | No | Yes, a VPC firewall on the TR |
| Hops | Fewer (TTL 63 in my test) | More (TTL 60 to 62) |
| Setup effort and cost | Lower | Higher |
| Best for | One VPC, a proof of concept, a small setup | A hub-and-spoke network that will grow |

If you only need one Alibaba VPC to talk to AWS, the direct way is the simpler choice.

## Architecture

![Architecture: the AWS VPC with an EC2 in a private subnet connects through the virtual private gateway's two tunnels to the Alibaba VPN gateway, which sits directly in the main VPC with vSwitch A and vSwitch B](/aws-alibaba-vpn-direct/architecture.png)

<a href="/aws-alibaba-vpn-direct/aws-alibaba-vpn-direct.drawio" download="aws-alibaba-vpn-direct.drawio">⬇ Download the editable diagram (aws-alibaba-vpn-direct.drawio)</a>

## The services on each side

**Alibaba Cloud (SAU Riyadh)**

- **VPC** with two vSwitches (Zone A and Zone B)
- **VPN gateway** (IPsec-VPN, dual tunnel)
- **Customer gateways** and an **IPsec connection** bound to the VPN gateway
- **IPsec tunnel logs** for troubleshooting
- **ECS** to test ping and SSH

**AWS (US East, N. Virginia)**

- **VPC** with a private subnet
- **Virtual private gateway (VGW)**
- **Customer gateway** and **Site-to-Site VPN connection**
- **CloudWatch Logs** for tunnel and BGP logs
- **EC2** with no public IP, to test the connection

## The IP plan

| Item | Value |
| --- | --- |
| AWS VPC | `172.31.0.0/16` |
| AWS private subnet | `172.31.64.0/20` |
| AWS EC2 | `172.31.71.127` |
| Alibaba VPC | `192.159.0.0/16` |
| vSwitch A / vSwitch B | `192.159.5.0/24` / `192.159.10.0/24` |
| Alibaba ECS | `192.159.5.219` |
| Alibaba VPN gateway (tunnel 1 / tunnel 2) | `44.44.23.13` / `44.44.23.14` (examples) |
| AWS tunnel outside IPs (tunnel 1 / tunnel 2) | `34.193.229.239` / `100.55.147.255` |
| BGP inside CIDR, tunnel 1 | `169.254.151.240/30`: AWS `.241`, Alibaba `.242` |
| ASN | AWS `64512` (Amazon default), Alibaba `45104` |

As in my first lab, `192.159.0.0/16` is a public range used only for this lab. In production, use non-overlapping [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private ranges.

**Remember the golden rule:** a customer gateway always describes the **other** side. The AWS customer gateway holds Alibaba's IP and ASN, and the Alibaba customer gateways hold AWS's tunnel IPs and ASN.

## Why this order of steps?

Each side needs the other side's public IP. In the direct design the order is clean, with no placeholder needed:

1. Create the **Alibaba VPN gateway** first. It gives you Alibaba's public IPs immediately.
2. In AWS, create the **customer gateway** with Alibaba's IP, then the **VPN connection**. It gives you AWS's tunnel IPs and pre-shared keys.
3. Back in Alibaba, create the **customer gateways** with AWS's tunnel IPs, then the **IPsec connection**.

## Step 1 (Alibaba): Create the VPN gateway

In the VPN console, create a VPN gateway in the VPC's region:

- **Gateway type:** Standard, **network type:** Public, **tunnels:** Dual-tunnel
- **VPC:** your VPC, with a vSwitch in **Zone A** and a second one in **Zone B**
- **Bandwidth:** 100 Mbit/s was enough for the lab
- **IPsec-VPN:** Enable (SSL-VPN not needed)

![Creating the Alibaba VPN gateway alibaba-aws-vpngw in SAU Riyadh: Standard, Public, Dual-tunnel, attached to the VPC with vSwitches in Zone A and Zone B, IPsec-VPN enabled](/aws-alibaba-vpn-direct/01-alibaba-vpn-gateway.png)

When it is active, note its two IPsec addresses. These are Alibaba's public IPs for tunnel 1 and tunnel 2.

![The VPN gateway is active with IPsec address 1 (44.44.23.13) and IPsec address 2 (44.44.23.14)](/aws-alibaba-vpn-direct/01b-alibaba-vpn-gateway-ips.png)

## Step 2 (AWS): Create the virtual private gateway

Create a virtual private gateway with the **Amazon default ASN (`64512`)** and attach it to your VPC.

![Creating the AWS virtual private gateway with the Amazon default ASN 64512](/aws-alibaba-vpn-direct/02-aws-vgw.png)

## Step 3 (AWS): Create the customer gateway

Create a customer gateway that represents **Alibaba**: BGP ASN **`45104`** and Alibaba's **tunnel 1 IP** (`44.44.23.13`).

![Creating the AWS customer gateway with BGP ASN 45104 and Alibaba's VPN IP 44.44.23.13](/aws-alibaba-vpn-direct/03-aws-cgw.png)

## Step 4 (AWS): Create the Site-to-Site VPN connection

Create the VPN connection with the virtual private gateway, the customer gateway from step 3, **dynamic (BGP) routing**, and **tunnel logging** to CloudWatch. Then click **Download configuration** and pick **Generic**: it has the pre-shared key and IKE settings for each tunnel, so you never retype them.

![The AWS VPN connection: customer gateway 44.44.23.13, dynamic routing, tunnel 1 at 34.193.229.239 and tunnel 2 at 100.55.147.255, both down until Alibaba is configured](/aws-alibaba-vpn-direct/04-aws-vpn-connection.png)

Both tunnels are **down** for now. That is expected: Alibaba is not configured yet.

## Step 5 (Alibaba): Create the customer gateways

Create one customer gateway per AWS tunnel, both with AWS's ASN **`64512`**:

- `Main`: `34.193.229.239` (AWS tunnel 1)
- `backup`: `100.55.147.255` (AWS tunnel 2)

![Creating the Alibaba customer gateway backup with AWS tunnel 2's IP 100.55.147.255 and ASN 64512](/aws-alibaba-vpn-direct/05-alibaba-cgw.png)

Look closely at the list behind the form: my first two customer gateways had ASN **`63512`**, a typo for 64512. That one digit broke BGP, as you will see in the troubleshooting section.

## Step 6 (Alibaba): Create the IPsec connection

Create an IPsec-VPN connection and **bind it to the VPN gateway** from step 1:

- **Routing mode:** Destination routing
- **Effective immediately:** Yes
- **Tunnel 1 (Primary):** customer gateway `Main`, with the **pre-shared key of AWS tunnel 1**
- **Tunnel 2 (Backup):** customer gateway `backup`, with the **pre-shared key of AWS tunnel 2**

![Creating the Alibaba IPsec connection bound to the VPN gateway, with destination routing mode](/aws-alibaba-vpn-direct/06-alibaba-ipsec-1.png)

Copy the encryption settings from the AWS configuration file. In my lab:

| Setting | Phase 1 (IKE) | Phase 2 (IPsec) |
| --- | --- | --- |
| Version / mode | IKEv2, main | |
| Encryption | AES128 | AES128 |
| Authentication | SHA1 | SHA1 |
| DH group | group2 | group2 (PFS) |
| SA lifetime | 86400 s | 86400 s |

![Tunnel 1 settings: customer gateway Main, pre-shared key (hidden), IKEv2, AES128, SHA1, DH group2](/aws-alibaba-vpn-direct/06b-alibaba-ipsec-2.png)

Enable **DPD** and **NAT traversal**, then set up the backup tunnel the same way:

![Phase 2 settings with DPD and NAT traversal enabled, and the backup tunnel with its own pre-shared key (hidden)](/aws-alibaba-vpn-direct/06c-alibaba-ipsec-3.png)

Tunnel 1 negotiated phase 2 right away:

![IPsec connection status: tunnel 1 (primary) phase 2 negotiations succeeded and up, tunnel 1 (backup) phase 1 failed](/aws-alibaba-vpn-direct/07-alibaba-ipsec-status.png)

## Step 7: Enable BGP and troubleshoot

Encryption working is only half the job. Next, enable **BGP** on the IPsec connection so the two sides exchange routes. This is where my lab needed real troubleshooting.

### What I saw

Phase 2 succeeded, but **BGP stayed abnormal**:

![Tunnel 1: phase 2 succeeded but BGP abnormal, with tunnel CIDR 169.254.10.0/30 and local BGP IP 169.254.10.1](/aws-alibaba-vpn-direct/08-bgp-abnormal.png)

Two separate problems were hiding here.

**Problem 1: the inside CIDR did not match.** Alibaba used `169.254.10.0/30` (local IP `.1`), but AWS had assigned tunnel 1 `169.254.151.240/30`. Both sides must use the **same /30**, and AWS always takes the first usable IP (`.241`), so Alibaba must use `.242`.

**Problem 2: the ASN did not match.** The AWS BGP logs in CloudWatch show the exact error. AWS receives an OPEN message from Alibaba (`AS 45104`), sends its own (`AS 64512`), and then the session is rejected with **`OPEN Message Error/Bad Peer AS`**, again and again:

![AWS CloudWatch BGP logs: the session goes Connect, OpenSent, OpenConfirm, then receives OPEN Message Error/Bad Peer AS and drops back to Idle, while the DPD logs show the IPsec tunnel itself is established](/aws-alibaba-vpn-direct/08b-aws-logs-bad-peer-as.png)

"Bad Peer AS" means one side is told to expect a different ASN than the one the other side announces. My Alibaba customer gateways said `63512`, but AWS announces `64512`. The same logs also show `ike_phase1_state` and `ike_phase2_state` as **established** with DPD working, which proves the encryption was fine and the problem was only BGP.

On the AWS side, **Modify VPN tunnel options** shows the inside CIDR and lets you turn on tunnel logging, which is where these logs come from:

![AWS Modify VPN tunnel options: tunnel logging on, inside IPv4 CIDR 169.254.151.240/30, pre-shared key hidden](/aws-alibaba-vpn-direct/08c-aws-tunnel-options.png)

### The fix

1. **Customer gateways:** create them again with the correct ASN **`64512`**, and switch the IPsec connection to them.
2. **BGP configuration:** use the tunnel CIDR that AWS assigned (`169.254.151.240/30`) and the second usable IP as Alibaba's local BGP IP (`169.254.151.242`). The local ASN must be the ASN on the AWS customer gateway (`45104`).

![Alibaba BGP configuration with tunnel CIDR 169.254.151.240/30 and local BGP IP 169.254.151.242 for the primary tunnel](/aws-alibaba-vpn-direct/08d-alibaba-bgp-fixed.png)

The Alibaba tunnel logs (**View Logs**) are useful too: they show the IKEv2 exchange between Alibaba and AWS tunnel 1:

![Alibaba tunnel logs: IKEv2 SA_INIT exchange sent from 44.44.23.13 to AWS tunnel 1 at 34.193.229.239](/aws-alibaba-vpn-direct/08e-alibaba-tunnel-logs.png)

### Troubleshooting checklist from my lab

- **Verify inside IPv4 CIDR alignment.** The link-local /30 must match exactly on both providers, and the local and remote peer IPs must not be inverted or crossed between the tunnels: AWS takes `.1` of the /30, the customer side `.2`.
- **Resolve peer ASN mismatches.** A `Bad Peer AS` error drops the BGP handshake. Make sure the Alibaba customer gateway targets the **AWS ASN (`64512` by default)** as its remote neighbor, and that Alibaba's local ASN matches the ASN on the AWS customer gateway.
- **Isolate the layer.** Check the DPD and IKE logs first. If IPsec phase 2 is stable while BGP keeps looping through Connect and Active, the tunnel is fine and the problem is BGP itself: wrong ASN, wrong neighbor IPs, or BGP traffic (TCP port 179) not getting through.
- **Read both sides' logs.** AWS CloudWatch tunnel and BGP logs, and Alibaba **View Logs** on each tunnel.
- **Tunnel 2 needs its own AWS VPN connection.** An AWS VPN connection has one customer gateway IP, and both AWS tunnels terminate on it. Alibaba's dual tunnel uses two different IPs (`44.44.23.13` and `44.44.23.14`), so for full redundancy you need a second AWS customer gateway and VPN connection for `44.44.23.14`. That is why the backup tunnel's phase 1 fails in this lab.

## Step 8: Results

After the fix, Alibaba shows **phase 2 succeeded and BGP normal** on tunnel 1:

![Alibaba IPsec connection: tunnel 1 phase 2 succeeded and BGP normal with tunnel CIDR 169.254.151.240/30 and local BGP IP 169.254.151.242](/aws-alibaba-vpn-direct/09-alibaba-bgp-normal.png)

And AWS shows tunnel 1 **Up with 2 BGP routes**:

![AWS tunnel state: tunnel 1 Up with 2 BGP routes, tunnel 2 down](/aws-alibaba-vpn-direct/09b-aws-tunnel-up.png)

The CloudWatch logs now show a quiet, healthy tunnel: DPD requests answered every 10 seconds, with both IKE phases established:

![AWS CloudWatch logs with the tunnel up: DPD requests and replies every 10 seconds, phase 1 and phase 2 established](/aws-alibaba-vpn-direct/09c-aws-logs-tunnel-up.png)

Before testing, make sure the routes reach the VPCs. On AWS, enable **route propagation** for the virtual private gateway (or add the Alibaba CIDRs pointing to it). On Alibaba, the routes learned over BGP must be advertised to the VPC (the VPN gateway's automatic route advertisement), or add VPC routes pointing to the VPN gateway. Security groups and network ACLs work exactly as in my [first lab](/case-study/aws-alibaba-ipsec-vpn).

## Step 9: Test the connection

From the Alibaba ECS to the AWS EC2, and back:

```bash title="Alibaba ECS (192.159.5.219)"
ping 172.31.71.127
ssh -i aws-key.pem ubuntu@172.31.71.127
```

```bash title="AWS EC2 (172.31.71.127)"
ping 192.159.5.219
```

![Ping from the ECS to the EC2 with 0% loss, SSH into the EC2 over its private IP, and ping back to the ECS](/aws-alibaba-vpn-direct/10-test.png)

**0% packet loss** in both directions, about **148 ms** from Riyadh to N. Virginia, and SSH over private IPs only. The **TTL is 63**, compared with 60 to 62 in the Transit Router lab: the direct path has fewer hops.

## Conclusion

Terminating the VPN directly on a VPC is the simplest way to connect one Alibaba Cloud VPC to AWS. The order is clean (Alibaba VPN gateway, then the AWS side, then the Alibaba IPsec connection), and the hard part is the same as always: BGP details. One wrong digit in an ASN and one mismatched /30 kept my tunnel encrypted but useless until the logs on both sides showed exactly what was wrong. If you later need more VPCs, regions or a firewall in the path, that is the moment to move to a Transit Router.

## References

- [My previous lab: AWS and Alibaba Cloud through a Transit Router](/case-study/aws-alibaba-ipsec-vpn)
- [Alibaba Cloud: connect a VPC and an AWS VPC through IPsec-VPN](https://www.alibabacloud.com/help/en/vpn/sub-product-ipsec-vpn/use-cases/through-ipsec-vpn-alibaba-cloud-vpc-and-aws-vpc-can-communicate)
- [Alibaba Cloud: connect a VPC to an on-premises data center, office or other cloud](https://www.alibabacloud.com/help/en/vpc/connect-vpc-to-local-idc-office-terminal-other-cloud)
- [Alibaba Cloud blog post 594329](https://www.alibabacloud.com/blog/594329)
- [Smartling: Connecting AWS and Alibaba Cloud networks using managed VPN solutions](https://tech.smartling.com/connecting-aws-and-alibaba-cloud-networks-using-managed-vpn-solutions-2793439160d6)
- [RFC 1918: Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918)
