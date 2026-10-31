/* global React, T, TEAMS, TeamDot */
// ============================================================
// POSTSEASON BRACKET: Home's Races section once the field is set (Sep 28, 2026, first pass)
// Seven columns, mirrored: AL WC · ALDS · ALCS · World Series · NLCS · NLDS · NL WC.
// Fits the full 1184px Races band; below ~1040 it scrolls sideways rather than squeezing.
//
// PER MATCHUP (the metadata):
//   two team rows: seed · logo · abbr · series wins (mono; leader ink, trailer muted;
//     blank until game 1; eliminated club dims). A club not yet known = "BOS / TOR" slot.
//   a two-line status block, fixed height so every card is the same size:
//     line 1 = the NEXT game: "Gm 4 7:08 · @ BOS" (today is implied), or LIVE + inning + score,
//              or the result once it's over: "HOU won 2–0"
//     line 2 = what's riding on it ("NYY can clinch", "Winner take all"), else the
//              probable starters ("Crochet vs Gausman"), else what it is waiting on.
//   Home field = "@ TEAM" on line 1 (the higher seed hosts, but Gm 3–4 of a DS flip).
//   Connectors turn from hairline to ink once the series feeding them is decided.
//   Followed clubs get a 2px ink leading edge on their row (rust is reserved for live).
// ============================================================

// Copy budget (Sep 28 fit pass): at the 1184 band a column is ~157px, ~141px of text —
// line 1 (mono 11) ≈ 20 chars, line 2 (sans 11.5) ≈ 23. Write status copy to that budget;
// the ellipsis is a safety net, not the plan.
const BK = { H: 92, G: 26, row: 28, pad: 8, doneW: 58, nextW: 84, curW: 186, minGap: 44, head: 44 };

