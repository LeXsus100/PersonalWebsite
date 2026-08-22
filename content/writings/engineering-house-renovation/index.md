---
title: "Renovating My Grandfather’s House"
date: 2026-08-15
draft: false
layout: article
author: Luigi
description: "How I’m using software, models, inventories, and project data to keep a family renovation organised."
tags:
  - Renovation
  - Systems-engineering
  - Data
  - Project-management
toc: true
mathjax: false
---

Renovating my grandfather’s house is a family project, but there is also quite a lot to keep track of. There are the usual questions about rooms, furniture and materials, but also quotations, companies, documents, payments, incentives and decisions that depend on each other.

Since I work on software projects, my instinct is to organise some of this information instead of keeping it across messages, folders and a few unrelated spreadsheets. I’m not trying to manage the renovation as if it were a software project, but some of the same habits are useful: keeping track of the current situation, writing down requirements, recording decisions and knowing which information belongs together.

{{< callout kind="result" title="The boundary of my role" >}}
Architectural design, structural assessment, permits, safety coordination, and civil or building-services engineering belong to qualified professionals. I’m mainly interested in organising the information around their work and around the decisions we make as a family.
{{< /callout >}}

## What is already in the house

Before work starts, I want a decent catalogue of the things already there.

This mostly means furniture, lamps, appliances, tools, documents and the utilities or equipment that are useful for planning. I can record where something is, photograph it, note its dimensions where useful, and decide whether it should stay, be restored, moved somewhere else, donated or discarded.

There is also a distinction that a normal inventory does not capture very well. Some objects are worth keeping because they are useful or expensive, while others matter because they belonged to my grandfather or have simply been part of the house for a long time.

| Inventory field                             | Why I keep it                                   |
| ------------------------------------------- | ----------------------------------------------- |
| Room and position                           | To find the item again                          |
| Description and photographs                 | To identify it without relying on memory        |
| Dimensions and condition                    | Useful when considering reuse or a new location |
| Keep, restore, relocate, donate, or discard | Records what we decided                         |
| Practical or family significance            | Keeps this separate from monetary value         |
| Temporary storage location                  | Useful once rooms start being emptied           |


## Requirements and decisions

A lot of renovation discussions begin with fairly broad statements: we need more storage, this room is too dark, there are not enough sockets, this should be easier to clean.

I want to keep those somewhere before they turn into individual design decisions.

I roughly separate them into constraints, functional requirements, preferences, provisions for possible future work, and questions that still need an answer.

A requirement can then be connected to the room, the relevant design choice and, when necessary, the professional who has to confirm it. For important decisions I also want to keep a short reason. I know from other projects how quickly that context disappears.

For example, if we decide to place an outlet in an unusual position, knowing that it was meant for a particular piece of furniture is more useful later than simply knowing that the outlet was approved.

## Models and renders

I’m also building models of some of the interiors.

For this I’m using [Sweet Home 3D](https://www.sweethome3d.com/). I know it’s not the most sophisticated choice, but it’s free and, with a bit of time and care, it can also be quite precise.

This is mostly for comparing ideas before committing to them: furniture positions, finishes, lighting arrangements and other changes that are easier to understand visually.

I try to keep comparisons consistent, especially the room geometry and camera position. Otherwise a different viewpoint can make one option look better without actually telling us much.

## Work and dependencies

The works themselves need a little more structure than a list of dates.

Some jobs cannot start until another one is finished. Others depend on a drawing, a material arriving, an inspection or a decision from us. These dependencies are easy to forget when the information is split between different companies.

For each work package I want to keep:

* the room and scope of work;
* the company or professional involved;
* work or decisions it depends on;
* required drawings, documents or approvals;
* planned and actual dates;
* quotation, committed amount, payments and current forecast;
* issues and variations;
* completion photographs and other useful records;
* warranty and maintenance information.

I don’t expect the original schedule to survive unchanged. I mainly want to be able to see what is waiting for what, and to understand why dates or costs changed.

## The project software

As the renovation grew, I ended up building a small application to keep everything related to it in one place.

It started from the usual problem of having information spread across spreadsheets, folders, messages and photographs. That becomes difficult to manage quite quickly when the same company appears in quotations, invoices and work packages, or when a decision affects the schedule, the budget and several rooms at once.

The application is now the central record for the project. I use it for the timeline, costs and expenses, companies, documents, photographs, diagrams, requirements, decisions and the work planned for each part of the house.

The main records are connected rather than kept as separate lists:

| Record       | Related information                                      |
| ------------ | -------------------------------------------------------- |
| Space        | Objects, photographs, requirements, designs, work        |
| Company      | Contacts, quotations, documents, invoices, work          |
| Work package | Scope, dependencies, dates, company, costs, progress     |
| Cost item    | Budget category, quotation, commitment, invoice, payment |
| Decision     | Alternatives, reason, date, affected rooms or work       |
| Document     | Version, author, date and related records                |
| Media        | Photographs, diagrams and other project material         |

The budget is part of the same system. I keep the original budget, quotations that are still being considered, committed costs, invoices, payments and the latest expected total as separate values.

This is useful because the number changes continuously during the renovation. A quotation becoming accepted changes the committed cost. An unexpected problem can add a variation. An invoice may only cover part of a work package. Keeping these connected makes it easier to understand where a cost came from instead of just seeing the total increase.

The interface is mostly there to answer practical questions: how much has already been committed, how much has been paid, what is still expected, which work is delayed, what decisions are still open, and what documents or photographs belong to a particular part of the project.

{{< screenshot-placeholder title="Renovation project dashboard" note="Planned screenshot: timeline, budget, expenses, work status, documents, photographs, and upcoming decisions from the central project application." >}}


## Information about the finished work

There is another set of information I want to collect while the renovation is happening: what gets installed behind walls, ceilings and floors.

Before these areas are closed, I would like to take photographs and keep useful measurements, routes, labels, product information and test results. This is mostly for maintenance later. Once everything is finished, even something simple like knowing where a cable or pipe runs can save a lot of guessing.

I’m experimenting with this separately in [a local residential BIM-MEP planner](/experiments/residential-bim-mep-planner/). It models walls, openings, devices and technical routes.

I prefer keeping this separate from the renovation application. The two projects deal with related information, but they have different jobs. The renovation application is mostly about coordination, decisions, costs and documents. The other one is about the physical layout of services in the house.

They can share references without needing to become the same application.

## What I want to keep after the renovation

Most of this is useful while the work is happening, but I also want to keep the result afterwards.

Alongside the normal invoices, drawings and photographs, I’d like to have a record of the main decisions, the companies involved, the products that were installed, costs, warranties and the information collected before parts of the work were covered.

I don’t know yet how much of the system will still be useful several years after the renovation. That is part of the experiment. But even a smaller record would be preferable to trying to reconstruct everything later from old emails, photographs and memory.
