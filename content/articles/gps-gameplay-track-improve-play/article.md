# Case Study: Turn live-round GPS into gameplay insights on the course map

**Project:** Go Golf Leagues
**Link:** https://gogolfleagues.com

**Case study type:** Feature design
**The task:** Use the player's phone GPS during an active league round to track movement, surface in-round yardage and shot hints, and give members a visual record they can use to improve without adding manual data entry.
**What we learned:** Treat GPS as one shared spatial substrate on a single map canvas, with pure detection logic, conservative defaults, and informational overlays that never override the score the player enters.
**Last updated:** June 22, 2026

Go Golf Leagues (internal codename Roundmark) is a map-first golf league app. During a live round, members should get yardage, hole awareness, and shot feedback from the same GPS stream that powers league fairness and spectator views. This case study explains how we built that loop in the existing codebase.

## Case study at a glance

| | |
|---|---|
| **The task** | Connect live-round GPS to gameplay: track movement, show yardage and inferred shots, and render trails on the 3D course map so players can track and reflect on their round. |
| **Who it was for** | League members scoring on their phone mid-round, plus fellow members and spectators watching the same event on the shared map. |
| **Main constraint** | One persistent Google Map canvas for the whole app (no second map), mobile PWA only, noisy consumer GPS, and location sharing that must stay opt-in and league-scoped. |
| **What we built** | A location-sharing gate, shot trail capture and 3D rendering, proximity-based hole detection with scorecard nudges, live yardage-to-pin, inferred shot chips, and live member presence on the course. |
| **Outcome** | Active-round players see distance to the next green, optional "~N shots detected" hints, and proximity nudges when they walk ahead without entering a score; after the round, league members can replay GPS trails on the Photorealistic 3D map. |

## Background

Recreational league golf still runs on group chats and spreadsheets. Go Golf Leagues already centers the product on a single Google Map canvas where leagues, courses, and events live (see ADR 0005: map-canvas app shell). That architectural choice created an opportunity: once a member shares location during an active round, the same coordinates could power fairness checks, live presence, yardage, and post-round visualization.

Before this work, the map showed courses and pins, but it did not persist a player's path through a round or translate GPS into gameplay cues. Players still had to remember which hole they were scoring, estimate distance without in-app yardage, and manually count strokes with no assist from movement data.

The product vision keeps the core loop simple: open round, submit scores, close round, check standings. GPS features had to strengthen that loop, not replace it with a launch monitor or a second scoring workflow.

## The task

**Use live-round GPS on the existing map canvas to track player movement, surface in-round yardage and shot hints, and store trails league members can review after the round.**

Done means: (1) GPS samples and inferred events persist per round with league-scoped access control, (2) the 3D map renders those trails for active and closed rounds, (3) the scorecard shows informational shot hints and proximity nudges without auto-filling scores, and (4) members must enable location sharing before they can post scores on an active round.

## Constraints

| Constraint | Why it mattered |
|------------|-----------------|
| Single map instance | ADR 0005 forbids mounting a second map. Every spatial feature must register layers on `MapCanvasProvider`, not spawn new routes or canvases. |
| Mobile PWA, no native app | All capture uses `navigator.geolocation` in the browser. High accuracy is requested, but accuracy and sampling rate vary by device. |
| Noisy GPS | Consumer fixes jitter at tee boxes and greens. Detection had to be conservative (dwell windows, accuracy gates, dedupe) to avoid false shot counts. |
| Privacy and fairness | Location is sensitive. Sharing is a persisted opt-in (`roundmark:share-my-location` in localStorage). Active-round scoring is gated behind `JoinLiveLocationGate` so members confirm they are on course. RLS limits trail reads to league members. |
| Informational only for scores | Inferred shots must never write to the official scorecard. The player always enters the stroke count; GPS only suggests. |
| 3D rendering cost | Shot trails render only on the Photorealistic 3D globe (`gmp-map-3d` polylines). The 2D basemap keeps standard hole markers. |
| Write volume | A 1 Hz GPS stream would flood the database. Samples are downsampled before each server flush. |