// state 'set' = Mon Sep 28, the field just set, nothing played.  'ds' = Wed Oct 7, mid-DS.
const TBD = (s) => ({ tbd: s });
window.BRACKET = {
  set: {
    alwc: [
      { hi: { abbr: 'BOS', seed: 4 }, lo: { abbr: 'TOR', seed: 5 }, g: 1, at: 'BOS', when: 'Tue 09/29 4:08' },
      { hi: { abbr: 'SEA', seed: 3 }, lo: { abbr: 'HOU', seed: 6 }, g: 1, at: 'SEA', when: 'Tue 09/29 8:08' }],
    alds: [
      { hi: { abbr: 'NYY', seed: 1 }, lo: TBD('BOS/TOR'), l1: 'Sat 10/03', at0: 'NYY', l2: 'Bye · waiting on WC' },
      { hi: { abbr: 'CLE', seed: 2 }, lo: TBD('SEA/HOU'), l1: 'Sat 10/03', at0: 'CLE', l2: 'Bye · waiting on WC' }],
    alcs: { hi: TBD('TBD'), lo: TBD('TBD'), l1: 'Mon 10/12', l2: 'Waiting on ALDS' },
    ws: { hi: TBD('AL champ'), lo: TBD('NL champ'), l1: 'Fri 10/23', l2: 'Waiting on LCS' },
    nlcs: { hi: TBD('TBD'), lo: TBD('TBD'), l1: 'Tue 10/13', l2: 'Waiting on NLDS' },
    nlds: [
      { hi: { abbr: 'LAD', seed: 1 }, lo: TBD('SDP/NYM'), l1: 'Sat 10/03', at0: 'LAD', l2: 'Bye · waiting on WC' },
      { hi: { abbr: 'MIL', seed: 2 }, lo: TBD('PHI/ARI'), l1: 'Sat 10/03', at0: 'MIL', l2: 'Bye · waiting on WC' }],
    nlwc: [
      { hi: { abbr: 'SDP', seed: 4 }, lo: { abbr: 'NYM', seed: 5 }, g: 1, at: 'SDP', when: 'Tue 09/29 3:08' },
      { hi: { abbr: 'PHI', seed: 3 }, lo: { abbr: 'ARI', seed: 6 }, g: 1, at: 'PHI', when: 'Tue 09/29 7:08' }],
  },
  ds: {
    alwc: [
      { hi: { abbr: 'BOS', seed: 4, w: 2 }, lo: { abbr: 'TOR', seed: 5, w: 0, out: true }, done: 'BOS won 2–0', l2: 'Swept Toronto' },
      { hi: { abbr: 'SEA', seed: 3, w: 1, out: true }, lo: { abbr: 'HOU', seed: 6, w: 2 }, done: 'HOU won 2–1', l2: 'Won Gm 3 at SEA' }],
    alds: [
      { hi: { abbr: 'NYY', seed: 1, w: 2 }, lo: { abbr: 'BOS', seed: 4, w: 1 }, g: 4, at: 'BOS', when: 'Wed 10/07 7:08' },
      { hi: { abbr: 'CLE', seed: 2, w: 0 }, lo: { abbr: 'HOU', seed: 6, w: 2 }, g: 3, at: 'HOU', live: { inn: '▼6', a: 'HOU', as: 3, b: 'CLE', bs: 1 } }],
    alcs: { hi: TBD('NYY/BOS'), lo: TBD('CLE/HOU'), l1: 'Mon 10/12', l2: 'Waiting on ALDS' },
    ws: { hi: TBD('AL champ'), lo: TBD('NL champ'), l1: 'Fri 10/23', l2: 'Waiting on LCS' },
    nlcs: { hi: { abbr: 'PHI', seed: 3 }, lo: TBD('LAD/NYM'), l1: 'Tue 10/13', l2: 'Hosts if NYM wins' },
    nlds: [
      { hi: { abbr: 'LAD', seed: 1, w: 1 }, lo: { abbr: 'NYM', seed: 5, w: 1 }, g: 3, at: 'NYM', when: 'Wed 10/07 8:08' },
      { hi: { abbr: 'MIL', seed: 2, w: 1, out: true }, lo: { abbr: 'PHI', seed: 3, w: 3 }, done: 'PHI won 3–1', l2: 'Clinched at MIL' }],
    nlwc: [
      { hi: { abbr: 'SDP', seed: 4, w: 1, out: true }, lo: { abbr: 'NYM', seed: 5, w: 2 }, done: 'NYM won 2–1', l2: 'Won Gm 3 at SDP' },
      { hi: { abbr: 'PHI', seed: 3, w: 2 }, lo: { abbr: 'ARI', seed: 6, w: 0, out: true }, done: 'PHI won 2–0', l2: 'Swept Arizona' }],
  },
  // 'final' = Fri 10/30, the morning after the World Series ended. Every card is a Finished card.
  final: {
    champ: { abbr: 'HOU', name: 'Houston Astros', opp: 'PHI', w: 4, l: 2, clinch: 'Won Game 6 at Philadelphia, Thu 10/29', g: 6, score: { a: 'HOU', as: 4, b: 'PHI', bs: 2 }, mvp: 'Jeremy Peña', mvpId: 665161, mvpPos: 'SS', series: 'PHI-HOU' },
    alwc: [
      { hi: { abbr: 'BOS', seed: 4, w: 2 }, lo: { abbr: 'TOR', seed: 5, w: 0, out: true }, done: 'BOS won 2–0' },
      { hi: { abbr: 'SEA', seed: 3, w: 1, out: true }, lo: { abbr: 'HOU', seed: 6, w: 2 }, done: 'HOU won 2–1' }],
    alds: [
      { hi: { abbr: 'NYY', seed: 1, w: 3 }, lo: { abbr: 'BOS', seed: 4, w: 1, out: true }, done: 'NYY won 3–1' },
      { hi: { abbr: 'CLE', seed: 2, w: 0, out: true }, lo: { abbr: 'HOU', seed: 6, w: 3 }, done: 'HOU won 3–0' }],
    alcs: { hi: { abbr: 'NYY', seed: 1, w: 2, out: true }, lo: { abbr: 'HOU', seed: 6, w: 4 }, done: 'HOU won 4–2' },
    ws: { hi: { abbr: 'PHI', seed: 3, w: 2, out: true }, lo: { abbr: 'HOU', seed: 6, w: 4 }, done: 'HOU won 4–2' },
    nlcs: { hi: { abbr: 'PHI', seed: 3, w: 4 }, lo: { abbr: 'NYM', seed: 5, w: 3, out: true }, done: 'PHI won 4–3' },
    nlds: [
      { hi: { abbr: 'LAD', seed: 1, w: 2, out: true }, lo: { abbr: 'NYM', seed: 5, w: 3 }, done: 'NYM won 3–2' },
      { hi: { abbr: 'MIL', seed: 2, w: 1, out: true }, lo: { abbr: 'PHI', seed: 3, w: 3 }, done: 'PHI won 3–1' }],
    nlwc: [
      { hi: { abbr: 'SDP', seed: 4, w: 1, out: true }, lo: { abbr: 'NYM', seed: 5, w: 2 }, done: 'NYM won 2–1' },
      { hi: { abbr: 'PHI', seed: 3, w: 2 }, lo: { abbr: 'ARI', seed: 6, w: 0, out: true }, done: 'PHI won 2–0' }],
  },
};

