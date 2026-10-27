// A team's recent form from its dated games — regular season AND postseason
// together (GET /games/season?postseason=true), so "last 10" and the streak
// run into October instead of stopping at the regular season's end
// (PROMPT_last_n_postseason_audit.md). Standings keep their own frozen L10.

export interface FormGameInput {
  gameDate: string;
  startTimeUtc?: string | null;
  status: string;
  teamScore: number | null;
  oppScore: number | null;
}

export interface TeamForm<G> {
  /** The last 10 games played, oldest first. */
  last10: G[];
  /** "7-3" over those games. */
  lastTen: string;
  /** "W3" — carried across from the regular season into the postseason; null before any game. */
  streak: string | null;
}

export function teamForm<G extends FormGameInput>(games: readonly G[]): TeamForm<G> {
  // Played = final with a score (MLB marks a postponed game "Final" with none).
  const played = games
    .filter((g) => g.status === "final" && g.teamScore != null && g.oppScore != null)
    .sort((a, b) => a.gameDate.localeCompare(b.gameDate) || (a.startTimeUtc ?? "").localeCompare(b.startTimeUtc ?? ""));
  const won = (g: G): boolean => (g.teamScore ?? 0) > (g.oppScore ?? 0);
  const last10 = played.slice(-10);
  const wins = last10.filter(won).length;
  let run = 0;
  const latest = played[played.length - 1];
  for (let i = played.length - 1; i >= 0 && latest != null && won(played[i]) === won(latest); i--) run += 1;
  return {
    last10,
    lastTen: `${wins}-${last10.length - wins}`,
    streak: latest != null ? `${won(latest) ? "W" : "L"}${run}` : null,
  };
}