## Our approach

We framed GPS as **one spatial substrate** with three layers of value:

1. **Capture:** Watch position while location sharing is on and the round is active. Tag each point with the nearest mapped hole using `course_holes.green_lat` / `green_lng`.
2. **Infer:** Run pure, unit-tested functions client-side to detect stillness (proxy for setup and swing) and thin raw samples before upload.
3. **Consume:** Feed the same data into map layers (trails, pulse ring), scorecard chips (inferred shots, proximity nudge), and live overlays (yardage card, member presence).

We explicitly did **not** optimize for tour-grade shot tracking, automatic score entry, or features that require new permissions or hardware. A brainstorm doc (`docs/proposals/2026-06-14-spatial-engagement-features.md`) captures follow-ons like drive-distance inference, pace rings, and cinematic replay; those are out of scope for what shipped in June 2026.

Principles we agreed on upfront:

- **Location sharing is the master switch.** If a player turns sharing off mid-round, trackers stop, presence falls back to course coordinates, and proximity detection goes quiet.
- **Pure detection, impure wiring.** `src/lib/shot-detection.ts` stays side-effect free so synthetic GPS streams can be tested without a browser.
- **No React state in the hot path.** The shot trail tracker keeps samples in refs so geolocation callbacks do not re-render the tree every second.

## How we solved it

### Step 1: Centralize location sharing

**What we did:** Added a global location-sharing flag in `src/components/canvas/my-location-layer.tsx` with `isLocationSharingEnabled()` and `setLocationSharingEnabled()`. Default is on; explicit `"0"` in localStorage is the only off state. The flag broadcasts `rm:share-location-changed` so every GPS consumer restarts consistently.

**Decision:** One toggle for the whole app instead of per-feature permission prompts.

**Why:** Members already opt in through the toolbar and browser geolocation prompt. Re-prompting per feature would feel spammy and desync trail capture from live presence. Every downstream hook (`useShotTrailTracker`, `useProximityHole`, `LiveCourseMemberLayer`, `NextHoleDistanceCard`) reads the same flag.

### Step 2: Gate live scoring on location

**What we did:** Built `JoinLiveLocationGate` in `src/components/league/join-live-location-gate.tsx`. When a round is active and the viewer has not enabled sharing, `EventScorecardOverlay` shows the gate instead of the scorecard. Spectators still see `ShotTrailLayer` for other players.

**Decision:** Require location to **post** scores, not to **view** closed-round trails.

**Why:** League integrity depends on knowing members are physically at the course during live play. Read-only review after close should not force GPS. Organizers reviewing a closed card are not blocked by the gate.

### Step 3: Persist trails with league-scoped RLS

**What we did:** Created `round_shot_samples` (migration `20260614005002_*.sql`) with columns for `round_id`, `player_id`, `hole_idx`, `lat`, `lng`, `accuracy_m`, `captured_at`, `kind`, and `inferred_shot_count`. Kinds are `sample`, `shot`, and `hole_commit` (schema reserved for score-commit snapshots). Server functions `appendShotSamples` and `getRoundShotTrails` in `src/lib/shot-trails.functions.ts` bulk-insert and chronologically fetch rows. RLS allows league members to SELECT and players to INSERT/DELETE their own rows.

**Decision:** Store raw samples and inferred shots in one table with a `kind` discriminator.

**Why:** One table keeps rendering simple: polylines use `sample` rows, shot rings use `shot` rows. Batched inserts (max 200 per flush) match the ~20s client interval and limit write amplification.

### Step 4: Detect shots from stillness, not button taps

**What we did:** Implemented `detectShots()`, `downsampleForFlush()`, `nearestHole()`, and `distanceM()` in `src/lib/shot-detection.ts`. Defaults: 30s dwell, 8m still radius (scaled by reported accuracy), 25m accuracy gate, 4m / 10s dedupe for consecutive shots. Unit tests live in `tests/shot-detection.unit.test.ts`.

**Decision:** Infer shots from **standing still**, not from score commits or manual markers.

