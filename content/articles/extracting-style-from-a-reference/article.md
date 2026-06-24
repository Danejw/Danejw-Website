# Extracting Style from a Reference

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/studio](https://vizivibes.com/studio)

**Case study type:** Feature design  
**The task:** Let users turn a reference image or public website URL into reusable style, palette, and format assets for their own content.  
**What we learned:** Taste becomes scalable when you extract assets, not when you write one more adjective in a prompt box.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Convert a loved visual or website into saved style, palette, and format the studio can reuse |
| **Who it was for** | Creators who know what they like but struggle to describe it in words |
| **Main constraint** | Manual reverse-engineering in design tools eats the time savings AI promised |
| **What we built** | Image and URL extraction paths for style, palette, format, and brand cues |
| **Outcome** | Reference to reusable asset in minutes, then on-brand generation on the user's story |

---

## Background

I save references constantly. A post I admired. A landing page with the exact tone I want. A mood board image on my desktop.

Describing that look in words never quite worked. The output was close, then cost another generation to fix. Copying hex codes by hand felt like the old world sneaking back in.

We already had curated styles. The gap was meeting users at the reference they actually have and turning it into something the system can apply repeatedly.

---

## The task

Support style, palette, and format extraction from uploaded reference images, plus design and brand cue extraction from public website URLs, then let users save, combine, and attach results to projects and [brand kits](./keeping-brand-consistency/article.md).

---

## Constraints

- Extraction must produce reusable named assets, not one-off prompt text.
- URL analysis must respect public pages only and return actionable design direction.
- Users need to combine extracted pieces without breaking saved assets.
- Extracted assets should be publishable to [Browse](./browse-reusable-styles-and-templates/article.md) when users want to share.

---

## Our approach

References are inputs to asset creation, not inputs to a single generation. Extract once, save, apply many times.

Image path: visual tone, color, layout logic. URL path: site-level palette, typography feel, brand identity cues useful when building a kit.

---

## How we solved it

### Step 1: Separate extraction types

**What we did:** Built distinct flows for style, palette, and format extraction from images, each saving to the user's library.

**Decision:** Three asset types, not one blob labeled "vibe."

**Why:** Users mix and match. A palette from one reference and a format from another is normal. Separate assets enable that.

### Step 2: URL-based design extraction

**What we did:** Added public URL analysis that returns summary-ready content plus brand and design cues (colors, tone, layout hints).

**Decision:** Use URL extraction for both content and brand direction, depending on template mode.

**Why:** A founder's own marketing site is often the best brand reference. One paste can feed structure and style.

### Step 3: Save, name, and reuse

**What we did:** Persisted extractions as named styles, palettes, and formats selectable in any project.

**Decision:** Treat extractions like user-created assets with the same UX as curated defaults.

**Why:** If extraction only lives in one project, users re-run it next week. Saved assets compound value.

### Step 4: Combine styles

**What we did:** Allowed merging extracted or custom styles into a new combined style.

**Decision:** Support blend, not only single-source clone.

**Why:** Real brands are hybrids. "Their typography feel plus our palette" is a legitimate goal.

### Step 5: Feed references into generation

**What we did:** Passed saved instructions, palette colors, format system prompts, and optional reference images into the generation assembly described in [Consistent Social Visuals for ViziVibes](../vizivibes-image-generation-masterclass/article.md).

**Decision:** Extracted assets compile to concrete model instructions, not display labels.

**Why:** "Modern Corporate" on screen must become spacing, type, and color rules behind the scenes.

---

## What we built

- Image-based style, palette, and format extraction with save to library
- URL analysis for brand identity and design cues
- Combine-styles flow for hybrid looks
- Optional publish to Browse for community reuse
- Integration with brand kits and project generation defaults

---

## Results

**Before:** I described looks poorly, copied hex codes by hand, or accepted generic AI aesthetics.

**After:** I upload or paste once, save assets, and generate on my own [structured content](./extraction-templates-for-content-structure/article.md) with a matched look.

**What changed for us:** Taste became a reusable asset, not a one-time prompt. I extract once, generate many times on my own story, and the studio compiles concrete instructions the model can follow.

**How we know it worked:** Saved extracted styles rank high among users who post weekly. URL-to-kit workflows appear in onboarding stories from founders who skipped manual brand workshops.

---

## What you can learn

1. **References beat adjectives.** Convert taste into assets the system can reuse.
2. **Split style, palette, and format.** Flexibility follows from separate objects.
3. **Websites are brand documents.** URL extraction can jump-start kits honestly.
4. **Save everything worth repeating.** One-time extraction is a feature; reusable extraction is infrastructure.
5. **Compile for the model.** Human labels need machine-readable instructions underneath.

---

## Next step

Upload one screenshot you love in the [ViziVibes studio](https://vizivibes.com/studio). Extract palette and style. Apply them to your own notes and generate. Then attach both to a [brand kit](./keeping-brand-consistency/article.md) so next week is one click.

To publish a style others can reuse, read [Browse: Reusable Styles and Templates](./browse-reusable-styles-and-templates/article.md).
