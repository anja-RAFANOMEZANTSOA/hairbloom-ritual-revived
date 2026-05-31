const KEY = "hairbloom_initial_analysis_done";

export function isInitialAnalysisDone(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(KEY) === "true";
}

export function markInitialAnalysisDone() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, "true");
  window.dispatchEvent(new Event("hairbloom:initial-analysis"));
}

export function resetInitialAnalysis() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("hairbloom:initial-analysis"));
}