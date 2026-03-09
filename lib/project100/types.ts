export type Intent = "good" | "risky";

export type ActivityRow = {
  id: string;
  user_id: string;
  title: string;
  unit: string;
  intent: Intent;
  target_value: number;
  created_at: string;
  archived_at: string | null;
};

export type AttemptRow = {
  id: string;
  user_id: string;
  activity_id: string;
  target_value: number;
  current_value: number;
  started_at: string;
  completed_at: string | null;
  completion_note: string | null;
  created_at: string;
};

export type LogRow = {
  id: string;
  user_id: string;
  attempt_id: string;
  delta: number;
  mood: string | null;
  note: string | null;
  logged_at: string;
  created_at: string;
};

export type ActivityWithAttempt = ActivityRow & {
  activeAttempt: AttemptRow | null;
  completedAttempts: AttemptRow[];
};

export type DashboardMetrics = {
  totalActivities: number;
  activeAttempts: number;
  completedAttempts: number;
  recentLogs: number;
};

export type DashboardData = {
  activities: ActivityWithAttempt[];
  recentLogs: Array<
    LogRow & {
      activityTitle: string;
      activityUnit: string;
    }
  >;
  metrics: DashboardMetrics;
  setupError?: string;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getProgress(attempt: AttemptRow) {
  return clamp(Math.round((attempt.current_value / attempt.target_value) * 100), 0, 100);
}

export function getAttemptDurationDays(attempt: AttemptRow) {
  const end = attempt.completed_at ?? new Date().toISOString();
  const ms = new Date(end).getTime() - new Date(attempt.started_at).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function getTrendLabel(intent: Intent, currentDays: number, previousDays: number | null) {
  if (previousDays === null) {
    return "First completed attempt";
  }

  const delta = currentDays - previousDays;
  if (delta === 0) {
    return "Same duration as last time";
  }

  if (intent === "good") {
    return delta < 0
      ? `${Math.abs(delta)}d faster than last time`
      : `${Math.abs(delta)}d slower than last time`;
  }

  return delta > 0
    ? `${Math.abs(delta)}d slower than last time`
    : `${Math.abs(delta)}d faster than last time`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