// CHAMPION BANNER (Oct 30, 2026). Once the World Series ends, the banner ABOVE the bracket names the
// champion. Above, not below: it is the answer the bracket was asking, and below it would sit
// under a sideways scroller on narrow screens. Gold = the app's "streak/achievement" colour;
// rust stays reserved for live. The bracket underneath is unchanged — every card is Finished.
// Oct 31: club stripe on top (8px primary + 4px secondary) says whose title it is; text colours unchanged.
// Oct 31 (rev 3): MVP photo feature — the right ~third is the MVP's action photo, dissolving left into the
// cream. Image chain: action shot → headshot (portrait, faded on 3 sides, caption below) → club logo +
// "Series MVP not yet named". The MVP leaves the summary line. Review: `WS Champion Banner - Options.html` (B).
const CHAMP_PHOTO_MASK = 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.78) 42%, #000 56%)';
const CHAMP_HEAD_MASK = 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 14%, #000 30%, #000 70%, rgba(0,0,0,0.6) 86%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,0) 0%, #000 28%)';
function ChampMvpPanel({ c, team }) {
  // stage 0 = action shot, 1 = headshot, 2 = club logo (no MVP yet, or both images failed)
  const [stage, setStage] = React.useState(c.mvpId ? (c.mvpForceNoAction ? 1 : 0) : 2);
  const fail = () => setStage(s => s + 1);
  const base = 'https://img.mlbstatic.com/mlb-photos/image/upload';
  const onPhoto = c.mvp && stage === 0;
  return (
    <div style={{ position: 'relative', minHeight: 156, overflow: 'hidden' }}>
      {stage === 0 && <img src={`${base}/w_760,q_auto:good/v1/people/${c.mvpId}/action/hero/current`} alt={c.mvp} onError={fail} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', display: 'block', WebkitMaskImage: CHAMP_PHOTO_MASK, maskImage: CHAMP_PHOTO_MASK }} />}
      {stage === 1 && <img src={`${base}/w_240,q_auto:best/v1/people/${c.mvpId}/headshot/67/current`} alt={c.mvp} onError={fail} style={{ position: 'absolute', right: 30, bottom: 40, height: 'calc(100% - 52px)', width: 'auto', display: 'block', WebkitMaskImage: CHAMP_HEAD_MASK, maskImage: CHAMP_HEAD_MASK, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }} />}
      {stage >= 2 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', paddingBottom: 34 }}><img src={`https://www.mlbstatic.com/team-logos/${team.id}.svg`} alt="" style={{ width: 72, opacity: 0.85 }} /></div>}
      {onPhoto && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: 'linear-gradient(to top, rgba(21,22,26,0.82), rgba(21,22,26,0))', WebkitMaskImage: CHAMP_PHOTO_MASK, maskImage: CHAMP_PHOTO_MASK, pointerEvents: 'none' }}></div>}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: onPhoto ? '22px 14px 10px' : '0 14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        {c.mvp ? <>
          <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: onPhoto ? '#f0d690' : T.highlightText }}>Series MVP</span>
          <span style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: onPhoto ? '#fff' : T.text }}>{c.mvp} <span style={{ fontWeight: 500, color: onPhoto ? '#e4e4e7' : T.textMuted, fontSize: 13 }}>· {c.mvpPos}</span></span>
        </> : <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.textMuted, alignSelf: 'center' }}>Series MVP not yet named</span>}
      </div>
    </div>
  );
}
function ChampionBanner({ c, followed }) {
  const team = TEAMS[c.abbr], opp = TEAMS[c.opp];
  const isF = followed.includes(c.abbr);
  const mono = { fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' };
  const ab = (a, win) => <span style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: win ? 700 : 500, color: win ? T.text : T.textMuted }}>{a}</span>;
  const sc = (n, win) => <span style={{ ...mono, fontSize: 15, fontWeight: win ? 700 : 500, color: win ? T.text : T.textMuted }}>{n}</span>;
  const s = c.score;
  return (
    <div data-screen-label="Champion banner" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(240px,34%)', minHeight: 156, margin: '0 32px 18px', background: T.highlightSoft, border: `1px solid ${T.highlight}66`, borderRadius: T.r.sm, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: team.primary, zIndex: 2 }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 8, height: 4, background: team.secondary, zIndex: 2 }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center', columnGap: 18, padding: '28px 20px 16px' }}>
        <window.TeamMark team={team} size={56} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.highlightText }}>2026 World Series champions{isF ? ' · you follow' : ''}</span>
            <span style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', color: T.text, lineHeight: 1.15, textWrap: 'pretty' }}>{c.name}</span>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted, textWrap: 'pretty' }}>Beat the {opp.name.split(' ').slice(-1)[0]} <span style={{ ...mono, color: T.text, fontWeight: 600 }}>{c.w}</span> games to <span style={{ ...mono, color: T.text, fontWeight: 600 }}>{c.l}</span></span>
          </div>
        </div>
      </div>
      <ChampMvpPanel key={c.mvpId || 'none'} c={c} team={team} />
    </div>
  );
}

