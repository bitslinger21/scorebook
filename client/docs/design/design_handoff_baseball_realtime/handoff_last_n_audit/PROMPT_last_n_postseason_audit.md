# Audit: do "last N games" include the postseason?

**rev 1 · Oct 25, 2026** · **Read-only audit first, then fix.** No design change.

## Why

We are deep into the postseason. Every "last N games" window must mean the player's or team's **N most recent games
played**, regular season and postseason together, in date order. A common bug is that the query filters on
`gameType=R` (MLB Stats API default for many endpoints, e.g. `stats?stats=lastXGames`, `gameLog`, standings `L10`),
so the window stops at the last regular-season game and goes stale in October.

## Surfaces to check (from the design source)

| # | Surface | Window | Design file |
|---|---|---|---|
| 1 | Player · Overview · **Recent form** card ("Last 15 games", `Last 15 · AVG`, FormGuide bars) | 15 games | `holistic/player.jsx` |
| 2 | Player · Overview · **"Now" pills**: `AVG last 7 games`, `Hitting streak` | 7 games / streak | `player.jsx` |
| 3 | Player · Overview · **Last 5 games** strip | 5 games | `player.jsx` |
| 4 | Player · History · **Game log** ("Last 10 games · 2026 season") | 10 games | `player.jsx` |
| 5 | Player · Stats · range filter `Last 30d` / `Last 7d` | date windows | `player.jsx` |
| 6 | Game view · pregame **Leading off · Last 7 games** (new, `handoff_pregame_first_matchup/`) | 7 games | `game-v2.jsx` |
| 7 | Game view · pregame band drawer · **probables' form** (`L10`, `Streak`) | 10 games | `game-v2.jsx` |
| 8 | Standings · **L10** + **STRK** columns | 10 games | `standings.jsx` |
| 9 | Game view · **Baseball IQ** facts ("retired 9 of the last 10…") | varies | `game-v2.jsx` |
| 10 | Upcoming tab · any recent-form inputs to the "read" / edge meter | varies | `player-upcoming.jsx` |
| 11 | Anything else in the app with `last`, `L10`, `lastXGames`, `gameLog`, `numberOfGames`, `streak` | — | grep the client + api |

## For each, report

1. Endpoint + params actually sent (look for `gameType`, `season`, `stats=lastXGames`, `numberOfGames`, date ranges).
2. **Does it include postseason games (`gameType` F/D/L/W)?** Check this against a real player who has played this
   October: today's window should contain his most recent postseason game.
3. Is the window ordered by date across both game types (not regular season then postseason appended)?
4. Is the aggregate (AVG, record, streak) computed over the same rows the list shows?

## Rules for the fix

- **Last N games** = the N most recent games, any game type. **Exclude** spring training (`S`), exhibition (`E`) and
  All-Star (`A`).
- **Date windows** (`Last 7d` / `Last 30d`) include postseason dates the same way.
- **Streaks** carry across from the regular season into the postseason (a hitting streak doesn't reset in October).
- **Season totals stay regular season.** Slash lines labelled `2026 season`, the standings W/L and PCT, and season
  ERA/WHIP stay regular season (Oct 1 exception: the Following W/L line shows postseason record in October).
- **Standings L10 / STRK are the exception:** standings are a regular-season table, so they stay frozen at the end of
  the regular season. Confirm they are, and don't change them.
- No new labelling needed. Rows already carry a date and opponent. ⚠️ If any list row would be ambiguous, flag it in
  the report and don't add a marker unasked.

## Deliverable

A table of surface → current behaviour → pass/fail → fix (file + line), then the fixes. Verify using a player in the
current postseason: his Last 5 / Last 15 / Game log should open with his latest postseason game.
