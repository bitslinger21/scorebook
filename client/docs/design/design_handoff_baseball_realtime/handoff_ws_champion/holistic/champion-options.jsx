// WS champion banner — three club-colour options (review only, Oct 31, 2026).
const CO_CHAMPS = [
  { abbr: 'HOU', name: 'Houston Astros', opp: 'PHI', w: 4, l: 2, clinch: 'Won Game 6 at Philadelphia, Thu 10/29', g: 6, score: { a: 'HOU', as: 4, b: 'PHI', bs: 2 }, mvp: 'Jeremy Peña', mvpId: 665161, mvpPos: 'SS' },
  { abbr: 'LAD', name: 'Los Angeles Dodgers', opp: 'NYY', w: 4, l: 1, clinch: 'Won Game 5 at New York, Wed 10/28', g: 5, score: { a: 'LAD', as: 7, b: 'NYY', bs: 6 }, mvp: 'Freddie Freeman', mvpId: 518692, mvpPos: '1B' },
  { abbr: 'NYY', name: 'New York Yankees', opp: 'LAD', w: 4, l: 3, clinch: 'Won Game 7 at New York, Sat 10/31', g: 7, score: { a: 'NYY', as: 3, b: 'LAD', bs: 2 }, mvp: null },
];
const coMono = { fontFamily: T.mono, fontVariantNumeric: 'tabular-nums' };
function coLum(hex) { const c = hex.replace('#', '').match(/../g).map(h => { const v = parseInt(h, 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function coContrast(a, b) { const x = coLum(a), y = coLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const coNick = abbr => TEAMS[abbr].name.split(' ').slice(-1)[0];

function CoScore({ c, win, lose, dim, plated }) {
  const dot = a => plated ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}><window.TeamDot team={TEAMS[a]} size={16} /></span> : <window.TeamDot team={TEAMS[a]} size={18} />;
  const s = c.score;
  const ab = (a, w) => <span style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: w ? 700 : 500, color: w ? win : lose }}>{a}</span>;
  const sc = (n, w) => <span style={{ ...coMono, fontSize: 15, fontWeight: w ? 700 : 500, color: w ? win : lose }}>{n}</span>;
  return <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: dim, marginRight: 4 }}>Game {c.g}</span>{dot(s.a)}{ab(s.a, true)}{sc(s.as, true)}<span style={{ ...coMono, color: lose }}>–</span>{sc(s.bs, false)}{ab(s.b, false)}{dot(s.b)}</div>;
}
function CoButton({ fg, bg, border, hovFg, hovBorder }) {
  const [h, setH] = React.useState(false);
  return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ fontFamily: T.sans, fontSize: 12.5, fontWeight: 600, color: h ? hovFg : fg, background: bg, border: `1px solid ${h ? hovBorder : border}`, borderRadius: T.r.sm, padding: '6px 11px', cursor: 'pointer' }}>World Series games →</button>;
}
function CoBody({ c, label, name, sub, strong, noMvp }) {
  return (
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: label }}>2026 World Series champions</span>
      <span style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', color: name, lineHeight: 1.15, textWrap: 'pretty' }}>{c.name}</span>
      <span style={{ fontFamily: T.sans, fontSize: 13, color: sub, textWrap: 'pretty' }}>Beat the {coNick(c.opp)} <span style={{ ...coMono, color: strong, fontWeight: 600 }}>{c.w}–{c.l}</span> · {c.clinch}{c.mvp && !noMvp ? <> · MVP {c.mvp}</> : null}</span>
    </div>
  );
}
const coGrid = { display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', alignItems: 'center', columnGap: 18, rowGap: 12, padding: '16px 20px', borderRadius: T.r.sm, position: 'relative', overflow: 'hidden' };
const coRight = { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, position: 'relative' };

// 1 · Club stripe — current cream banner + primary/secondary stripe on top.
function BannerStripe({ c }) {
  const t = TEAMS[c.abbr];
  return (
    <div style={{ ...coGrid, background: T.highlightSoft, border: `1px solid ${T.highlight}66`, paddingTop: 28 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: t.primary }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 8, height: 4, background: t.secondary }}></div>
      <window.TeamMark team={t} size={56} />
      <CoBody c={c} label={T.highlightText} name={T.text} sub={T.textMuted} strong={T.text} />
      <div style={coRight}><CoScore c={c} win={T.text} lose={T.textMuted} dim={T.textMuted} /><CoButton fg={T.text} bg={T.surface} border={T.borderStrong} hovFg={T.accent} hovBorder={T.accent} /></div>
    </div>
  );
}
// 2 · Club field — primary fill, white logo plate; secondary as label only if it passes 4.5:1, else white.
function BannerField({ c }) {
  const t = TEAMS[c.abbr];
  const labelOk = coContrast(t.secondary, t.primary) >= 4.5;
  const soft = '#dfe3ea';
  return (
    <div style={{ ...coGrid, background: t.primary, border: `1px solid ${t.primary}` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: t.secondary }}></div>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}><window.TeamMark team={t} size={48} /></div>
      <CoBody c={c} label={labelOk ? t.secondary : '#fff'} name="#fff" sub={soft} strong="#fff" />
      <div style={coRight}><CoScore c={c} win="#fff" lose={soft} dim={soft} plated /><CoButton fg={t.primary} bg="#fff" border="#fff" hovFg={t.primary} hovBorder={t.secondary} /></div>
      <span style={{ position: 'absolute', right: 8, bottom: 4, fontFamily: T.mono, fontSize: 9, color: soft }}>{labelOk ? 'label: secondary' : `label: white (secondary ${coContrast(t.secondary, t.primary).toFixed(1)}:1)`}</span>
    </div>
  );
}
// 3 · Watermark — cream banner, big faded logo cropped off the right edge.
function BannerWatermark({ c }) {
  const t = TEAMS[c.abbr];
  return (
    <div style={{ ...coGrid, background: T.highlightSoft, border: `1px solid ${T.highlight}66` }}>
      <img src={`https://www.mlbstatic.com/team-logos/${t.id}.svg`} alt="" style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', height: 180, opacity: 0.09, pointerEvents: 'none' }} />
      <window.TeamMark team={t} size={56} />
      <CoBody c={c} label={T.highlightText} name={T.text} sub={T.textMuted} strong={T.text} />
      <div style={coRight}><CoScore c={c} win={T.text} lose={T.textMuted} dim={T.textMuted} /><CoButton fg={T.text} bg={T.surface} border={T.borderStrong} hovFg={T.accent} hovBorder={T.accent} /></div>
    </div>
  );
}