function BracketTeam({ t, other, started, followed }) {
  const lead = started && t.w > other.w;
  const isF = followed.includes(t.abbr);
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '14px 18px minmax(0,1fr) auto', columnGap: 7, alignItems: 'center', height: BK.row, padding: `0 ${BK.pad}px` }} title={isF ? `You follow ${TEAMS[t.abbr].name}` : TEAMS[t.abbr].name}>
      {isF && <span style={{ position: 'absolute', left: 0, top: 5, bottom: 5, width: 2, background: T.ink }} />}
      <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.textMuted, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{t.seed}</span>
      <TeamDot team={TEAMS[t.abbr]} size={18} />
      <span style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 700, color: T.text }}>{t.abbr}</span>
      <span style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: lead ? T.text : T.textMuted, fontVariantNumeric: 'tabular-nums', minWidth: 10, textAlign: 'right' }}>{started ? t.w : ''}</span>
    </div>
  );
}

const cardBox = (hov, w) => ({ width: w, margin: '0 auto', boxSizing: 'border-box', background: hov ? T.surfaceAlt : T.surface, border: `1px solid ${hov ? T.textMuted : T.border}`, boxShadow: hov ? '0 1px 3px rgba(21,22,26,0.12)' : 'none', borderRadius: T.r.sm, overflow: 'hidden', cursor: 'pointer', position: 'relative', zIndex: 1 });

// A finished series: logo + wins (right-justified), winner first on a pale-green row.
function BracketDone({ s, followed, onOpen }) {
  const [hov, setHov] = React.useState(false);
  const rows = s.hi.out ? [s.lo, s.hi] : [s.hi, s.lo];
  return (
    <div role="button" tabIndex={0} aria-label={`${s.done} — see games`} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())} onFocus={() => setHov(true)} onBlur={() => setHov(false)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onOpen} title={`${s.done} · see games`} style={cardBox(hov, BK.doneW)}>
      {rows.map((t, i) => {
        const win = !t.out, isF = followed.includes(t.abbr);
        return (
          <div key={t.abbr} title={TEAMS[t.abbr].name} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 24, padding: '0 8px', background: win ? T.positiveSoft : 'transparent', borderTop: i ? `1px solid ${T.border}` : 'none' }}>
            {isF && <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, background: T.ink }} />}
            <TeamDot team={TEAMS[t.abbr]} size={18} />
            <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: win ? 700 : 500, color: win ? T.positive : T.textMuted, fontVariantNumeric: 'tabular-nums' }}>{t.w}</span>
          </div>
        );
      })}
    </div>
  );
}

const isNext = (s) => !s.done && !!(s.hi.tbd || s.lo.tbd);
const widthOf = (s) => (s.done ? BK.doneW : isNext(s) ? BK.nextW : BK.curW);

