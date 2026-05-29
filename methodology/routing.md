# Routing Algorithm

This document describes how the Six Walls Diagnostic routes respondents to a recommendation. The algorithm uses composite wall score, counter score, friction, growth, nearest wall, and walls-hit count.

Routes are evaluated in order. The first matching route wins.

## Route Evaluation Order

### 0. NOT-STARTED (pre-check)

```
currentSetup == "no_ai" OR friction == "not_started"
```

The respondent hasn't operationalized AI for business yet. Their "no system" answers (no decision record, nothing captured, tracking in their head) score as maximum wall friction — but absence of a system is not the same as hitting a structural wall. Route on readiness: `APPROACHING_WALLS` if growth is high, otherwise `STAY_PUT`. This runs before wall logic so a non-adopter is never told to buy a platform.

### 1. STAY_PUT

```
compositeWallScore <= 4 AND wallsHit <= 1 AND frictionScore <= 4 AND growthScore < 6
```

The user's current setup is working. Low composite pain, at most one mild wall, low friction, and no growth trajectory pushing toward the walls. A single mild wall or once-a-month friction does not disqualify staying put. The honest answer is: stay where you are.

### 2. DIY Tool Routes

```
wallsHit <= 2 AND counterScore >= 6
```

Few walls are hit and the user has high resistance to integrated solutions (portability, speed, or cost concerns). Route to the destination that addresses their nearest wall. Routes are named by the wall they serve, not by the tool — the recommended tool per wall is defined in the routing content and is expected to change as the tooling landscape shifts.

| Nearest Wall | Route | Destination (tool as of 2026-05) |
|-------------|-------|------|
| Identity | `DIY_IDENTITY` | Open Brain |
| Decision Memory | `DIY_DECISION_MEMORY` | Obsidian + Claude |
| Attention | `DIY_ATTENTION` | NotebookLM |
| Write-Back | `DIY_WRITE_BACK` | basic-memory |
| Governance | `DIY_GOVERNANCE` | No DIY tool — honest "watch this wall" message + soft pointer to how FridayOS approaches it |
| Economics | `DIY_ECONOMICS` | OpenRouter |

All six walls now map to a destination. Governance is intentionally routed to an honest message rather than a tool, because no DIY governance tool currently meets the bar for a public recommendation — controlling and auditing AI access is a platform-class problem. The message points to how FridayOS approaches governance as the category answer (a soft pointer, not a hard sell — this route only fires for respondents who have signaled a hard constraint against integrated solutions, so they are never pushed toward the platform against a stated constraint). Tools were vetted for active maintenance and real community adoption (2026-05).

### 3. NOT_READY_YET

```
compositeWallScore >= 5 AND counterScore >= 7
```

The user is hitting real walls, but counter-dimension resistance is too high for an integrated solution right now. They need the walls to get more painful — or their resistance to change needs to decrease — before an integrated platform makes sense.

### 4. FRIDAYOS_FIT

```
counterScore < 6 AND (wallsHit >= 3 OR compositeWallScore >= 6)
```

Multiple structural walls are hit (or composite pain is high) AND there is no hard counter-dimension blocker. The `counterScore < 6` guard is load-bearing: a respondent with a hard portability, cost, or speed constraint is routed away (to `NOT_READY_YET` or a transition route) even when they're hitting several walls — hitting walls never overrides a stated constraint. This is the pattern an AI operating system addresses.

### 5. APPROACHING_WALLS

```
compositeWallScore >= 4 AND growthScore >= 6
```

Moderate composite pain with high growth trajectory. The walls aren't fully structural yet, but growth will make them so. Watch list provided.

### 6. DIY_WITH_AWARENESS (Default)

If no other route matches, the user has moderate walls with no dominant pattern. A DIY approach is viable, but they should be aware of the walls forming.

## Design Principles

1. **Honest routing over conversion.** The algorithm routes away from the commercial product (FridayOS) when the user's situation doesn't warrant it. Roughly 25% of takers are routed to other tools.

2. **Equal visual treatment.** Every route receives the same quality of presentation — routing-away destinations are not consolation prizes.

3. **Counter-dimensions as a check.** High counter scores (portability, speed, cost concerns) pull users toward DIY or stay-put routes even when walls are present. This prevents recommending integrated solutions to users who would resist or abandon them.

4. **Growth trajectory matters.** A user with moderate walls but high growth trajectory gets flagged as approaching walls — because growth will intensify the structural problems.

5. **Solo operator adjustments.** Team-size modifiers (applied during scoring, not routing) ensure solo operators aren't penalized for walls that don't apply to single-person operations.

6. **Absence is not a wall.** A respondent who hasn't started with AI answers "no system" to the wall questions, which would otherwise read as maximum friction. The not-started pre-check separates "hasn't adopted yet" from "hitting structural limits," so non-adopters are never routed to a platform purchase.

7. **Constraints outrank wall count.** A hard portability, cost, or speed constraint (high counter score) routes a respondent away from the integrated product even when multiple walls are present — the honest-routing commitment is enforced at the routing layer, not just in copy.