// MVP PHOTO (Oct 31). Built on the chosen stripe banner. Image chain: MLB action shot → headshot → club logo.
// `missing` on a sample forces the action shot to fail so the fallback can be reviewed.
const CO_MVP_ROWS = [
  { ...CO_CHAMPS[0], tag: 'MVP named' },
  { ...CO_CHAMPS[1], tag: 'MVP named' },
  { ...CO_CHAMPS[2], tag: 'MVP not yet named' },
  { ...CO_CHAMPS[0], tag: 'No action photo → headshot', missing: true },
];
function CoMvpImg({ c, w, h, pos = 'center top', fade, feature, onStage }) {
  const [stage, setStage] = React.useState(c.mvpId ? (c.missing ? 1 : 0) : 2);
  React.useEffect(() => { onStage && onStage(stage); }, [stage]);
  const t = TEAMS[c.abbr];
  const src = stage === 0 ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_${w * 2},q_auto:good/v1/people/${c.mvpId}/action/hero/current`
    : stage === 1 ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_${w * 2},q_auto:best/v1/people/${c.mvpId}/headshot/67/current` : null;
  return (
    <div style={{ position: 'relative', width: feature ? '100%' : w, height: feature ? '100%' : h, overflow: 'hidden', background: feature ? T.highlightSoft : T.surfaceAlt, flexShrink: 0 }}>
      {src && feature && stage === 1 ? <img key={src} src={src} alt={c.mvp} onError={() => setStage(s => s + 1)} style={{ position: 'absolute', right: 30, bottom: 40, height: 'calc(100% - 52px)', width: 'auto', display: 'block', WebkitMaskImage: coHeadMask, maskImage: coHeadMask, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }} />
        : src ? <img key={src} src={src} alt={c.mvp} onError={() => setStage(s => s + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: stage === 1 ? 'center top' : pos, display: 'block', ...(fade ? { WebkitMaskImage: coPhotoMask, maskImage: coPhotoMask } : null) }} />
        : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', boxSizing: 'border-box', paddingBottom: feature ? 34 : 0 }}><img src={`https://www.mlbstatic.com/team-logos/${t.id}.svg`} alt="" style={{ width: feature ? 72 : Math.min(w, h) * 0.5, opacity: 0.85 }} /></div>}
    </div>
  );
}
// Eased fades: the action photo dissolves leftward into the cream; the headshot fades on both sides and its bottom.
const coPhotoMask = 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.78) 42%, #000 56%)';
const coHeadMask = 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 14%, #000 30%, #000 70%, rgba(0,0,0,0.6) 86%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,0) 0%, #000 28%)';
function CoStripe({ t }) {
  return <><div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: t.primary, zIndex: 2 }}></div><div style={{ position: 'absolute', left: 0, right: 0, top: 8, height: 4, background: t.secondary, zIndex: 2 }}></div></>;
}
const coMvpEyebrow = { fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.highlightText };

