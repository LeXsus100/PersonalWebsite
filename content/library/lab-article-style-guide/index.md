---
title: "Lab Article Style Guide"
date: 2026-08-09T08:00:00+02:00
draft: false
layout: article
author: Luigi
description: "A living reference for writing Lab articles and reusing every visual component without having to remember its syntax."
tags:
  - Hugo
  - Markdown
  - Publishing
  - Design-system
toc: true
mathjax: true
---

This is the reference page I can keep open whenever I write for the Lab. It collects the article structure, typography, callout boxes, attachment buttons, media blocks, and small conventions that make separate entries feel like parts of the same website.

{{< callout kind="result" title="Use this as the canonical reference" >}}
Copy the smallest pattern that solves the problem. A page should still read well as plain text; the components are there to clarify hierarchy, not decorate every paragraph.
{{< /callout >}}

## Start from the article archetype

Create each entry as a leaf bundle so its future screenshots, documents, and videos can live beside the Markdown file:

```powershell
hugo new content --kind lab writings/my-article/index.md
```

Replace `writings` with `projects`, `library`, or `experiments`. A useful bundle stays predictable:

```text
my-article/
├── index.md
├── images/
│   ├── cover.webp
│   └── diagram.gif
├── files/
│   └── reference.pdf
└── media/
    └── demonstration.mp4
```

The minimum front matter is:

```yaml
---
title: "A precise article title"
date: 2026-08-09
draft: true
layout: article
author: Luigi
description: "One useful sentence shown below the title and on Lab cards."
tags: [systems, documentation]
toc: true
mathjax: false
# image: "images/cover.webp"
# image_alt: "Describe the image for someone who cannot see it."
# image_caption: "Optional context or credit."
---
```

Keep `draft: true` until the entry is ready. The description should make sense outside the article because it also appears in the Lab feed.

## Build a readable hierarchy

Use level-two headings for the main argument and level-three headings inside a long section. Level-five headings have a compact accented treatment that works well for repeated documents, reviews, or catalogue items.

##### Compact subsection example

This level is useful when several short items need stronger separation than bold text can provide. It should not replace the normal heading hierarchy.

Short paragraphs, lists, and tables create rhythm. A blockquote is reserved for the sentence that frames the problem:

> A component earns its place when it makes the next decision easier to understand.

Write the source normally:

```markdown
> A component earns its place when it makes the next decision easier to understand.
```

## Callout boxes

There are four useful callout treatments. The title is customisable, and the body accepts Markdown.

{{< callout kind="note" title="Context" >}}
Use a neutral note for background that matters but should not interrupt the main argument.
{{< /callout >}}

{{< callout kind="idea" title="Working idea" >}}
Use an idea box for a hypothesis, design direction, or option that is still open.
{{< /callout >}}

{{< callout kind="result" title="Decision" >}}
Use a result box for a conclusion, rule, or decision readers should retain.
{{< /callout >}}

{{< callout kind="warning" title="Constraint" >}}
Use a warning only for a real limitation, safety issue, or easy-to-miss condition.
{{< /callout >}}

Copy this pattern and change `kind` and `title`:

```markdown
{{</* callout kind="note" title="Context" */>}}
The body can contain **Markdown**, links, or a short list.
{{</* /callout */>}}
```

## Attachment buttons

Use the compact attachment for lecture notes, document lists, and places where the file belongs to a subsection:

{{< attachment compact="true" src="/pdf/PoliMi/Mathematical_Methods_public.pdf" title="Compact attachment example" meta="Selected pages for public viewing" >}}

```markdown
{{</* attachment compact="true" src="files/reference.pdf" title="Document title" meta="Selected pages for public viewing" */>}}
```

Use the full-size attachment when the download is a primary action in the article:

{{< attachment src="/pdf/PoliMi/Mathematical_Methods_public.pdf" title="Full-size attachment example" meta="Reference document" >}}

```markdown
{{</* attachment src="files/reference.pdf" title="Document title" meta="Reference document · 2.4 MB" */>}}
```

