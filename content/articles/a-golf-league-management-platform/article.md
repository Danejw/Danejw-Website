# A Golf League Management Platform

**Project:** Go Golf Leagues
**Link:** [https://gogolfleagues.com](https://gogolfleagues.com)

**Case study type:** Product build  

**The task:** Replace the group-chat-and-spreadsheet loop for recreational golf leagues with a mobile-first scoring and standings system that gives every member a persistent, trusted record of where they stand.
  
**What we learned:** Anchor every feature on one primary action loop (open round, submit scores, close round, check standings) and enforce league rules at the API layer so the product stays official even when the organizer is not watching the UI.
**Last updated:** June 22, 2026


Recreational golf leagues often run on WhatsApp threads and Google Sheets. One volunteer chases scores, updates formulas by hand, and settles disputes from memory. Go Golf Leagues (internal codename Roundmark) exists to make that loop feel official without weekly spreadsheet labor. This case study explains the core problem the product solves and how the codebase implements the answer.

## Case study at a glance


|                     |                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The task**        | Give league organizers and members a single place to open rounds, enter scores from the course, close rounds safely, and see persistent season standings instead of scattered messages and manual spreadsheets.                             |
| **Who it was for**  | The unpaid volunteer League Organizer (buyer) who carries admin work, and Members who need to self-report scores and check rank from their phones.                                                                                          |
| **Main constraint** | Casual leagues want something faster than a spreadsheet but lighter than club or tournament software. V1 must nail one recurring loop on mobile before adding chat, dues, or facility-grade features.                                       |
| **What we built**   | A map-first PWA with invite-link leagues, season and event scheduling, a four-state round lifecycle, hole-by-hole score entry, organizer overrides with audit logs, and standings that recalculate when a round closes.                     |
| **Outcome**         | Organizers can run the full loop on a phone at the production URL: create a league, schedule an event, open a round, collect member scores, close with missing-score guardrails, and publish updated standings members can revisit anytime. |


## Background

The product vision in `docs/golf-league/product/VISION.md` states the core problem plainly: organizers run leagues on group chats, spreadsheets, and Venmo. There is no persistent scoreboard, no portable history, and no single place to check standings. One person carries the admin burden, so the league feels informal rather than real.

The business model doc (`docs/golf-league/product/business-model.md`) goes deeper. The pain is not only scorekeeping. Standings get delayed or disputed. Scores live in scattered places. Members do not know where they stand. Handicaps drift. The organizer becomes the permanent spreadsheet person.

Existing alternatives each fail a casual league in a different way. Spreadsheets are flexible but manual every week. Group texts are easy but messy. Heavy league or club software can feel overbuilt for a private friend group. The strategic wedge documented in the repo is narrow: **private league scoring and standings**, not a full club management system.

Before Go Golf Leagues, there was no shared domain model for League, Season, Event, Round, and Standing in one app. There was no enforced rule that scores can only be entered while a round is active. There was no audit trail when an organizer corrected a disputed total.

## The task

**Replace the spreadsheet-and-group-chat league loop with a mobile-first system where organizers open and close rounds, members self-report scores, and season standings persist in one trusted place.**

Done means: (1) an organizer and at least two members can complete the full loop on a phone without manual database fixes (MVP success criteria in `VISION.md`), (2) score entry is blocked outside an active round at the API layer, (3) closing a round with missing scores requires an explicit organizer choice, and (4) standings remain viewable after the round closes.

## Constraints


| Constraint                                 | Why it mattered                                                                                                                                                                                          |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One primary action loop                    | `VISION.md` defines: Organizer opens Round, Members submit scores, Organizer closes Round, Standings update, Members check rank. Every feature must strengthen this loop or remove friction from it.     |
| Organizer is the buyer, members must adopt | Members do not pay, but the product fails if they will not enter scores on course. Mobile PWA first; no native app in V1.                                                                                |
| Casual scope, not club software            | Non-goals in `VISION.md` include match play, GHIN integration, public discovery, in-app messaging (V2), email (V3), and multi-round events.                                                              |
| Trust over social noise                    | Domain context (`docs/golf-league/domain/CONTEXT.md`) positions communication and dues as supporting, not co-equal pillars. The official record matters more than a feed.                                |
| Rules enforced server-side                 | UI-only gating is not enough. Triggers like `tg_scores_require_active_round` and RLS policies must match what overlays show.                                                                             |
| V1 standings on close, not live            | ADR 0001 models Round as Scheduled, Active, Closed, or Cancelled. V1 recalculates standings on Active to Closed. Live updates during an active round are a V2 insertion point, not shipped behavior.     |
| Map canvas is the shell, not the core job  | ADR 0005 places one persistent Google Map under every authenticated view. That helps members see leagues, courses, and events spatially, but scoring and standings remain the product's reason to exist. |


## Our approach

We framed the product around **making a casual league feel official** without asking organizers to learn tournament software.

Three design commitments followed from the docs and code:

1. **Model the round as a state machine, not a timestamp.** ADR 0001 treats Round state as explicit. Score writes attach to Active rounds. Closure triggers standings recalculation. Reopen is organizer-only and invalidates standings until re-close.
2. **Separate organizer power from member self-report.** Members enter only their own scores. Organizers can override any score while a round is active, with every edit logged in `score_edit_logs` for dispute transparency (`CONTEXT.md`).
3. **Keep the authenticated app on one map canvas with floating panels.** ADR 0005 lets leagues, events, and scorecards appear as overlays on a shared map so context (where we play, who is in the league) stays visible without turning the product into a spreadsheet with pins.

We explicitly did **not** try to replace GHIN, run dues in V1, or become a messaging app. Those are documented deferrals, not hidden scope.

## How we solved it

### Step 1: Define the domain language before the UI

**What we did:** Locked glossary terms in `docs/golf-league/domain/CONTEXT.md`: League, Season, Event, Round, Score, Standing, Organizer, Member, Player. Retired confusing terms (for example, "Tournament" is an Event). Documented score entry rules and the incomplete-scores flow when closing a round.

**Decision:** Treat the domain doc as authoritative for agents and engineers, separate from product vision and engineering schema.

**Why:** Casual leagues already have informal vocabulary. Without shared terms, UI copy and API handlers drift. Explicit rules (members cannot enter scores for others, scoring method locked per season) prevent "helpful" shortcuts that break trust.

### Step 2: Build the round state machine as the scoring gate

**What we did:** Implemented ADR 0001 with four round states. Server functions such as `openRound` in `src/lib/scores.functions.ts` and `closeRound` in `src/lib/standings.functions.ts` transition state and trigger standings work. Database triggers block score inserts unless the round is active.

**Decision:** Enforce score entry at the API and database layer, not only in React overlays.

**Why:** Golfers will refresh, share links, or use slow networks. If enforcement lived only in the scorecard UI, members could post scores after a round closed and undermine the official record.

### Step 3: Ship the organizer loop end to end

**What we did:** Followed the multiphase MVP plan under `docs/golf-league/multiphase-plan/`: signup and league creation, invite join, season and event scheduling, open round and score submission, close round and standings. Organizers create leagues via `createLeague` in `src/lib/leagues.functions.ts` (auto slug and invite token). Members join through `/join/$token`. Events attach to real courses via Google Places (ADR 0002).

**Decision:** Vertical slices per phase instead of horizontal "all screens, no writes" builds.

**Why:** MVP success is defined as one organizer and two members completing the full loop on a phone. Partial slices would not prove the core problem is solved.

### Step 4: Handle missing scores at close time

**What we did:** Documented and built the blocking confirmation flow in `CONTEXT.md` (Round Close, Incomplete Scores Flow). The missing scores modal surfaces players without entries before close. Organizers can enter on behalf, or override and close anyway. Option 2 (in-app nudge) is reserved for V2 when messaging exists.

**Decision:** Make override an explicit choice, not a silent default.

**Why:** Real leagues have members who forget to submit. Accidental closes would poison standings and recreate the spreadsheet dispute cycle the product is meant to end.

### Step 5: Persist standings as the official record

**What we did:** Standings recalculate when the organizer closes a round. Season standings appear in league sections (`src/components/league/sections/standings-section.tsx`). Past seasons archive with standings still viewable per domain rules.

**Decision:** Standings update on round close in V1, not on every keystroke during play.

**Why:** ADR 0001 deliberately leaves an insertion point for V2 live standings without rewriting the state model. Shipping live recalculation early would add complexity before the close-round loop was trustworthy.

### Step 6: Wrap the experience in a map-first mobile shell

**What we did:** Adopted ADR 0005: `MapCanvasProvider` mounts one Google Map for the authenticated app. Routes like `/dashboard` dispatch overlays (`EventOverlay`, `LeagueOverlay`) via search params. Score entry uses `EventScorecardOverlay` as a bottom rail during active or closed rounds. Landing copy at `src/routes/index.tsx` promises: "Run your casual golf league without spreadsheets."

**Decision:** Map as persistent context, floating panels for workflow, not separate full-page tables for every task.

**Why:** Members think about where they play and who is in the group. Showing leagues and courses on a map makes the league feel like a real season, not a hidden spreadsheet tab. The map supports the loop; it does not replace it.

### Step 7: Protect trust with auth, RLS, and audit logs

**What we did:** Every protected server function uses `requireSupabaseAuth`. Row-level security in `supabase/migrations/*.sql` scopes reads and writes to league members. Organizer score edits write to `score_edit_logs`. The public trust page at `src/routes/trust.tsx` explains server-side membership checks and organizer-only actions.

**Decision:** Database policies are authoritative; UI gates mirror them but do not replace them.

**Why:** Standings disputes are social events. An audit trail and server-enforced roles turn "he said, she said" into a reviewable record, which is what "official" means to a casual league.

## What we built


| Capability                  | Primary files / docs                                                      | Behavior                                                                    |
| --------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Product definition and loop | `docs/golf-league/product/VISION.md`                                      | Scoring and standings platform; one primary action loop                     |
| Domain rules                | `docs/golf-league/domain/CONTEXT.md`                                      | Glossary, score entry rules, incomplete close flow                          |
| Round lifecycle             | ADR 0001, `src/lib/scores.functions.ts`, `src/lib/standings.functions.ts` | Scheduled, Active, Closed, Cancelled; open and close with standings trigger |
| League and invite           | `src/lib/leagues.functions.ts`, `src/routes/join.$token.tsx`              | Create league, share invite link, join as member                            |
| Seasons and events          | `src/lib/seasons.functions.ts`, `src/lib/events.functions.ts`             | Schedule play on real courses within a season                               |
| Score entry                 | `src/lib/scores.functions.ts`, scorecard overlays                         | Hole-by-hole self-report during active rounds; organizer override with logs |
| Standings                   | `src/lib/standings.functions.ts`, standings section                       | Season leaderboard after round close                                        |
| Map shell                   | ADR 0005, `src/components/canvas/map-canvas-provider.tsx`                 | Single map, floating panels, scorecard rail                                 |
| Entitlements                | `src/lib/entitlements/registry.ts`, Stripe webhook                        | Organizer tiers and season slots; caps enforced in DB triggers              |
| Public positioning          | `src/routes/index.tsx`, `public/llms.txt`                                 | "Without spreadsheets" promise for casual leagues                           |


**Honest gaps (documented, not hidden):** No email or in-app nudge at close in V1. No GHIN or WHS handicap sync. Standings do not live-update on every score during an active round yet. One organizer per league in V1; ownership is not transferable. GPS gameplay features (trails, yardage) strengthen the on-course experience but are a separate case study; they do not replace the core scoring loop.

## Results

### Before

- Scores scattered across texts, photos of scorecards, and shared spreadsheets.
- Standings updated whenever the organizer found time, often with formula errors or version conflicts.
- Members asked "what am I?" without a stable link to check.
- Disputes relied on memory because there was no audit log.
- Leagues felt informal because the record lived in one person's Google Drive.

### After

- One app hosts league, season, event, round, and standing entities with consistent domain language.
- Organizers open and close rounds through explicit states; members submit hole-by-hole scores on mobile during active play.
- Closing with missing scores forces a documented organizer choice instead of silent data loss.
- Standings persist after close and remain visible for the season (and archived seasons per domain rules).
- Score corrections by organizers are logged for review.

### How we know it worked


| Signal                         | Evidence in codebase                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| Loop defined and scoped        | Primary action loop and MVP success criteria in `VISION.md`                                         |
| Rules enforced beyond UI       | ADR 0001, `tg_scores_require_active_round`, RLS helpers (`is_league_member`, `is_league_organizer`) |
| End-to-end MVP phases          | `docs/golf-league/multiphase-plan/phase-prompts/` phases 01 through 06                              |
| Feature inventory matches loop | `docs/feature-list.md` executive summary and scoring or standings rows                              |
| System map for engineers       | `docs/system_understanding.md` traces dashboard overlay to serverFn to RLS read path                |


We have not claimed to eliminate all organizer work. Chasing members who forget to score still happens in V1 without messaging. Success is a **persistent official record and a faster loop than spreadsheets**, not zero admin.

## What you can learn

1. **Name one loop and reject features that do not serve it.** When the real alternative is a spreadsheet plus group chat, the bar is "faster and more trusted," not "more features than club software."
2. **Make state machines explicit when trust depends on timing.** Round Active vs Closed is not a UI detail. It is the gate for whether a score counts.
3. **Enforce rules where data is written.** Casual users will bypass UI if the API allows it. Match overlays to triggers and RLS.
4. **Separate the buyer's pain from the member's action.** Organizers pay for less weekly labor; members adopt because checking standings is effortless. Both must work on a phone at the course.
5. **Use spatial UI to reinforce identity, not to change the job.** A map canvas helps leagues feel real, but standings and score entry still define success.

## Next step

If you run a casual league today, try one real event on Go Golf Leagues: create a league, share the invite link, schedule an event on a course, open the round, have each member enter their own score from the phone, and close the round. Compare how long standings take versus your last spreadsheet update.

For builders reading the repo, the highest-leverage extensions already scoped are V2 live standings during active rounds (ADR 0001 insertion point), in-app nudges for missing scores, and portable player handicaps (ADR 0003). Each extends the same loop without changing what "official" means.