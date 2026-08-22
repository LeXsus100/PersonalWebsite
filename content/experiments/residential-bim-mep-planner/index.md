---

title: "Building a Local BIM-MEP Planning Tool"
date: 2026-08-19
draft: false
layout: article
author: Luigi
description: "A work-in-progress editor for modelling a house, placing technical devices, and documenting the routes and properties of the services hidden inside it."
tags:
  - BIM
  - MEP
  - TypeScript
  - Self-hosting
  - Renovation
toc: true
mathjax: false
---

[My broader renovation approach](/writings/engineering-house-renovation/) covers things like decisions, costs, companies, documents, and generally trying to keep the renovation organised.

While working on that, I kept coming back to a different problem.

Once the house is finished, a lot of the important technical work will disappear. Cables will be inside walls, pipes under floors, ducts above ceilings, sensors mounted in places I will eventually forget about. Photos help, drawings help, but I wanted something I could actually inspect and search later.

So I started building a small BIM-MEP-inspired editor for the house (called simply "House Infrastructure Studio"), which I’m keeping on [🛠️GitHub](https://github.com/LeXsus100/house-infrastructure-studio) as I work on it.

{{< callout kind="idea" title="What I want from it" >}}

A simple model of the house where I can place technical equipment, connect it properly, document how it is installed, and still understand everything years after the work is finished.

{{< /callout >}}

## Why I started building it

I looked at existing BIM and MEP software first.

Professional tools can obviously do far more than I need, but they also come with the cost and complexity of software designed for professional construction projects. For a personal renovation, that felt excessive.

Normal drawing applications have the opposite problem. I can draw a line between two points, but that line does not really know what it represents. It could be a power cable, Ethernet, water, a ventilation duct, or an empty conduit I want to leave for the future.

What interested me was also all the informations behind the drawing.  
I wanted dimensions, actual connected objects, searchable properties, installation details and useful exports, without having to adopt an entire commercial BIM workflow.

## Modelling enough of the house

The editor is organised into floors, with dimensions stored in integer millimetres. On each floor I can draw walls, define rooms and add structural reference objects.

Doors and windows are attached to walls and create real openings in the geometry. This mattered more than I initially expected, especially once I started working on automatic routing.  
A cable should not happily pass through the middle of a window just because the window is only a symbol drawn on top of a wall.

On top of the architectural model I can add the things that actually interact with the services in the house: outlets, electrical panels, switches, lights, Wi-Fi access points, racks, cameras, sensors, HVAC equipment, radiators, plumbing points, automation devices, tanks, appliances and custom devices.

{{< screenshot-placeholder title="House editor with walls, rooms, and openings" note="Planned screenshot: the first complete floor model, showing real wall openings and a calibrated background plan." caption="The architectural model stays schematic because its purpose is technical coordination, not photorealism." >}}

## Treating devices as actual endpoints

A device in the editor can have a manufacturer, model, dimensions, mounting method, installation height, status, electrical requirements, network requirements, notes, colours and arbitrary custom properties. It can also have ports.

That means, for example, a network cable does not simply terminate somewhere around the back of a device. It can terminate on a specific Ethernet port.  
A port has its own service category, direction, connector and physical position on the device. Where it makes sense, it can also store limits such as voltage, current, network speed or media type.

I am using the same approach for equipment racks. A rack can contain things like a UPS, PDU, NVR, network switch, NAS, router, computer or custom modules, positioned by rack unit. Their internal ports can then be mapped to the connections that leave the rack and continue through the house.

{{< screenshot-placeholder title="Device and port properties" note="Planned screenshot: a selected network or electrical device with dimensions, mounting, voltage or data fields, positioned ports, and installation status visible together." >}}

## Routing cables, pipes and ducts

This is the part I have probably spent the most time thinking about.

**Routes** can currently represent cables, pipes or ducts. I choose a source device and port, a destination, and optionally some preferred points for the route to pass through.

The planner then tries to create a squared path between them.

I have been adding some basic **behaviour** to make those generated paths closer to something I might actually install. Routes can reuse useful corridors, bundled services are kept in separate lanes, and the planner tries to avoid openings and equipment envelopes.

It is **NOT** supposed to make the final installation decision for me. I mainly want it to get me from “these two things need to be connected” to a sensible first route that I can adjust.  
The route stays completely editable after it is generated. I can add, move and remove intermediate points, square sections manually and create transitions between floors.

The information attached to a route depends on the type of service.

* **Electrical:** voltage, current, power, conductor count, cross-section, phase configuration, identification and installation method.
* **Data:** connector endpoints, maximum rate, media, shielding, frequency rating, T568A or T568B termination and PoE class.
* **Pipes:** material, internal and external diameter, wall thickness, pressure, temperature, insulation and flow direction.
* **Ducts:** section dimensions, material, insulation, airflow direction and design airflow.
* **All routes:** manufacturer, product code, length, spare length, labels, status, test result, notes and custom fields.

Some of those fields may look excessive for a home project, but better have them than not.

{{< callout kind="result" title="Why doing all of this?" >}}
If I know exactly what cable I intend to use, for example, I can estimate the amount I need instead of measuring generic lines on a drawing. I can also see which connections still have missing information and keep installation or testing results attached to the same route later.
{{< /callout >}}

{{< screenshot-placeholder title="Technical route properties and X-ray view" note="Planned screenshot: power, Ethernet/PoE, and another service shown together, with walls transparent and one route's exact technical metadata open." caption="Colour supports identification, while service labels and line patterns keep routes understandable without relying on colour alone." >}}

## Blueprints, floors and all the things that will eventually be hidden

I can import a plan for each floor and use it as a background while modelling.

The editor has two-point calibration for getting the scale right, as well as a project origin and cross-floor registration so the different levels line up.

I have also added one of the coolest feature: an **X-ray view**. It makes the walls transparent and routes visible, which is much closer to how I tend to think about the house while working on the technical systems.

**Filters** can isolate electrical power, Ethernet and data, security, HVAC, heating, plumbing, automation and the other service categories.

Another feature I am working around is **construction documentation**.

For an individual wall, the editor can produce a scheme containing the devices on that wall, their distances and heights, together with the section of each route that physically belongs there.

I can also batch-export these drawings with predictable filenames and generate an overview of the complete house: devices, route lengths, service types, floors, installation status and test status.

The main reason for storing all of this is what happens after the walls are closed.  
Instead of relying on my memory that there was “probably an Ethernet cable somewhere around here”, I want to be able to open the project, find the relevant device, follow its route and compare it with the photographs taken during installation.

## How I am building it

The client is written in **React** and **TypeScript**, with **React Three Fiber and Three.js** handling the 3D view.

Internally, the project keeps the authoritative geometric dimensions as integer millimetres. They are converted to metres only when the geometry reaches the rendering layer.

That decision came from wanting the stored project data to stay predictable rather than slowly accumulating floating-point differences from editing and rendering operations.

The backend is a small **Express** API listening only on `127.0.0.1`.

Projects are validated and saved into a normalized **SQLite** database. I also keep a validated JSON mirror and separate local project folders for assets and generated exports.

There are **no accounts, cloud services, remote storage, analytics, telemetry or external APIs involved**.

```text
React + TypeScript editor
        │
        ├── Three.js schematic viewport
        ├── geometry, routing, reports, and local exports
        │
        ▼ localhost REST/JSON
Express on 127.0.0.1
        │
        ▼
SQLite + validated project workspace
```

Undo and redo work with immutable **project snapshots**.

**Autosave** waits for a short quiet period and then sends a validated snapshot to the backend. Database writes are transactional, so an interrupted save should not leave half of a project committed.

{{< callout kind="result" title="Local by design" >}}

The project contains a fairly detailed map of the inside of a home, so keeping it local was an obvious decision.

It also fits naturally with the [private home-server infrastructure](/experiments/private-home-server-infrastructure/) I am building around the rest of the house.

{{< /callout >}}

## Where I am keeping the scope under control

There are a few things I intentionally do not want this project to become.

The device catalogue uses schematic geometry. I am **NOT** trying to reproduce manufacturer-grade 3D models.

The **routing system** is designed around the sort of problems I have in a residential renovation. It is not intended to be a general-purpose three-dimensional constructability solver.

**Blueprint** registration is also deliberately simple. If the original image contains perspective distortion, the application does not try to magically correct it.

And for now, the technical drawing exports are raster images rather than CAD or IFC files.

The application can record things like conductor configuration, cable identification, pipe dimensions, loads, clearances and installation methods, but having a field in the database obviously does not make the value compliant with a regulation.  
Those decisions still have to be checked against the actual project, current standards and the professionals responsible for the work.

## What I am working on now

At the moment I am trying to get from a capable editor to a **complete model** of the actual house.

That means aligning every floor, finishing the main geometry, adding the devices I already know about, connecting the important routes and gradually filling in the information that will matter when installation starts.

I also want the **exports** to become practical enough that I can actually use them while speaking with installers rather than treating them as screenshots of a software project.

There are plenty of features I could add after that, but I am trying not to judge the project by how many things the interface can do.

{{< callout kind="idea" title="Goal" >}}
A much more useful test will be opening the model during the renovation and getting an answer to a real question from it.

And, hopefully, opening the same model ten years later and still getting the answer.
{{< /callout >}}