**Why:** Golfers naturally pause before each shot. Dwell-based detection works with the GPS stream we already collect and avoids asking users to tap "I hit." The algorithm is intentionally conservative: false negatives (missing a shot) are acceptable; false positives (inflated counts) erode trust on the scorecard chip.

### Step 5: Capture in a ref-based tracker hook

**What we did:** `useShotTrailTracker` in `src/components/canvas/use-shot-trail-tracker.ts` runs `navigator.geolocation.watchPosition` with `enableHighAccuracy: true` while the round is active, the viewer is the round player, and sharing is on. Every 20 seconds it runs detection on the **full** buffer (so still windows spanning flushes still close), downsamples new samples (min 5m or 8s apart), tags each row with `nearestHole()`, and POSTs via `appendShotSamples`. State lives in refs only.

**Decision:** Flush on an interval with soft-fail retry instead of streaming every fix to the server.

**Why:** Mobile networks drop. Advancing `flushedSampleIdxRef` only after a successful append lets the next tick retry. Running detection on the full buffer prevents splitting a 30s still window across two flushes from missing a shot.

### Step 6: Render trails on the 3D map

**What we did:** `ShotTrailLayer` in `src/components/canvas/shot-trail-layer.tsx` refetches trails every 10s, groups rows by player and hole, and draws `<gmp-polyline-3d>` paths plus small ring polylines at each inferred shot. Each player gets a stable color from a fixed palette. The layer is mounted from `EventScorecardOverlay` for both active and closed rounds.

**Decision:** 3D-only trails; no trail polylines on the 2D basemap.

**Why:** Photorealistic terrain makes paths readable. On flat 2D, hole markers already communicate layout; duplicating trails would clutter without adding depth cues.

### Step 7: Confirm which hole the player is on

**What we did:** `useProximityHole` compares the viewer's fix to green centroids. A hole confirms only after 10s dwell within 80m of that green and with accuracy at most 25m. On confirmation it emits `rm:proximity-hole-changed`. `ActiveHolePulseLayer` listens and paints a yellow ring on the 3D green. `ScorecardOverlay` compares detected hole to the next unscored hole and shows a nudge like "On hole 6 now. Enter hole 5."

**Decision:** Hysteresis (dwell + distance + accuracy) instead of instant nearest-hole snapping.

**Why:** Walking between greens or sitting at the clubhouse would flap hole selection if we switched on every GPS tick. The nudge targets a specific failure mode: teeing off the next hole before entering the previous score.

### Step 8: Surface yardage and inferred shots in the scorecard UI

**What we did:**

- `NextHoleDistanceCard` computes haversine distance from the live fix to the next unscored green pin, shown in yards or meters with locale-aware defaults.
- `useViewerInferredShotCounts` derives per-hole running shot counts from persisted `shot` rows.
- `NextHoleInput` shows a `~N` chip and "Detected N shots" caption when counts exist. It never auto-fills the stroke field.

**Decision:** Show GPS-derived hints adjacent to manual score entry, not inside it.

**Why:** GPS inference will be wrong sometimes. Keeping hints informational preserves trust in the official score while still helping players self-check ("I thought that was three, GPS saw four stops").

### Step 9: Broadcast live member positions

**What we did:** `LiveCourseMemberLayer` joins a Supabase Realtime presence channel per round, throttling GPS broadcasts to once every 5 seconds. If sharing is off, the member still appears at course coordinates so the group is not invisible.

**Decision:** Throttle presence updates; do not persist every presence tick.

**Why:** Spectators need a sense of where groups are on course. Persisting presence would duplicate trail storage with shorter TTL data. Trails remain the durable artifact; presence stays ephemeral.

## What we built

