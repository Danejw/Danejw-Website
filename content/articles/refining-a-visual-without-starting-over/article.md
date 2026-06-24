# Refining a Visual Without Starting Over

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/studio](https://vizivibes.com/studio)

**Case study type:** Feature design  
**The task:** Let users fix copy, layout, and image details on an almost-right visual without rebuilding the project or losing prior versions.  
**What we learned:** Designed by default does not mean frozen on first pass. The fast loop is generate, refine, export.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Support small edits (headline, hierarchy, one image spot) inside the studio with version history |
| **Who it was for** | Users who reach 90% fast but refuse to ship the last 10% or redo everything in another app |
| **Main constraint** | Full regeneration wastes credits and time; exporting to another tool breaks brand and structure context |
| **What we built** | HTML live preview with inline edits, AI chat refinement, targeted image edits, and project history |
| **Outcome** | Iteration stays inside ViziVibes until the visual is post-ready |

---

## Background

The first generation in ViziVibes is often fast and close. Close is not shipped.

I would fix one headline, realize the hierarchy was off, or want a small change on one image spot. The old choices were bad: regenerate everything and burn credits, or export to another app and break the loop.

Our product principle is a fast loop with tight feedback. Generation is step one, not the finish line.

---

## The task

Ship refinement tools that cover text and layout (HTML preview and chat) and raster tweaks (targeted image edit), store every generation in project history, and keep [brand kit](./keeping-brand-consistency/article.md) context attached through edits.

---

## Constraints

- Edits must feel cheaper than full regeneration in time and credits.
- Users need to compare versions, not overwrite blindly.
- HTML and image paths serve different output types; both must exist.
- Refinement must not become a general-purpose design suite.

---

## Our approach

We split refinement by output shape.

HTML-capable outputs get live preview, inline text and hierarchy edits, conversational AI chat, and export from preview. Raster outputs get targeted edit prompts against the current image, optional reference images, without rebuilding upstream [extraction](./extraction-templates-for-content-structure/article.md).

Project history spans both: every generate and meaningful edit leaves a trail.

---

## How we solved it

### Step 1: HTML live preview as the text layout surface

**What we did:** Rendered eligible outputs in an interactive preview where users adjust copy and structure directly.

**Decision:** Prioritize legible text edits in-product over sending users to external typography tools.

**Why:** Infographics fail in the feed when headlines clip. Inline fix beats round trip.

### Step 2: AI chat for conversational edits

**What we did:** Added a chat panel that applies described changes against the current preview state.

**Decision:** Chat edits target the open preview, not the entire project from scratch.

**Why:** "Make the title shorter" is a natural instruction. Scoped chat keeps context and avoids full rewrites.

### Step 3: Targeted image editing

**What we did:** Let users issue edit prompts on the current raster image, with optional reference images for style alignment.

**Decision:** Image edit is a patch operation, not a new generation pipeline.

**Why:** Changing one illustration spot should not re-run carousel splitting or re-charge a full multi-slide job.

### Step 4: Project history and compare

**What we did:** Stored each generation (and key refinements) in chronological project history with recall to prior passes.

**Decision:** History is browseable, not a single undo stack.

**Why:** Creators try three directions before posting. Compare beats guessing which version was better.

### Step 5: Keep brand and content context attached

**What we did:** Preserved linked brand kit, active [content stack](./combining-multiple-sources-in-one-visual/article.md), and format choices when returning from history or running edits.

**Decision:** Refine never detaches the project brief.

**Why:** A fix that drifts off-brand forces another fix. Context preservation prevents cascade rework.

---

## What we built

- HTML live preview with inline editing for supported outputs
- AI chat panel for described layout and copy changes
- Targeted image edit flow with optional references
- Project history with version recall and comparison
- Export paths from preview and stored assets (PNG, ZIP for carousels, HTML export where applicable)

---

## Results

**Before:** I accepted "good enough," paid for full regenerations for tiny changes, or exported and abandoned the loop.

**After:** Most post-ship tweaks happen inside the studio. History makes experimentation low risk.

**What changed for us:** The loop is generate, refine, export. Small edits stay cheap in time and attention. I stop starting over for the last ten percent.

**How we know it worked:** Time from first generation to export shortened for users who open preview or chat. Support asks shifted from "how do I fix one word" to "which version exported cleanest."

---

## What you can learn

1. **First pass is not the product.** Plan refinement as first-class, not apology UI.
2. **Match edit surface to output type.** HTML for text hierarchy; targeted prompts for pixels.
3. **Scope AI edits tightly.** Conversational does not mean rewrite everything.
4. **Version history enables courage.** Users iterate more when rollback is obvious.
5. **Preserve context across edits.** Brand and structure attachment prevents drift.

---

## Next step

Generate once in the [ViziVibes studio](https://vizivibes.com/studio), open preview, change one headline, chat one layout tweak, then open history and compare. Ship from there without opening another design app.

For how generation sets up refinement, read [Consistent Social Visuals for ViziVibes](../vizivibes-image-generation-masterclass/article.md).
