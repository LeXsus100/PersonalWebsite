---
title: "Building a Private Home-Server Infrastructure"
date: 2026-08-13
draft: false
layout: article
author: Luigi
description: "A work-in-progress home server based on Debian, private networking, local storage and encrypted backups."
tags:
  - Homelab
  - Self-hosting
  - Debian
  - Privacy
  - Infrastructure
toc: true
mathjax: false
---

I recently bought a mini-PC to use as a home server.

I have been wanting to move more of the software I use regularly onto my own hardware, but until now most of my self-hosting work has been made up of separate experiments. With this machine I want to put those services in one place and maintain them as part of the same system.

The server will run Debian and will only be remotely accessible through a VPN. Larger files and application data will be stored on directly attached storage, with separate encrypted backups.

I am still working on the final setup, so this page will change as I install and configure everything.


## Hardware

The mini-PC has already been purchased, and the rest of the setup will stay fairly simple.

The main things I care about are having enough memory for the services I want to run, reliable local storage, a DAS for the larger datasets, and some form of power protection for the server and storage.

{{< screenshot-placeholder title="Mini-PC and DAS hardware" note="Planned photograph: the selected mini-PC, directly attached storage enclosure, drive arrangement, network connection, and power protection." >}}

I will document the parts of the hardware setup that actually matter to the infrastructure as it develops, rather than keeping a full component list.


## Debian

I chose Debian for the host operating system.

Most of what I want to run does not require a particularly recent kernel or package set, so I prefer having a stable base and keeping changes relatively predictable.

The host itself will stay fairly minimal. Applications will mostly run in containers, while persistent data and configuration will be stored separately from the application containers.

This should make it easier to update or replace an application without mixing its lifecycle with the data it manages.

I also want the configuration of the machine to be documented properly instead of relying on commands that I ran once and then forgot about.


## Remote access

I do not plan to expose the personal services directly to the public internet.

When I need to access them away from home, I will connect to the home network through a VPN first.

```text
Trusted device
      │ encrypted VPN
      ▼
Home network
      │
      ▼
Debian mini-PC ─── application services
      │
      ├── internal system storage
      └── DAS with RAID 5
                 │
                 └── separate encrypted backups
```

The server will still have the usual firewall and service restrictions. Administrative access will be kept separate, and I want to keep the number of listening services on the host fairly small.

{{< screenshot-placeholder title="Private service and network overview" note="Planned screenshot: VPN entry, service boundaries, storage paths, backup targets, and the distinction between user traffic and administration." >}}


## Storage

I am currently planning to use the internal SSD mainly for Debian and the parts of the system that can be recreated.

The larger datasets and persistent application data will live on a DAS (that I already own).

My current plan for the DAS is RAID 5. This gives me some tolerance for a single drive failure and lets the array continue operating while the failed drive is replaced.

It is separate from the backup system.

{{< callout kind="warning" title="RAID is not a backup" >}}

The RAID array helps with a failed disk, but deleted or corrupted data is still deleted or corrupted across the array. Backups therefore need to exist independently of it.

{{< /callout >}}

For backups I am using **BorgBackup**, with every backup stored encrypted and versioned.

The repository will use a simple retention policy: **7 daily**, **4 weekly**, and **6 monthly backups**.

```bash
borg prune -v --list /mnt/e/borg-repo \
  --keep-daily=7 \
  --keep-weekly=4 \
  --keep-monthly=6
```

The backup repository will be kept separate from the live server data. I also plan to test restores periodically, including rebuilding the important services from a clean Debian installation using the saved configuration and backup data.


## Services

I already have several categories of software that I would like to run on the server.

| Service area         | Intended role                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Personal finance     | Transaction tracking, budgeting, and financial management                                            |
| Fitness              | Training, measurements, routines, and progress records                                               |
| Digital library      | E-books, documents, metadata, and reading organisation                                               |
| Files                | Nextcloud for synchronisation, access, and controlled sharing                                        |
| Tasks and projects   | Personal planning, recurring work, and project coordination                                          |
| Language learning    | Vocabulary, exercises, review history, and study material                                            |
| House infrastructure | [The residential BIM-MEP planner](/experiments/residential-bim-mep-planner/) used for the renovation |
| Future systems       | Other services I decide to host later                                                                |

I have not selected the final application for every category yet.

When comparing them, one of the things I am looking at is how they store and export data. If I replace an application later, I want to be able to migrate the data without depending on a proprietary format or a working instance of the old service.


## Maintenance

I also want to keep some basic maintenance information in one place.

This will probably include:

1. storage and disk health;
2. service status;
3. date of the latest successful backup;
4. operating-system and application updates;
5. certificate or credential expiry where relevant;
6. dates of restore tests.

{{< screenshot-placeholder title="Service health and backup dashboard" note="Planned screenshot: service status, storage health, last successful backup, restore-test date, and pending maintenance without exposing private data." >}}

Important configuration will be version controlled where that is practical, together with notes explaining anything that is not obvious from the configuration itself.

I also want a short recovery document stored outside the server so that I can still access it if the machine is unavailable.


## External services

I am not planning to replace every external service I use.

Some applications may still depend on external APIs or use external systems for notifications. I am mainly interested in keeping the primary copy of personal data and the applications managing it on hardware I control where it makes sense to do so.

The exact balance will probably change as I start using the server regularly.


## Current work

Right now I am working on defining the foundations of the infrastructure: how I want to keep everything organised, which tools I will use, and how services, configuration, data and backups should be structured.

Most of the software I eventually want to host is either already ready to be deployed or currently being developed, so for now I am focusing more on the infrastructure they will run on rather than installing everything immediately.

The next step will be testing the setup with one of these applications. I will deploy it as the first real service and use it to work through the remaining details, including permissions, network access, security rules, backups and the general deployment process.

Once that setup works the way I want, I can start applying the same structure to the other services.