| Capability | Primary files | Behavior |
|------------|---------------|----------|
| Global location sharing | `my-location-layer.tsx` | Persisted opt-in, viewer pin on map |
| Live scoring gate | `join-live-location-gate.tsx`, `event-scorecard-overlay.tsx` | Must share location to enter scores on active rounds |
| Shot trail capture | `use-shot-trail-tracker.ts`, `shot-detection.ts`, `shot-trails.functions.ts` | GPS buffer, stillness detection, batched persist |
| Trail visualization | `shot-trail-layer.tsx` | 3D polylines and shot rings, 10s refetch |
| Proximity hole detection | `use-proximity-hole.ts`, `active-hole-pulse-layer.tsx` | Confirmed hole with dwell, map pulse, scorecard nudge |
| Yardage to pin | `next-hole-distance-card.tsx` | Distance to next green + weather chip |
| Inferred shot hints | `scorecard-overlay.tsx`, `useViewerInferredShotCounts` | Informational chip on next-hole input |
| Live member map pins | `live-course-member-layer.tsx` | Realtime presence, 5s GPS throttle |
| Data model | `round_shot_samples` migration | League-member read, player write, hole tagging |

**Stack notes:** TanStack Query and server functions for fetch/mutate, Supabase RLS for authorization, Google Maps Platform 3D elements (`gmp-map-3d`, `gmp-polyline-3d`) for rendering, browser Geolocation API for capture.

**Schema ahead of wiring:** `hole_commit` rows are defined in `shot-trails.shared.ts` for GPS snapshots at score post time, but score submission does not yet append them. Trails today are built from periodic `sample` rows and `shot` events only.

## Results

### Before

- No persisted per-round movement data.
- Players picked holes manually with no geometry-based nudge when they walked ahead.
- No in-app yardage to the next green during league play.
- The map showed static course geometry, not how a member actually played the round.

### After

- Active players with sharing enabled generate downsampled GPS samples and inferred shot events stored in `round_shot_samples`.
- The scorecard shows live distance to the next pin (`NextHoleDistanceCard`) and optional detected shot counts on the entry card.
- Proximity detection surfaces a banner when the player is physically on a hole ahead of their next unscored hole.
- League members viewing an active or closed round see colored 3D trail polylines and shot markers on the shared map canvas.
- Location-off mid-round stops new capture immediately; existing rows remain for review.

### How we know it worked

| Signal | Evidence in codebase |
|--------|----------------------|
| Detection correctness | Unit tests on synthetic stillness streams in `tests/shot-detection.unit.test.ts` |
| End-to-end wiring | `EventScorecardOverlay` mounts tracker + layer; `ScorecardOverlay` consumes proximity and inferred counts |
| Authorization | RLS policies on `round_shot_samples`; server fns require authenticated league members |
| Operational safety | Downsampling + 200-row batch cap; soft-fail flush retry; ref-based tracker avoids render storms |
| Shipped scope | Documented in `docs/summaries/2026-06-14.md` and `.lovable/memory/features/shot-trails.md` |

We have not claimed stroke-level accuracy versus a rangefinder or launch monitor. Success for V1 is **useful hints and a memorable visual replay**, not automated scoring.

## What you can learn

1. **Anchor spatial features on one canvas.** When the product already centers a map, new GPS capabilities should register as layers and hooks on that canvas instead of new pages or duplicate maps.
2. **Separate pure detection from I/O.** Keeping `detectShots` deterministic and tested made it possible to tune dwell and dedupe thresholds without flaking browser tests.
3. **Treat GPS as suggestive for gameplay, authoritative for presence.** Yardage and shot hints assist decisions; official scores stay manual until trust in inference is proven.
4. **Use dwell and accuracy gates for noisy sensors.** Instant nearest-neighbor logic fails outdoors. Time-based confirmation trades a few seconds of lag for stability.
5. **Make privacy switches global and respected everywhere.** One sharing flag wired through capture, presence, proximity, and gating avoids accidental leaks and support confusion.

## Next step

If you run a league on Go Golf Leagues, open an active event with location sharing enabled and walk nine holes with the scorecard open. Compare the detected shot chips to your own count, watch the yardage card update as you approach the green, and review your 3D trail after the round closes.

For builders extending this stack, the highest-leverage follow-ups already scoped in-repo are: wire `hole_commit` samples at score post for cleaner hole endpoints, drive-distance inference from the same buffer, and league hole heatmaps aggregated from official scores. Each builds on `round_shot_samples` and the single map canvas without changing the core score loop.
