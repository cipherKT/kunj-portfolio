---
title: "Building a Home SOC Lab with Wazuh"
slug: "building-home-soc-lab-wazuh"
tags: ["Wazuh", "SIEM", "Sysmon", "Home Lab", "Blue Team"]
date: "2026-08-16"
category: "SOC Lab"
description: "A walkthrough of the SOC lab I built at home - Wazuh as the SIEM, Sysmon telemetry from Windows and Linux endpoints, and everything wired up to generate and detect real activity."
---

## Overview

Every blue-team skill I want to actually keep - reading raw logs, writing detection rules, tuning out noise - needs a place to practice it. So I built a small SOC lab at home: a Wazuh server acting as the SIEM, a Windows 10 workstation and an Ubuntu server acting as monitored endpoints, with Sysmon installed on both to produce the kind of telemetry a real environment would emit.

The goal wasn't just "get a dashboard with some agents online." It was to end up with a lab I can throw attacks at and watch the detection loop work end to end - which is what the rest of this series will build on.

## Architecture

Three VMs on my home virtualization host (KVM/libvirt):

```txt
  ┌────────────────────────┐     ┌────────────────────────┐
  │       Windows 10       │     │      Ubuntu Server     │
  │  Wazuh agent + Sysmon  │     │  Wazuh agent + Sysmon  │
  └───────────┬────────────┘     └───────────┬────────────┘
              │                             │
              │         sends telemetry     │
              └──────────────┬──────────────┘
                             ▼
               ┌────────────────────────┐
               │       Wazuh server     │
               │  manager + indexer +   │
               │       dashboard        │
               └────────────────────────┘
```

Each endpoint runs the Wazuh agent and sends its telemetry to the Wazuh server, which collects it, fires alerts, and serves the dashboard. Sysmon on both endpoints is what makes the telemetry worth having - it produces the deep process-level events a real SOC would analyze.

## Prerequisites

- A virtualization host (I used KVM/libvirt; any hypervisor works)
- An Ubuntu Server ISO for the Wazuh server VM
- A Windows 10 ISO and an Ubuntu Server ISO for the endpoints
- Enough RAM to run three VMs comfortably

## Step 1 - Deploy the Wazuh server

Install Ubuntu Server in the first VM, then update the system:

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

Install Wazuh with the official quickstart script:

```bash
curl -sO https://packages.wazuh.com/4.14/wazuh-install.sh && sudo bash ./wazuh-install.sh -a
```

> [!caution] The install takes around 20-25 minutes. It also prints your dashboard credentials at the end - save them, you'll need them to log in.

## Step 2 - Enable archives

By default Wazuh only stores events that produce alerts. Enabling archives captures **all** telemetry - including the events that don't alert yet - which is exactly what you want for hunting later.

Edit the manager config:

```bash
sudo vi /var/ossec/etc/ossec.conf
```

The change looks like this:

```diff
 <global>
   <jsonout>yes</jsonout>
   <alerts_log>yes</alerts_log>
-  <logall>no</logall>
-  <logall_json>no</logall_json>
+  <logall>yes</logall>
+  <logall_json>yes</logall_json>
   <email_notification>no</email_notification>
 </global>
```

Toggle `logall` and `logall_json` to `yes`, then restart the manager: 

```bash
sudo systemctl restart wazuh-manager.service
```

Next, enable archive shipping in Filebeat:

```bash
sudo vi /etc/filebeat/filebeat.yml
```

The change looks like this:

```diff
 filebeat.modules:
   - module: wazuh
     alerts:
       enabled: true
     archives:
-      enabled: false
+      enabled: true
```

Toggle `archives` to `true`, then restart Filebeat:

```bash
sudo systemctl restart filebeat.service
```

In the dashboard, create a new index pattern `wazuh-archives*` and select `timestamp` for the time field.

> [!note] Archive data lets you look at events that don't generate alerts - the foundation for threat hunting, which we'll cover in a later post.

> [!important] Take a snapshot of this VM now. It's a clean, working baseline you can roll back to after experimenting.

## Step 3 - Deploy the agent on the Ubuntu server

In the Wazuh dashboard, go to **Deploy new agent**, choose **Linux (Deb amd64)**, enter the Wazuh server address, and name the agent.

> [!note] Toggle `Remember server address` so the agent keeps the manager address.

Run the provided commands on the Ubuntu server:

```bash
wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.14.7-1_amd64.deb && sudo WAZUH_MANAGER='192.168.122.x' WAZUH_AGENT_NAME='SOCLAB-Linux' dpkg -i ./wazuh-agent_4.14.7-1_amd64.deb
```

Then start the agent:

```bash
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

## Step 4 - Install Sysmon for Linux

Sysmon gives us deep process-level telemetry on Linux too. Install it from the Microsoft packages repo:

```bash
wget -q https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
```

```bash
sudo apt-get update
sudo apt-get install sysmonforlinux
```

Grab a config that collects everything and install it:

```bash
curl -O https://github.com/microsoft/MSTIC-Sysmon/blob/main/linux/configs/collect-all.xml
sudo sysmon -i collect-all.xml
```

## Step 5 - Deploy the agent on Windows 10

Repeat the agent deployment, this time choosing **Windows** in the dashboard. Install the agent on Windows 10 with the manager address and an agent name like `SOCLAB-Windows`.

## Step 6 - Install Sysmon on Windows 10

Download Sysmon from Microsoft's site and use Olaf Hartong's widely-used config:

```powershell
.\Sysmon.exe -i .\sysmonconfig.xml
```

By default Wazuh doesn't read the Sysmon event channel, so wire it into the agent. Open `C:\Program Files (x86)\ossec-agent\ossec.conf` in an administrator Notepad and add:

```xml
<localfile>
  <location>Microsoft-Windows-Sysmon/Operational</location>
  <log_format>eventchannel</log_format>
</localfile>
```

Restart the Wazuh service on Windows, and Sysmon events will start flowing to the dashboard.

## Validation

Head to **Wazuh → Agents** in the dashboard. All three machines should appear **Active**:

![Wazuh dashboard showing all three agents online](/images/siem-lab/building-the-lab/agents-online.png)

At this point the lab is functional - agents are reporting, Sysmon telemetry is landing, and archives are capturing everything. From here we can start generating activity and watching it appear in the dashboard.

## Key takeaways

- Wazuh's quickstart gives you manager + indexer + dashboard in one VM - the fastest path to a working SIEM.
- **Archives are the difference** between a SIEM that only shows known alerts and one you can hunt in. Enable them early.
- Sysmon on both Windows and Linux makes the telemetry worth having - without it you're mostly seeing login events and little else.
- **Snapshot your server after a clean setup.** You will break things; the snapshot is your undo button.

## References

- Wazuh SOC Analyst Challenge (playlist I followed while building): [YouTube](https://youtube.com/playlist?list=PLHmErnFy_2zk)
- [Wazuh documentation](https://documentation.wazuh.com/)
- [Sysmon for Linux](https://github.com/microsoft/SysmonForLinux)
- [Olaf Hartong's sysmon-modular](https://github.com/olafhartong/sysmon-modular)
- [MSTIC-Sysmon configs](https://github.com/microsoft/MSTIC-Sysmon)
