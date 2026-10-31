# Home: World Series champion banner

**Rev 3 · Oct 31, 2026** (rev 1 Oct 30 · rev 2 Oct 31). **Rev 3 adds the MVP photo panel (§2b, §2c), cuts the summary to the series result, removes the clinching score and the "World Series games" button, and makes the bracket cards read as clickable (§2d).** Rev 2's club stripe stays. If you already ported rev 1 or 2, §7 lists the deltas.

Net-new UI, ungated: the bracket data already has the finished World Series. The MVP photo uses MLB's existing image service, the same one as our headshots. Design reference: `Home - Postseason.html` opens on Season → **Champion**. Rejected directions: `WS Champion Banner - Options.html` (club colour 2–3, MVP photo A). That file's option B still shows the old summary, score and button; **`bracket.jsx` is the spec**. Code: `holistic/bracket.jsx` → `ChampionBanner` + `ChampMvpPanel`. **Port the layout values verbatim.**

## 1. When it shows
- On Home, in the Postseason section, **once the World Series is decided** (a team reaches 4 wins). That's a condition, not a date, like the other season states.
- It sits **above** the bracket, inside the same section. The bracket below is unchanged; every card is now a Finished card.
- Section note (beside the "Postseason" label) changes to **`Season over`**.
- It stays until the off-season state replaces the Postseason section. That state isn't designed yet; until then, keep the banner.

