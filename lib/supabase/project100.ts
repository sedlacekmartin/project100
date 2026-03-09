import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActivityRow,
  ActivityWithAttempt,
  AttemptRow,
  DashboardData,
  DashboardMetrics,
  LogRow,
} from "@/lib/project100/types";

async function selectActivities(supabase: SupabaseClient, userId: string) {
  return supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });
}

async function selectAttempts(supabase: SupabaseClient, userId: string) {
  return supabase
    .from("attempts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

async function selectRecentLogs(supabase: SupabaseClient, userId: string) {
  return supabase
    .from("logs")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(8);
}

function getSetupErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Unknown Supabase error";
  }

  if (error.message.includes("relation") || error.message.includes("does not exist")) {
    return "Database tables are missing. Run the SQL in db/migrations/0001_project100.sql.";
  }

  return error.message;
}

function buildMetrics(
  activities: ActivityWithAttempt[],
  attempts: AttemptRow[],
  logs: LogRow[],
): DashboardMetrics {
  return {
    totalActivities: activities.length,
    activeAttempts: activities.filter((activity) => activity.activeAttempt).length,
    completedAttempts: attempts.filter((attempt) => attempt.completed_at).length,
    recentLogs: logs.length,
  };
}

export async function getDashboardData(
  supabase: SupabaseClient,
  userId: string,
): Promise<DashboardData> {
  try {
    const [activitiesResult, attemptsResult, logsResult] = await Promise.all([
      selectActivities(supabase, userId),
      selectAttempts(supabase, userId),
      selectRecentLogs(supabase, userId),
    ]);

    if (activitiesResult.error) {
      throw new Error(activitiesResult.error.message);
    }

    if (attemptsResult.error) {
      throw new Error(attemptsResult.error.message);
    }

    if (logsResult.error) {
      throw new Error(logsResult.error.message);
    }

    const activities = (activitiesResult.data ?? []) as ActivityRow[];
    const attempts = (attemptsResult.data ?? []) as AttemptRow[];
    const recentLogs = (logsResult.data ?? []) as LogRow[];

    const attemptsByActivity = new Map<string, AttemptRow[]>();
    attempts.forEach((attempt) => {
      const group = attemptsByActivity.get(attempt.activity_id) ?? [];
      group.push(attempt);
      attemptsByActivity.set(attempt.activity_id, group);
    });

    const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
    const dashboardActivities: ActivityWithAttempt[] = activities.map((activity) => {
      const groupedAttempts = attemptsByActivity.get(activity.id) ?? [];
      return {
        ...activity,
        activeAttempt: groupedAttempts.find((attempt) => attempt.completed_at === null) ?? null,
        completedAttempts: groupedAttempts.filter((attempt) => attempt.completed_at !== null),
      };
    });

    const enrichedRecentLogs = recentLogs.flatMap((log) => {
      const attempt = attempts.find((item) => item.id === log.attempt_id);
      if (!attempt) {
        return [];
      }

      const activity = activityMap.get(attempt.activity_id);
      if (!activity) {
        return [];
      }

      return [
        {
          ...log,
          activityTitle: activity.title,
          activityUnit: activity.unit,
        },
      ];
    });

    return {
      activities: dashboardActivities,
      recentLogs: enrichedRecentLogs,
      metrics: buildMetrics(dashboardActivities, attempts, recentLogs),
    };
  } catch (error) {
    return {
      activities: [],
      recentLogs: [],
      metrics: {
        totalActivities: 0,
        activeAttempts: 0,
        completedAttempts: 0,
        recentLogs: 0,
      },
      setupError: getSetupErrorMessage(error),
    };
  }
}