// A series not yet set: each side = a logo, a logo/logo pair, or a word ("AL champ"); then its date.
function NextSide({ t, followed }) {
  const abbrs = t.abbr ? [t.abbr] : t.tbd.includes('/') ? t.tbd.split('/') : null;
  const isF = abbrs && abbrs.some((a) => followed.includes(a));
  return (
    <div title={abbrs ? abbrs.map((a) => TEAMS[a].name).join(' or ') : t.tbd} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4, height: 24, padding: '0 8px' }}>
      {isF && <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, background: T.ink }} />}
      {abbrs ? abbrs.map((a, i) => (
        <React.Fragment key={a}>
          {i > 0 && <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>/</span>}
          <TeamDot team={TEAMS[a]} size={18} />
        </React.Fragment>
      )) : <span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{t.tbd}</span>}
    </div>
  );
}

function BracketNext({ s, followed }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title={s.l2} style={{ ...cardBox(false, BK.nextW), cursor: 'default' }}>
      <NextSide t={s.hi} followed={followed} />
      <div style={{ borderTop: `1px solid ${T.border}` }}><NextSide t={s.lo} followed={followed} /></div>
      <div style={{ borderTop: `1px solid ${T.border}`, padding: '4px 8px', fontFamily: T.mono, fontSize: 10.5, fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.l1}</div>
    </div>
  );
}

