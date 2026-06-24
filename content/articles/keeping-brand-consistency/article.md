# Keeping Brand Consistency

**Project:** ViziVibes  
**Link:** [https://vizivibes.com/studio](https://vizivibes.com/studio)

**Case study type:** Feature design  
**The task:** Bundle voice, creative rules, linked style/palette/format, and reference images so every project inherits the brand without re-entry.  
**What we learned:** Consistency at scale needs a single inherited brief, not a checklist you remember on busy Fridays.  
**Last updated:** June 23, 2026

---

## Case study at a glance

| | |
|---|---|
| **The task** | Set brand voice and visual rules once; flow them automatically into every generation |
| **Who it was for** | Founders, small marketing teams, and frequent posters who cannot babysit every graphic |
| **Main constraint** | Re-explaining brand on each project does not scale; drift is invisible until a post looks off |
| **What we built** | Brand kits with voice notes, do/don't rules, linked assets, reference images, and compiled prompts |
| **Outcome** | Teammates generate on-brand visuals without a design background or a brand PDF open |

---

## Background

I post every week. I care about consistency more than novelty. Still I watched drift creep in: wrong palette, tone that felt off, a teammate shipping something that did not match our guidelines because the brand doc was not open during crunch week.

Re-explaining voice and colors on every new project does not scale. Styles, palettes, and formats already existed in ViziVibes as separate assets. What we needed was one place that means "this is us" and attaches to projects by default.

---

## The task

Create brand kits that bundle positioning and voice, typography and imagery rules, linked default style/palette/format, reference images, and system plus negative prompts applied during generation.

---

## Constraints

- Brand setup must be completable in one sitting, not a week-long workshop.
- Kits must work for solo creators and small teams without admin overhead.
- Rules must reach the image step as concrete instructions, not vague "be on brand."
- Kits must compose with [extracted styles](./extracting-style-from-a-reference/article.md) users build from references.

---

## Our approach

A brand kit is the compiled creative brief for ViziVibes. When a project links to a kit, generation inherits voice, visual defaults, reference images, and guardrails automatically.

You still pick formats and tweak per post. You stop retyping who the audience is and what colors are forbidden.

---

## How we solved it

### Step 1: Bundle voice and positioning with visual defaults

**What we did:** Put audience, voice, and positioning notes in the same object as linked style, palette, and format selections.

**Decision:** One kit object per brand, not scattered settings across tabs.

**Why:** Fragmented settings recreate the Friday drift problem. One bundle is easier to audit and attach.

### Step 2: Encode do/don't rules explicitly

**What we did:** Added creative guardrails (imagery, iconography, layout preferences) plus negative prompt compilation for generation.

**Decision:** Surface "do not" rules as prominently as "do."

**Why:** Image tools need explicit bans. Users know what they hate seeing; the product must carry that forward.

### Step 3: Attach reference images at brand level

**What we did:** Let kits store reference images that flow into generation alongside per-project references.

**Decision:** Brand references are defaults, not replacements for one-off mood boards.

**Why:** Weekly posts and carousels need a stable visual anchor. Brand-level references provide it without re-uploading every session.

### Step 4: Project-level inheritance

**What we did:** Linked projects to a kit so every generate call pulls compiled system and negative prompts without manual copy.

**Decision:** Make kit attachment obvious at project start, changeable later.

**Why:** Inheritance should feel automatic. Hunting for an "apply brand" button fails busy users.

### Step 5: Compose with structured content

**What we did:** Fed [extraction template](./extraction-templates-for-content-structure/article.md) output plus brand kit prompts into the same generation assembly used in [Consistent Social Visuals for ViziVibes](../vizivibes-image-generation-masterclass/article.md).

**Decision:** Brand rules layer on structured content, never replace it.

**Why:** On-brand wrong facts are still wrong. Kits improve look and voice; templates protect data.

---

## What we built

- Brand kit editor for voice, audience, and creative rules
- Linked style, palette, and format defaults per kit
- Reference image library at brand scope
- Compiled system and negative prompts injected on generate
- Project attachment so teams inherit the same brief

---

## Results

**Before:** I re-entered palette and tone weekly. Teammates produced off-brand posts. Carousels drifted when brand context was incomplete.

**After:** I attach a kit once per project. Every generation inherits the full brief. New teammates ship acceptable visuals faster.

**What changed for us:** Consistency stopped being something I remembered on good days. It became infrastructure.

**How we know it worked:** Users with active brand kits show higher repeat generation within the same palette family and fewer post-export edits in external design tools.

---

## What you can learn

1. **Brand is infrastructure, not memory.** If it matters, store it where generation always reads it.
2. **Negative rules need equal weight.** Tell the model what to avoid, not only what to aim for.
3. **Bundle beats scatter.** Voice without palette defaults still drifts.
4. **Reference images stabilize series.** Defaults reduce carousel inconsistency.
5. **Inheritance beats copy-paste.** Attach once; generate many.

---

## Next step

Build one brand kit in the [ViziVibes studio](https://vizivibes.com/studio). Link it to a project, run two generations a week apart, and compare palette and tone without re-entering rules.

To pull kit assets from a site you admire, read [Extracting Style from a Reference](./extracting-style-from-a-reference/article.md).
