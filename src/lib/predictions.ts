export type Prediction = "home" | "draw" | "away";

const PREFIX = "goaltoon_pred_";

export function getPrediction(matchId: string): Prediction | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(PREFIX + matchId) as Prediction) ?? null;
}

export function setPrediction(matchId: string, pred: Prediction): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + matchId, pred);
}

export function clearPrediction(matchId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREFIX + matchId);
}
