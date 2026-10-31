# Home: World Series champion banner

**Rev 1 · Oct 30, 2026.** Net-new UI, ungated: it uses only data the bracket already has (the finished World Series and its games). Design reference: `Home - Postseason.html` opens on Season → **Champion**. Code: `holistic/bracket.jsx` → `ChampionBanner`. **Port the layout values verbatim.**

## 1. When it shows
- On Home, in the Postseason section, **once the World Series is decided** (a team reaches 4 wins). That's a condition, not a date, like the other season states.
- It sits **above** the bracket, inside the same section. The bracket below is unchanged; every card is now a Finished card.
- Section note (beside the "Postseason" label) changes to **`Season over`**.
- It stays until the off-season state replaces the Postseason section. That state isn't designed yet; until then, keep the banner.

## 2. Layout
One row, a 3-column grid: `auto · minmax(0,1fr) · auto`, `column-gap 18px`, `align-items center`.
- Box: padding `16px 20px`, margin `0 32px 18px` (lines up with the bracket's 32px side padding), background `highlightSoft #fbf0d2`, border `1px solid highlight #c8941c` at 40% (`#c8941c66`), radius `T.r.sm`.
- **Col 1:** `TeamMark` 56px (real logo, letter-mark fallback).
- **Col 2:** three stacked lines, gap 3px:
  1. Eyebrow `2026 WORLD SERIES CHAMPIONS`: sans 11.5 / 700, letter-spacing 0.08em, uppercase, `highlightText #7a5c0e`. If the viewer follows the club, append ` · you follow`. Nothing else changes for followed clubs.
  2. Full club name `Houston Astros`: sans 26 / 800, letter-spacing −0.01em, line-height 1.15, `text`.
  3. Summary, sans 13 `textMuted`: `Beat the Phillies 4–2 · Won Game 6 at Philadelphia, Thu 10/29 · MVP Jeremy Peña`. The series record is mono, 600, `text`. Opponent = nickname. Date = the clinching game's date in the viewer's timezone, no zone label. **Leave out the MVP part until MLB names one**, and never show a placeholder.
- **Col 3:** right-aligned, two stacked items, gap 8px:
  - Clinching score: `Game N` label (sans 11 / 600 muted), then `[logo] HOU 4 – 2 PHI [logo]`. 18px logos, abbreviations sans 13.5, runs mono 15. The winner is 700 `text`, the loser 500 `textMuted`. This is the standard game-score format (with a dash).
  - Button `World Series games →`: sans 12.5 / 600, `surface` background, `1px borderStrong` border, radius `T.r.sm`, padding `6px 11px`. On hover, the text and border turn rust. It opens the existing **Series drawer** for the World Series (same as clicking the WS bracket card).

## 3. Colour rule
Gold is the app's achievement/streak colour. **No rust on the banner** except the button's hover; rust means live.

## 4. Data
`champ = { abbr, name, opp, w, l, clinchGame: { n, date, at }, score: { a, as, b, bs }, mvp | null, seriesId }`, all derived from the finished World Series. No new endpoint.

## 5. Narrow screens
The grid should wrap rather than squeeze. Below ~640px, put col 3 on its own row under col 2, left-aligned. The banner stays outside the bracket's sideways scroller, so it never scrolls away.

## 6. Not in scope
- Adding winner text to bracket cards. Discussed Oct 30 and rejected: Finished cards already show the winner first, on green, with a bold win count.
- Off-season Home state.

## Acceptance
- [ ] The banner appears only after the World Series is decided, never during it.
- [ ] It sits above the bracket, and the bracket is unchanged.
- [ ] Gold surface and eyebrow, no rust at rest.
- [ ] The score reads `HOU 4 – 2 PHI` with logos at each end.
- [ ] The MVP line is absent when no MVP is announced.
- [ ] The button opens the World Series drawer with all games.
- [ ] Section note reads `Season over`.

Mock-only, do not port: the Season segmented control and the `BRACKET.final` / `SERIES['PHI-HOU']` mock data.