The file type is detected automatically and already appears in the square icon, so the subtitle does not need to repeat “PDF”. Add `download="true"` only when the browser should download instead of opening the file.

## Tables and code

Tables work best for comparisons and exact mappings:

| Element | Best use | Avoid |
|---|---|---|
| Paragraph | One connected thought | Multiple unrelated points |
| List | Steps, criteria, or inventory | A single sentence split into bullets |
| Table | Repeated fields or comparisons | Long prose in narrow cells |
| Callout | A decision or constraint | Decorative repetition |

Fenced code blocks receive syntax highlighting when a language is specified:

```python
def remaining_budget(baseline, committed, paid):
    return baseline - max(committed, paid)
```

Inline code such as `route.maximumVoltage` is for a field, command, path, or exact value—not for visual emphasis.

## Images, GIFs, and screenshot spaces

Normal Markdown is enough for images and animated GIFs. Add a quoted title after the path when the image needs a visible caption:

```markdown
![A concise, meaningful alternative description](images/interface.webp)
![A short animated workflow](images/workflow.gif "Optional caption")
```

For a site-wide image, start from the root:

![A robot examining a flower, used as an example of the standard article image treatment.](/images/robot_holding_a_pink_flower_and_observing_it.jpg "A captioned single image; click it to open the full-screen viewer.")

Use a gallery for a sequence of related images. The page shows left and right controls; clicking the main image opens a full-screen viewer with arrows and previews. Each source line follows `path | alternative text | optional caption`:

{{< gallery label="Example article gallery" >}}
/images/robot_holding_a_pink_flower_and_observing_it.jpg | A robot sitting in a forest and examining a small flower | Homepage illustration
/images/PoliMi_front.jpeg | The front of the Politecnico di Milano building | Politecnico di Milano
/images/SJTU_Dormitory.jpg | A university dormitory building at Shanghai Jiao Tong University | Shanghai Jiao Tong University
{{< /gallery >}}

```markdown
{{</* gallery label="Interface walkthrough" */>}}
images/overview.webp | Overview of the interface | Main workspace
images/detail.webp | Detail panel for one item | Editing technical properties
images/result.webp | Completed output | Final result
{{</* /gallery */>}}
```

When an article is ready before its screenshot, reserve the intended position visibly:

{{< screenshot-placeholder title="Main interface overview" note="Replace this block with the final screenshot while keeping it in the same position in the narrative." caption="Planned figure: the interface after the first complete workflow is ready." >}}

```markdown
{{</* screenshot-placeholder title="Main interface overview" note="What the future screenshot should demonstrate." caption="Optional figure caption." */>}}
```

## Embedded PDFs and video

Embed a PDF only when reading it inside the page is genuinely useful; otherwise prefer an attachment button:

```markdown
{{</* pdf src="files/reference.pdf" title="Reference document" */>}}
```

Videos use a local file and can include a poster image and caption:

```markdown
{{</* video src="media/demo.mp4" poster="images/poster.webp" caption="A short demonstration." type="video/mp4" */>}}
```

Keeping media inside the page bundle makes moving or archiving the article much safer.

## Equations

Set `mathjax: true` in the front matter when an article needs mathematics. Inline notation uses `\( C_{forecast} \)` and a display equation uses:

$$
C_{forecast} = C_{paid} + C_{committed} + C_{remaining} + C_{contingency}
$$

Do not enable MathJax on articles that do not use it.

## Final publishing checklist

Before changing `draft` to `false`, check that:

- the description works on a Lab card;
- headings describe the argument rather than the layout;
- every image has useful alternative text;
- callouts contain actual decisions, context, or constraints;
- document labels do not repeat their file type;
- links and attachment paths resolve;
- screenshots do not expose private information;
- the conclusion adds limits, next steps, or a changed decision instead of repeating the introduction.

{{< callout kind="result" title="The visual rule" >}}
Prefer one strong component at the moment it becomes useful. White space and hierarchy do more for readability than filling every section with decoration.
{{< /callout >}}
