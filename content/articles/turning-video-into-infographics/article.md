# Turning Video Into Infographics

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/studio](https://vizivibes.com/studio)

**Case study type:** Feature design  
**The task:** Let video-first creators repurpose long recordings into structured key points and on-brand static visuals without manual rewatch and note-taking.  
**What we learned:** Video is an input type, not a separate product. Extract structure first, then run the same visual pipeline as every other source.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Turn a YouTube link or uploaded video into key points, chapters, and shareable infographics |
| **Who it was for** | Podcasters, educators, webinar hosts, and marketers whose best content is on camera |
| **Main constraint** | Static social feeds will not carry a 40-minute recording; the product must surface what matters fast |
| **What we built** | Video ingestion with structured extraction modes, then the standard generate and refine loop |
| **Outcome** | One link or upload becomes post-ready visuals in the same studio session |

---

## Background

I publish long recordings. Podcasts, walkthroughs, webinars. The value is in the full conversation. The scrollable feed is not going to carry forty minutes.

For years my workaround was painful: rewatch, pause, type timestamps, paste highlights into a doc, then open a design tool and start layout from scratch. Many weeks I skipped static posts entirely because repurposing cost more than filming.

ViziVibes already turned text and files into visuals. Video was the missing front door for a large slice of our audience.

---

## The task

Accept a public video link or uploaded file, extract structured content (summary, insights, chapters with timestamps), and feed that structure into the same generation system used for notes and PDFs.

---

## Constraints

- Long videos must not block the UI; extraction runs as its own step with clear progress.
- Timestamp and chapter fidelity matters for creators who want clickable depth in captions or threads.
- Output must work alone on Instagram or LinkedIn without the video attached.
- Video extractions must [stack with other sources](./combining-multiple-sources-in-one-visual/article.md) when I add commentary or research.

---

## Our approach

We did not build a separate video product. We built video as an input with extraction templates tuned for spoken content, then connected it to the existing visual loop.

The sequence is always: video in, structure out, style and brand, generate, [refine](./refining-a-visual-without-starting-over/article.md).

---

## How we solved it

### Step 1: Two ways to bring video in

**What we did:** Support pasted links (YouTube and similar) and direct file uploads for recordings that are not public yet.

**Decision:** Treat link and upload as one feature with two doors, not two workflows.

**Why:** Creators live in different hosting setups. The studio experience after ingestion should feel identical.

### Step 2: Extraction modes for spoken content

**What we did:** Shipped modes for summary, key insights, and chapters with timestamps, aligned with [Extraction Templates for Content Structure](./extraction-templates-for-content-structure/article.md) used elsewhere.

**Decision:** Offer modes that map to how creators actually post (hook summary vs chapter carousel vs insight list).

**Why:** A webinar host and a short-form educator need different shapes from the same recording. Mode choice beats one generic transcript dump.

### Step 3: Preserve timestamps as first-class data

**What we did:** Kept chapter and timestamp fields in structured extraction output, not flattened prose.

**Decision:** Timestamps survive into generation context and can inform slide splits in carousel mode.

**Why:** "Watch from 12:40" is often more valuable than a paraphrase. Losing timestamps forces creators back to the player.

### Step 4: Plug into the shared visual pipeline

**What we did:** Passed video extractions through palette, format, [brand kit](./keeping-brand-consistency/article.md), and generation like any other source.

**Decision:** No special-case image engine for video-derived content.

**Why:** Consistency across input types reduces learning curve and keeps quality rules universal.

---

## What we built

- Video link and upload ingestion in the studio
- Structured extraction for summaries, insights, and chapters with timestamps
- Toggleable video extractions inside multi-source projects
- Path from extraction to single image or multi-slide carousel
- Same refine and history tools as text-first projects

---

## Results

**Before:** I either skipped static repurposing or spent hours rewatching and designing manually.

**After:** A link or upload yields structured highlights ready for on-brand generation in one session.

**What changed for us:** A recording becomes something someone can understand in ten seconds on LinkedIn or Instagram without the player open beside it. I still add personal notes or a PDF in the same project when I want commentary on top of the transcript.

**How we know it worked:** Video input usage clusters around repeat posters. Users who start from video often add a second source in the same project, which signals the stack is doing real work.

---

## What you can learn

1. **Repurposing is a structure problem first.** Pretty frames on vague bullets still fail in the feed.
2. **Timestamps are content.** Treat them as data, not decoration.
3. **Do not fork your pipeline per input.** One visual system, many doors.
4. **Design for the scroll, not the player.** Static output must stand alone.
5. **Modes beat monolith summaries.** Let users pick the shape their audience expects.

---

## Next step

Paste a recent video link in the [ViziVibes studio](https://vizivibes.com/studio), run chapter extraction, attach your [brand kit](./keeping-brand-consistency/article.md), and generate a carousel. Each slide should read without the recording open beside it.

For stacking video with PDFs and research, read [Combining Multiple Sources in One Visual](./combining-multiple-sources-in-one-visual/article.md).