// A series in progress. Line 1 = which game of how many, and where. Line 2 = when, or the live state.
function BracketCurrent({ s, bo, followed, onOpen }) {
  const [hov, setHov] = React.useState(false);
  const started = s.hi.w != null;
  const ln = { fontFamily: T.mono, fontSize: 11, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  return (
    <div role="button" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())} onFocus={() => setHov(true)} onBlur={() => setHov(false)} onClick={onOpen} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title="See games" style={{ ...cardBox(hov, BK.curW), height: BK.H, display: 'flex', flexDirection: 'column' }}>
      <BracketTeam t={s.hi} other={s.lo} started={started} followed={followed} />
      <BracketTeam t={s.lo} other={s.hi} started={started} followed={followed} />
      <div style={{ flex: 1, borderTop: `1px solid ${T.border}`, padding: `0 ${BK.pad}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, minWidth: 0 }}>
        <div style={{ ...ln, fontWeight: 600, color: T.text }}>Game {s.g} of {bo} @ {s.at}</div>
        {s.live
          ? <div style={{ ...ln, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, color: T.text }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: T.sans, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', color: T.accent }}>LIVE</span>
              <span>· {s.live.inn} {s.live.a} {s.live.as} {s.live.b} {s.live.bs}</span>
            </div>
          : <div style={{ ...ln, fontWeight: 500, color: T.textMuted }}>{s.when}</div>}
      </div>
    </div>
  );
}

const lineCol = () => T.borderStrong; // one colour: the cards already say who advanced
const hLine = (key, top, l, r, on) => <span key={key} style={{ position: 'absolute', top: top - 0.75, height: 1.5, left: l, right: r, background: lineCol(on) }} />;
const CH = 2 * BK.H + BK.G;
const ctr = { pair: [BK.H / 2, BK.H + BK.G + BK.H / 2], mid: [CH / 2] };

// One round: header centred over the cards. A card narrower than its round gets stubs
// out to the round's edges so the connectors in the gaps always reach it.
function BracketCol({ c, followed, onOpen }) {
  const w = Math.max(...c.series.map(widthOf));
  const ys = ctr[c.pos];
  return (
    <div style={{ width: w, flexShrink: 0 }}>
      <div style={{ height: BK.head - 10, marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.text }}>{c.label}</span>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>Best of {c.bo}</span>
      </div>
      <div style={{ position: 'relative', height: CH }}>
        {c.series.map((s, i) => {
          const slack = (w - widthOf(s)) / 2;
          return (
            <React.Fragment key={i}>
              {slack > 0 && c.inL != null && hLine('sl' + i, ys[i], 0, w - slack, c.inL[i])}
              {slack > 0 && c.inR != null && hLine('sr' + i, ys[i], w - slack, 0, c.inR[i])}
              <div style={{ position: 'absolute', top: ys[i] - BK.H / 2, left: 0, right: 0, height: BK.H, display: 'flex', alignItems: 'center' }}>
                {s.done ? <BracketDone s={s} followed={followed} onOpen={() => onOpen(s)} /> : isNext(s) ? <BracketNext s={s} followed={followed} /> : <BracketCurrent s={s} bo={c.bo} followed={followed} onOpen={() => onOpen(s)} />}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// The space between two rounds. Every gap flexes equally, so rounds sit equal distances apart.
function BracketGap({ kind, on, mirror }) {
  const L = [];
  const [a, b] = ctr.pair, m = CH / 2;
  if (kind === 'straight2') { L.push(hLine('a', a, 0, 0, on[0]), hLine('b', b, 0, 0, on[1])); }
  if (kind === 'straight1') L.push(hLine('m', m, 0, 0, on[0]));
  if (kind === 'elbow') {
    const near = mirror ? { l: '50%', r: 0 } : { l: 0, r: '50%' };
    const far = mirror ? { l: 0, r: '50%' } : { l: '50%', r: 0 };
    L.push(hLine('a', a, near.l, near.r, on[0]), hLine('b', b, near.l, near.r, on[1]), hLine('m', m, far.l, far.r, on[0] && on[1]));
    [[a, on[0]], [b, on[1]]].forEach(([y, o], i) => L.push(<span key={'v' + i} style={{ position: 'absolute', left: 'calc(50% - 0.75px)', width: 1.5, top: Math.min(y, m) - 0.75, height: Math.abs(m - y) + 1.5, background: lineCol(o) }} />));
  }
  return <div style={{ flex: 1, minWidth: BK.minGap, paddingTop: BK.head }}><div style={{ position: 'relative', height: CH }}>{L}</div></div>;
}

window.PlayoffBracket = function PlayoffBracket({ state = 'ds', followed = ['HOU'] }) {
  const d = window.BRACKET[state];
  const [open, setOpen] = React.useState(null);
  const openSeries = (s) => { const id = `${s.hi.abbr}-${s.lo.abbr}`; if (window.SERIES && window.SERIES[id]) setOpen({ id, hi: s.hi, lo: s.lo }); };
  const dn = (arr) => arr.map((s) => !!s.done);
  const lcsIn = (ds) => [ds.every((s) => s.done)];
  const cols = [
    { label: 'AL Wild Card', bo: 3, series: d.alwc, pos: 'pair', inR: dn(d.alwc) },
    { label: 'ALDS', bo: 5, series: d.alds, pos: 'pair', inL: dn(d.alwc), inR: dn(d.alds) },
    { label: 'ALCS', bo: 7, series: [d.alcs], pos: 'mid', inL: lcsIn(d.alds), inR: dn([d.alcs]) },
    { label: 'World Series', bo: 7, series: [d.ws], pos: 'mid', inL: dn([d.alcs]), inR: dn([d.nlcs]) },
    { label: 'NLCS', bo: 7, series: [d.nlcs], pos: 'mid', inL: dn([d.nlcs]), inR: lcsIn(d.nlds) },
    { label: 'NLDS', bo: 5, series: d.nlds, pos: 'pair', inL: dn(d.nlds), inR: dn(d.nlwc) },
    { label: 'NL Wild Card', bo: 3, series: d.nlwc, pos: 'pair', inL: dn(d.nlwc) },
  ];
  const gaps = [
    { kind: 'straight2', on: dn(d.alwc) },
    { kind: 'elbow', on: dn(d.alds) },
    { kind: 'straight1', on: dn([d.alcs]) },
    { kind: 'straight1', on: dn([d.nlcs]) },
    { kind: 'elbow', on: dn(d.nlds), mirror: true },
    { kind: 'straight2', on: dn(d.nlwc) },
  ];
  return (
    <div>
    {d.champ && <ChampionBanner c={d.champ} followed={followed} />}
    <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 980, padding: '0 32px', boxSizing: 'border-box' }}>
        {cols.map((c, i) => (
          <React.Fragment key={c.label}>
            {i > 0 && <BracketGap {...gaps[i - 1]} />}
            <BracketCol c={c} followed={followed} onOpen={openSeries} />
          </React.Fragment>
        ))}
      </div>
    </div>
    <div style={{ padding: '0 32px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.sans, fontSize: 12, color: T.textMuted }}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="1" y="2.5" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M5 4.5 L7 6 L5 7.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span>Select any series to see its games</span>
    </div>
      {open && window.SeriesDrawer && <window.SeriesDrawer {...open} onClose={() => setOpen(null)} />}
    </div>
  );
};
