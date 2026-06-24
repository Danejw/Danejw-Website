# Combining Multiple Sources in One Visual

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/studio](https://vizivibes.com/studio)

**Case study type:** Feature design  
**The task:** Let users stack notes, files, URLs, video, and research in one project and choose which pieces feed each generation.  
**What we learned:** Real stories live in many places. The product should compile them, not force users to merge sources before they arrive.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Combine multiple extractions in one project with toggles for what feeds generation |
| **Who it was for** | Creators whose research spans docs, links, PDFs, and live web passes |
| **Main constraint** | Copy-paste merging is error-prone and kills the speed AI promised |
| **What we built** | Multi-item content stack per project with per-item toggles at generate time |
| **Outcome** | One cohesive visual from scattered inputs without a manual merge step |

---

## Background

I rarely start a post with everything in one file. I have notes from a call, a PDF someone emailed, a URL I bookmarked, and sometimes a research pass I ran because the topic shifted mid-week.

The old workflow was familiar and slow. Export from one place. Paste into another. Reconcile conflicts by hand. Open a design tool only after the doc felt "ready." Many weeks I skipped the post because assembly cost more than writing.

We built ViziVibes to turn information into visuals. That promise only holds if the product meets users where their information already lives, in plural.

---

## The task

Support multiple extracted content items in a single project, let users enable or disable each item before generation, and combine selected items into one structured input for the visual pipeline.

---

## Constraints

- Each source type (text, file, URL, video, research) must extract independently without blocking others.
- Toggles must be obvious at generation time, not buried in settings.
- Combined output must not silently re-summarize and drop facts from any enabled source.
- Stacked sources must work with [extraction templates](./extraction-templates-for-content-structure/article.md), [brand kits](./keeping-brand-consistency/article.md), and the standard generate flow.

---

## Our approach

We treated a project as a **content stack**, not a single paste box. Every ingestion adds a structured block. Generation reads only the blocks you turn on.

That keeps assembly in the product and keeps users out of merge hell. You decide what the visual needs today. Next week you might enable a different combination from the same project.

---

## How we solved it

### Step 1: One project, many extractions

**What we did:** Allowed unlimited extractions per project, each tied to its source type and template mode.

**Decision:** Store extractions as separate records, not one growing blob of text.

**Why:** Separate records make toggling possible. One blob forces all-or-nothing and makes debugging wrong facts impossible.

### Step 2: Toggle what feeds generation

**What we did:** Added clear on/off controls for each extraction before generate runs.

**Decision:** Default new extractions to enabled, let users disable without deleting.

**Why:** Creators experiment. Disabling beats delete-and-rebuild when you might need a source again tomorrow.

### Step 3: Combine at generation time

**What we did:** Merged enabled extractions into structured content blocks passed to the image pipeline described in [Consistent Social Visuals for ViziVibes](../vizivibes-image-generation-masterclass/article.md).

**Decision:** Combine once at generate, not at import.

**Why:** Import-time merging locks you in. Generate-time merging matches how people actually decide what belongs in this post.

### Step 4: Match extraction mode to source type

**What we did:** Wired each source path to appropriate [extraction templates](./extraction-templates-for-content-structure/article.md) (timeline from research, summary from URL, chapters from video).

**Decision:** Keep mode selection per extraction, not per project.

**Why:** A PDF might need an outline while a URL needs pros and cons. One mode for the whole project would fail often.

---

## What we built

- Multi-extraction storage per project across all input types
- Per-item enable/disable toggles before generation
- Structured merge of selected extractions into generation context
- Compatibility with brand kits, formats, single image and carousel modes
- Same refine and history tools as single-source projects

---

## Results

**Before:** I merged sources manually in a doc, then pasted once and hoped nothing important got lost.

**After:** I ingest each source as it arrives, toggle what matters for this post, and generate from the stack.

**What changed for us:** Launch posts, research threads, and client summaries that used to require a prep doc now compile inside one project. Video extractions often sit beside personal notes in the same session.

**How we know it worked:** Users who enable two or more sources in one project show higher repeat generation within that project instead of creating duplicates.

---

## What you can learn

1. **Real work is multi-source.** Design for compilation, not single paste boxes.
2. **Toggle beats merge.** Let users choose what feeds output without re-importing.
3. **Combine late.** Generate-time assembly matches how decisions actually get made.
4. **Keep extractions separate.** Structure and debuggability follow from distinct records.
5. **One pipeline, many doors.** Stacking should not fork the visual system.

---

## Next step

Open the [ViziVibes studio](https://vizivibes.com/studio), add three sources to one project (paste, URL, and research work well), toggle two on, and generate. Compare the result to a single-source pass on the same topic.

For video in the stack, read [Turning Video Into Infographics](./turning-video-into-infographics/article.md).