// A · Compact: a fourth column, portrait 68×84 + MVP label. Slot is always there (logo tile until named).
function BannerMvpCompact({ c }) {
  const t = TEAMS[c.abbr];
  return (
    <div style={{ ...coGrid, gridTemplateColumns: 'auto minmax(0,1fr) auto auto', background: T.highlightSoft, border: `1px solid ${T.highlight}66`, paddingTop: 28 }}>
      <CoStripe t={t} />
      <window.TeamMark team={t} size={56} />
      <CoBody c={c} label={T.highlightText} name={T.text} sub={T.textMuted} strong={T.text} noMvp />
      <div style={coRight}><CoScore c={c} win={T.text} lose={T.textMuted} dim={T.textMuted} /><CoButton fg={T.text} bg={T.surface} border={T.borderStrong} hovFg={T.accent} hovBorder={T.accent} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 18, borderLeft: `1px solid ${T.highlight}55`, width: 210, boxSizing: 'border-box' }}>
        <div style={{ borderRadius: T.r.sm, overflow: 'hidden', border: `1px solid ${T.border}`, flexShrink: 0 }}><CoMvpImg c={c} w={68} h={84} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span style={coMvpEyebrow}>Series MVP</span>
          {c.mvp ? <><span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.2, textWrap: 'pretty' }}>{c.mvp}</span><span style={{ fontFamily: T.sans, fontSize: 12, color: T.textMuted }}>{c.mvpPos} · {t.short}</span></>
            : <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted, lineHeight: 1.3 }}>Not yet named</span>}
        </div>
      </div>
    </div>
  );
}
// B · Feature: right ~third is the photo, full banner height, fading into the cream; name over a bottom scrim.
function BannerMvpFeature({ c }) {
  const t = TEAMS[c.abbr];
  const [stage, setStage] = React.useState(null);
  const onPhoto = c.mvp && stage === 0;
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(240px,34%)', minHeight: 156, background: T.highlightSoft, border: `1px solid ${T.highlight}66`, borderRadius: T.r.sm, overflow: 'hidden' }}>
      <CoStripe t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center', columnGap: 18, padding: '28px 20px 16px' }}>
        <window.TeamMark team={t} size={56} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <CoBody c={c} label={T.highlightText} name={T.text} sub={T.textMuted} strong={T.text} noMvp />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}><CoScore c={c} win={T.text} lose={T.textMuted} dim={T.textMuted} /><CoButton fg={T.text} bg={T.surface} border={T.borderStrong} hovFg={T.accent} hovBorder={T.accent} /></div>
        </div>
      </div>
      <div style={{ position: 'relative', minHeight: 156 }}>
        <div style={{ position: 'absolute', inset: 0 }}><CoMvpImg c={c} w={380} h={200} pos="center 25%" fade feature onStage={setStage} /></div>
        {onPhoto && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, background: 'linear-gradient(to top, rgba(21,22,26,0.82), rgba(21,22,26,0))', WebkitMaskImage: coPhotoMask, maskImage: coPhotoMask, pointerEvents: 'none' }}></div>}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: onPhoto ? '22px 14px 10px' : '0 14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          {c.mvp ? <><span style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: onPhoto ? '#f0d690' : T.highlightText }}>Series MVP</span><span style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: onPhoto ? '#fff' : T.text }}>{c.mvp} <span style={{ fontWeight: 500, color: onPhoto ? '#e4e4e7' : T.textMuted, fontSize: 13 }}>· {c.mvpPos}</span></span></>
            : <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.textMuted, alignSelf: 'center' }}>Series MVP not yet named</span>}
        </div>
      </div>
    </div>
  );
}
const CO_MVP_OPTS = [
  { k: 'A', title: 'MVP photo · compact', note: 'A fourth column: 68×84 portrait, "Series MVP", name, position. The slot is always there, with the club logo until the MVP is named, so the banner never changes size. The MVP leaves the summary line.', C: BannerMvpCompact },
  { k: 'B', title: 'MVP photo · feature', note: 'The right third of the banner is the action photo, full height, fading into the cream, with the name over a dark scrim at the bottom. The score and button move under the summary. Taller (156 vs ~116px) and reads as a story.', C: BannerMvpFeature },
];

