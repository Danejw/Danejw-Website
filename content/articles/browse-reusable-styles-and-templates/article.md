# Browse: Reusable Styles and Templates

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/browse](https://vizivibes.com/browse)

**Case study type:** Feature design  
**The task:** Give users a public gallery to discover, save, and reuse styles, palettes, formats, and extraction templates the community already built.  
**What we learned:** Individual taste scales when creative assets are public infrastructure, not private one-offs.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Surface searchable community assets so new users start from proven looks and templates |
| **Who it was for** | First-time users facing blank pickers and experienced creators willing to share what works |
| **Main constraint** | Starting from zero every project slows adoption; great defaults must be discoverable |
| **What we built** | Browse gallery with search, filter, sort, save, and apply for styles, palettes, formats, and templates |
| **Outcome** | Discovery to studio apply in one flow; public sharing turns personal work into community leverage |

---

## Background

New users do not lack ideas. They lack a starting point they trust.

We saw two patterns. Someone opens the style picker and freezes. Someone else builds a brilliant template or palette, keeps it private, and rebuilds something similar next month because there was no place to share.

ViziVibes users also build remarkable [brand kits](./keeping-brand-consistency/article.md), [custom extraction templates](./extraction-templates-for-content-structure/article.md), and [extracted styles](./extracting-style-from-a-reference/article.md). Keeping everything private wasted leverage. Browse is the bridge: discovery for newcomers, distribution for contributors.

---

## The task

Ship a public gallery at `/browse` for visual styles, layout formats, color palettes, and extraction templates with search, filters, popularity and recency sorts, save/like actions, and one-click apply into studio projects.

---

## Constraints

- Public assets must expose creative definitions, never private user content or extractions.
- Gallery UX must stay fast on mobile (creators browse on phones between meetings).
- Saved items must sync to the studio picker without duplicate imports.
- Quality signal (likes, recency) must be simple enough to resist gaming at v1.

---

## Our approach

Browse treats creative assets like shared infrastructure, parallel to personal libraries. Publishing is optional. Discovery is default for anyone stuck at "what style should I use?"

Templates in Browse extend the [Extraction Templates for Content Structure](./extraction-templates-for-content-structure/article.md) story: structure and style both become reusable.

---

## How we solved it

### Step 1: Four asset classes in one gallery

**What we did:** Listed public styles, palettes, formats, and extraction templates in unified Browse with type filters.

**Decision:** One gallery surface, not four disconnected pages.

**Why:** Users search for "timeline template" or "bold startup palette" without knowing internal taxonomy. Unified search matches mental models.

### Step 2: Search, filter, and sort

**What we did:** Added text search plus filters by asset type and sorts by recency and popularity (likes).

**Decision:** Keep sort options minimal at launch.

**Why:** Too many sort modes confuse. Recency plus popularity covers "what is new" and "what works."

### Step 3: Save and apply flow

**What we did:** Let authenticated users save liked assets to their library and apply them when creating or editing studio projects.

**Decision:** Save is lightweight curation; apply is the success metric.

**Why:** Likes without apply are vanity. The job is faster next project, not a bookmark graveyard.

### Step 4: Publish path from creation flows

**What we did:** Connected "make public" actions from style, palette, format, and template creators to Browse listing.

**Decision:** Publishing is opt-in at save time, reversible by policy later.

**Why:** Contributors should not accidentally leak private work. Explicit publish respects intent.

### Step 5: Tie Browse to retention loops

**What we did:** Linked gallery discovery to studio generation and optional creative challenges for themed submissions.

**Decision:** Browse feeds the core loop (input, style, generate), not a separate social network.

**Why:** Community features must reinforce posting utility. Challenges give a reason to return when calendar pressure is low.

---

## What we built

- Public Browse gallery at `https://vizivibes.com/browse`
- Asset types: styles, palettes, formats, extraction templates
- Search, filter, sort, save/like
- Apply saved assets inside the [studio](https://vizivibes.com/studio)
- Publish flow from personal asset creation
- Creative challenges for themed community participation

---

## Results

**Before:** I rebuilt similar templates weekly or stuck with generic defaults. Contributors had no audience for great work.

**After:** New users apply community templates on day one. Contributors see saves and likes as signal to publish more.

**What changed for us:** Day one does not have to mean inventing a visual system from zero. I discover what the community already proved, save it, and get to the story faster.

**How we know it worked:** Browse-to-studio apply events cluster in the first session for new accounts. Public template count grows without proportional support load.

---

## What you can learn

1. **Defaults can be community-sourced.** Curated plus public beats curated alone at scale.
2. **One gallery reduces discovery friction.** Unify related asset types under one search.
3. **Optimize for apply, not applause.** Saves matter when they shorten the next project.
4. **Publishing must be explicit.** Trust requires clear public vs private boundaries.
5. **Community features should feed the core job.** Discovery exists to get users to generate and post.

---

## Next step

Visit [ViziVibes Browse](https://vizivibes.com/browse), save one palette and one template, open the [studio](https://vizivibes.com/studio), and apply both to a small project. You should reach a credible first visual faster than building from scratch.

To publish your own template, start with [Extraction Templates for Content Structure](./extraction-templates-for-content-structure/article.md).
