# Extraction Templates for Content Structure

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/studio](https://vizivibes.com/studio)

**Case study type:** Feature design  
**The task:** Shape raw input into reliable structures (timeline, comparison, pros/cons, data table, playbook) before any visual style runs, and let users save and share custom templates.  
**What we learned:** Data is sacred only when structure is explicit and reusable, not when you hope a style prompt preserves the facts.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Protect numbers, comparisons, and timelines through extraction, then hand clean structure to the design layer |
| **Who it was for** | Educators, analysts, founders, and marketers burned by AI that prettifies away the facts |
| **Main constraint** | Generic summarization breaks tables, drops columns, and rounds numbers users need exact |
| **What we built** | Built-in extraction modes plus custom templates users can save, share, and discover in Browse |
| **Outcome** | Structure survives from source to visual; users reuse templates instead of re-prompting every week |

---

## Background

Early on I loved how fast AI visuals were. I trusted them less after a comparison chart dropped a column and a timeline turned into vague bullets. The design looked polished. The data did not.

The issue was rarely the image step. It was what we fed it: unstructured prose where structured data should have been. We wrote a rule inside ViziVibes: data is sacred. The fix was not a longer style prompt. It was extraction templates that run before any pixels.

---

## The task

Ship built-in extraction patterns for common jobs, let power users define custom templates with named instructions (and optional schemas), and surface public templates in [Browse](./browse-reusable-styles-and-templates/article.md) so structure becomes shared infrastructure.

---

## Constraints

- Templates must differ by source type (URL vs file vs web research vs video).
- Custom templates cannot require engineering work to create.
- Public sharing must not leak private user content, only the template definition.
- Extraction cost and generation cost must stay transparent in credits.

---

## Our approach

We split the pipeline into extract, structure, design, generate. Style, palette, and format never run on raw chaos. They run on template output.

Built-in modes cover the common cases. Custom templates cover niche workflows. Public templates turn one user's discipline into everyone else's shortcut.

---

## How we solved it

### Step 1: Map modes to real jobs

**What we did:** Shipped built-in patterns including timeline, comparison, pros/cons, data table, playbook, summary, key facts, and brand identity cues from URLs.

**Decision:** Name modes after outcomes users recognize, not internal model jargon.

**Why:** "Comparison" means something in a marketer's head. "Structured JSON pass" does not.

### Step 2: Wire modes per source path

**What we did:** Limited available modes by source (web research gets statistical and explainer patterns; files get outline and action items; videos get chapters).

**Decision:** Curate the menu per input instead of one infinite list.

**Why:** Wrong mode on wrong source produces garbage fast. Curation is UX, not limitation.

### Step 3: Custom templates with save and share

**What we did:** Let users save named instructions (and schemas where needed) as reusable templates attached to their account.

**Decision:** Templates are first-class objects, not buried prompt history.

**Why:** Weekly workflows should be one click, not a hunt through last Tuesday's project.

### Step 4: Public templates in Browse

**What we did:** Allowed users to publish templates to the community gallery with search, sort, and save.

**Decision:** Treat templates like styles and palettes: discoverable creative assets.

**Why:** A teacher's timeline template helps the next teacher on day one. Community scale beats solo reinvention.

### Step 5: Hand structured output to generation unchanged

**What we did:** Passed template output into the generation prompt as structured content blocks, with [brand kits](./keeping-brand-consistency/article.md) and formats layered on top.

**Decision:** Forbid silent re-summarization between extraction and image generation.

**Why:** Every extra summarization step is a chance to drop a number. One structured handoff preserves trust.

---

## What we built

- Built-in extraction modes across text, files, URLs, video, and web research
- Custom template creator with save and optional schema
- Public template publishing and discovery in Browse
- Structured extraction records that [stack in multi-source projects](./combining-multiple-sources-in-one-visual/article.md)
- Clear credit surfacing before extract and generate

---

## Results

**Before:** I got fast visuals with occasional factual drift. I re-prompted manually every session.

**After:** I pick the mode first, check the extraction, then generate. Numbers and comparisons survive the trip.

**What changed for us:** I stop blaming the image step when the structure step was wrong. If facts matter in your posts, structure is not optional.

**How we know it worked:** Template save rate and Browse applies climb among retained users. Structure became habit, not a one-time fix.

---

## What you can learn

1. **Structure is a product layer, not a prompt trick.** If facts matter, formalize extraction before pixels.
2. **Name modes for user jobs.** Vocabulary alignment reduces wrong-mode errors.
3. **Reusable templates beat heroic prompting.** Encode discipline once.
4. **Community templates compound value.** Shared structure is as important as shared style.
5. **Minimize handoffs that re-summarize.** Every hop risks data loss.

---

## Next step

Run the same URL twice in the [studio](https://vizivibes.com/studio): once as a data table, once as pros/cons. Compare extraction output before you generate. Then save your favorite as a custom template or grab one from [Browse](./browse-reusable-styles-and-templates/article.md).

For how structure meets brand rules, read [Keeping Brand Consistency](./keeping-brand-consistency/article.md).