const CO_OPTS = [
  { k: '1', title: 'Club stripe', note: 'Current cream banner. An 8px primary stripe + 4px secondary line on top says whose title it is. No text colour changes, so no per-club contrast checks.', C: BannerStripe },
  { k: '2', title: 'Club field', note: 'Whole banner in the club primary, logo on a white plate, secondary as the left edge. The label uses the secondary only if it passes 4.5:1 on the primary, otherwise white (small grey tag = review-only readout).', C: BannerField },
  { k: '3', title: 'Logo watermark', note: 'Cream banner with a large faded logo cropped off the right edge. No club colours at all; works for all 30 clubs as is.', C: BannerWatermark },
];
function ChampionOptions() {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textMuted }}>Review · Oct 31, 2026</span>
        <span style={{ fontFamily: T.sans, fontSize: 28, fontWeight: 800, color: T.text }}>World Series champion banner: MVP photo + club colour</span>
        <span style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, maxWidth: 720, textWrap: 'pretty' }}>MVP photo options A and B are built on the chosen club stripe (option 1). Each shows two named MVPs, the gap before an MVP is named, and a player with no action photo (falls back to the headshot, then the club logo).</span>
      </div>
      {CO_MVP_OPTS.map(o => (
        <section key={o.k} data-screen-label={`MVP option ${o.k}`} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderBottom: `1px solid ${T.border}`, paddingBottom: 10 }}>
            <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.text }}><span style={{ ...coMono, color: T.textMuted, marginRight: 8 }}>{o.k}</span>{o.title}</span>
            <span style={{ fontFamily: T.sans, fontSize: 13.5, color: T.textMuted, maxWidth: 760, textWrap: 'pretty' }}>{o.note}</span>
          </div>
          {CO_MVP_ROWS.map((c, i) => <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 600, color: T.textMuted }}>{c.tag}</span><o.C c={c} /></div>)}
        </section>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 24 }}>
        <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textMuted }}>Club colour · decided Oct 31: option 1</span>
        <span style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, maxWidth: 720, textWrap: 'pretty' }}>Each option is shown for three champions. The Yankees row has no MVP named yet, and its gray secondary is the hardest contrast case.</span>
      </div>
      {CO_OPTS.map(o => (
        <section key={o.k} data-screen-label={`Option ${o.k}`} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderBottom: `1px solid ${T.border}`, paddingBottom: 10 }}>
            <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.text }}><span style={{ ...coMono, color: T.textMuted, marginRight: 8 }}>{o.k}</span>{o.title}</span>
            <span style={{ fontFamily: T.sans, fontSize: 13.5, color: T.textMuted, maxWidth: 760, textWrap: 'pretty' }}>{o.note}</span>
          </div>
          {CO_CHAMPS.map(c => <o.C key={c.abbr} c={c} />)}
        </section>
      ))}
    </div>
  );
}
window.ChampionOptions = ChampionOptions;