## 2. Layout
Box: 2-column grid `minmax(0,1fr) minmax(240px,34%)`, `min-height 156px`, margin `0 32px 18px` (lines up with the bracket's 32px side padding), background `highlightSoft #fbf0d2`, border `1px solid #c8941c66` (gold at 40%), radius `T.r.sm`, `position: relative`, `overflow: hidden`.

**Left column (text):** padding `28px 20px 16px`. Inner grid `auto · minmax(0,1fr)`, column-gap 18, `align-items center`.
- `TeamMark` 56px (real logo, letter-mark fallback).
- **Title block**, three lines with gap 3px:
  - Eyebrow `2026 WORLD SERIES CHAMPIONS`: sans 11.5 / 700, letter-spacing 0.08em, uppercase, `highlightText #7a5c0e`. If the viewer follows the club, append ` · you follow`.
  - Full club name: sans 26 / 800, letter-spacing −0.01em, line-height 1.15, `text`.
  - Summary, sans 13 `textMuted`: **`Beat the Phillies 4 games to 2`**. Both numbers are mono 600 `text`; the opponent is the nickname. That's the whole line. **No clinching game, date, venue or MVP** (rev 3): the banner answers who won and the series split. The MVP lives in the photo panel.
- **No clinching score and no button** (rev 3). The banner itself isn't clickable; the World Series card in the bracket right below opens the same drawer (§2d).

## 2a. Club stripe (rev 2)
Two full-width bars across the top of the box, absolutely positioned and **`z-index 2`** so they sit over the photo:
- `top 0`, height **8px**, the champion's **primary**.
- `top 8px`, height **4px**, the champion's **secondary**.

These come from the per-team `primary` / `secondary` colours the app already keeps. Only the stripe uses club colours, so no per-club contrast check is needed.

## 2b. MVP photo panel (rev 3)
The right column. `position: relative`, `min-height 156`, `overflow hidden`, and no background of its own (the banner's cream shows through). It has three states, tried in order. **Stage is per-image fallback**: if the first image fails to load, move to the next.

**Stage 0: action photo.** `https://img.mlbstatic.com/mlb-photos/image/upload/w_760,q_auto:good/v1/people/{mlbId}/action/hero/current`
- Fills the panel: `inset 0`, `object-fit cover`, `object-position center 25%`.
- **Left-edge dissolve: a CSS mask on the image, not an overlay**, so it fades into whatever is behind it:
  `mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.08) 8%, rgba(0,0,0,.25) 18%, rgba(0,0,0,.5) 30%, rgba(0,0,0,.78) 42%, #000 56%)` (+ `-webkit-mask-image`). The eased stops are intentional; a two-stop linear fade shows a visible edge.
- Name scrim: a **separate** absolutely-positioned layer at the bottom, height 64, `linear-gradient(to top, rgba(21,22,26,.82), rgba(21,22,26,0))`, with **the same mask** so it dissolves leftward with the photo (a full-width scrim leaves a hard dark edge on the bottom half). Keep the text OUT of this layer, so the mask never fades the text.
- Caption, right-aligned at the bottom, padding `22px 14px 10px`, gap 1:
  - `SERIES MVP`: sans 11 / 700, 0.08em, uppercase, `#f0d690` (light gold on the dark scrim).
  - `Jeremy Peña · SS`: the name is sans 16 / 700 `#fff`; `· SS` is 13 / 500 `#e4e4e7`.

**Stage 1: headshot** (the player has no action photo). `…/w_240,q_auto:best/v1/people/{mlbId}/headshot/67/current`
- Natural portrait, **not** stretched: `right 30`, `bottom 40`, `height calc(100% - 52px)`, `width auto`.
- Fades on the left, right and bottom using two masks intersected:
  `linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.6) 14%, #000 30%, #000 70%, rgba(0,0,0,.6) 86%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,0) 0%, #000 28%)` with `mask-composite: intersect` (`-webkit-mask-composite: source-in`).
- **No scrim.** The caption sits *below* the headshot in the 40px it leaves free, padding `0 14px 12px`: `SERIES MVP` in `highlightText`, the name in `text`, and `· SS` in `textMuted`.

**Stage 2: club logo** (no MVP named yet, or both images failed).
- Club logo 72px wide at 85% opacity, centred in the panel with `padding-bottom 34` so it sits above the caption.
- Caption `Series MVP not yet named`: sans 13 / 600 `textMuted`, centred at the bottom.
- The panel is there from the final out, so **the banner doesn't change size** when the MVP is announced. Only the panel's contents swap.

## 2c. Data for the panel
The caption styling depends on the stage: light text on the scrim only at stage 0. Derive it from the image's load state. **Don't render the white caption until the action image has either loaded or failed**, otherwise a slow load briefly shows white text on cream. (The mock flips after the fact; the app should wait for `onLoad`/`onError`.)

## 2d. Bracket cards read as clickable (rev 3)
Applies in **every** season state, not just after the World Series. Only the cards that already open the Series drawer get these cues: **Finished** (`BracketDone`) and **In progress** (`BracketCurrent`). The "not set yet" cards (`BracketNext`) don't open, so they get none of them.
- **Hover and keyboard focus:** border `border → textMuted`, plus `box-shadow 0 1px 3px rgba(21,22,26,.12)`, on top of the existing `surface → surfaceAlt` background. Focus shows the same treatment as hover.
- **Keyboard:** `role="button"`, `tabIndex 0`, Enter/Space opens. Finished cards: `aria-label "{done} — see games"`, tooltip `"{done} · see games"`. In-progress cards: tooltip `"See games"`.
- **Standing hint** under the bracket's sideways scroller, **outside** it so it never scrolls away: padding `0 32px` (lines up with the bracket), flex, gap 6. A 12px icon (rounded rect + chevron, 1.3 stroke, `currentColor`; SVG in `bracket.jsx`) and the text **`Select any series to see its games`**: sans 12 `textMuted`. It's always visible because touch has no hover.

## 3. Colour rule
Gold is the app's achievement colour (surface, eyebrow, the `SERIES MVP` label). Club colours appear **only in the stripe**. **No rust on the banner**, because rust means live.

## 4. Data
`champ = { abbr, name, opp, w, l, mvp: { name, mlbId, pos } | null }`. (Rev 3 dropped `clinchGame`, `score` and `seriesId`; the banner no longer needs them.) Everything comes from the finished World Series. The MVP is null until MLB names one, and the banner picks it up when it arrives (re-poll or the next Home load). No new endpoint for the photos: they are built from `mlbId`.

## 5. Narrow screens
- **Below ~640px:** one column. The photo panel moves **above** the text as a full-width band, 140px tall, under the stripe. Its mask changes direction so it dissolves **downward** into the text: `to bottom`, solid for the first 44%, then the same eased stops reversed. The caption stays at the panel's bottom right. *(Not mocked; flag anything that looks off.)*
- The banner stays outside the bracket's sideways scroller.

## 6. Not in scope
- Winner text on bracket cards (rejected Oct 30).
- The off-season Home state.
- Photo credit or caption. MLB's image service serves these as player assets, like headshots; if legal wants a credit, it goes in the panel's top-right at 10px.

## 7. Deltas from rev 2 (if already ported)
1. The grid changes from 3 columns (`auto · 1fr · auto`) to 2 (`1fr · minmax(240px,34%)`). The logo and text move into an inner grid in the left column.
2. The box padding moves from the box to the left column (`28px 20px 16px`). The box gets `min-height 156`.
3. **Delete** the clinching-score row and the `World Series games →` button. The banner takes no `onOpen`.
4. The summary becomes `Beat the {nickname} {w} games to {l}`, with nothing after it.
5. Add `ChampMvpPanel` (§2b) and give the stripe bars `z-index 2`.
6. Add the bracket-card cues and the standing hint (§2d).

## Acceptance
- [ ] The banner appears only after the World Series is decided.
- [ ] It sits above the bracket, and the bracket is unchanged.
- [ ] An 8px primary over 4px secondary stripe runs across the top, over the photo, inside the rounded corners.
- [ ] The action photo dissolves into the cream along its whole left edge, **top and bottom halves alike**, with no hard line from the scrim.
- [ ] The MVP caption is readable on the scrim; `SERIES MVP` is light gold.
- [ ] A player with no action photo shows the headshot at portrait size, faded on 3 sides, with the dark caption **below** it, not over it.
- [ ] Before the MVP is named: the club logo + "Series MVP not yet named", and the banner is the same height as after.
- [ ] No white caption flashes on cream while the photo loads.
- [ ] The summary reads exactly `Beat the Phillies 4 games to 2`: no game, date or MVP.
- [ ] No clinching score and no button on the banner.
- [ ] Finished and in-progress bracket cards darken their border and gain a shadow on hover **and** on keyboard focus, and Enter/Space opens the drawer. "Not set yet" cards show none of this.
- [ ] `Select any series to see its games` sits under the bracket, outside the scroller, in every season state.
- [ ] The section note reads `Season over`.

Mock-only, do not port: the Season segmented control, the `BRACKET.final` / `SERIES['PHI-HOU']` mock data, and `mvpForceNoAction` (a review hook that forces stage 1).
