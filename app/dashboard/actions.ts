"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { DashboardActionState } from "@/components/dashboard/action-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

type RequireUserResult =
  | {
      error: string;
    }
  | {
      supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
      user: User;
    };

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : 0;
}

async function requireUser(): Promise<RequireUserResult> {
  if (!hasSupabaseConfig()) {
    return { error: "Missing Supabase configuration." as string };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

function success(message: string): DashboardActionState {
  return { status: "success", message };
}

function failure(message: string): DashboardActionState {
  return { status: "error", message };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login?message=Signed out.");
}

export async function createActivity(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const auth = await requireUser();
  if ("error" in auth) {
    return failure(auth.error);
  }

  const { supabase, user } = auth;
  const title = getString(formData, "title");
  const unit = getString(formData, "unit");
  const intent = getString(formData, "intent");
  const targetValue = Math.max(1, getNumber(formData, "targetValue") || 100);

  if (!title || !unit || (intent !== "good" && intent !== "risky")) {
    return failure("Fill in title, unit, and intent.");
  }

  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .insert({
      user_id: user.id,
      title,
      unit,
      intent,
      target_value: targetValue,
    })
    .select("id, target_value")
    .single();

  if (activityError || !activity) {
    return failure(activityError?.message ?? "Could not create activity.");
  }

  const { error: attemptError } = await supabase.from("attempts").insert({
    user_id: user.id,
    activity_id: activity.id,
    target_value: activity.target_value,
    current_value: 0,
  });

  if (attemptError) {
    return failure(attemptError.message);
  }

  revalidatePath("/dashboard");
  return success("Activity created.");
}

export async function logProgress(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const auth = await requireUser();
  if ("error" in auth) {
    return failure(auth.error);
  }

  const { supabase, user } = auth;
  const attemptId = getString(formData, "attemptId");
  const delta = Math.max(1, getNumber(formData, "delta"));
  const mood = getString(formData, "mood") || null;

  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .is("completed_at", null)
    .single();

  if (attemptError || !attempt) {
    return failure(attemptError?.message ?? "Active attempt not found.");
  }

  const nextValue = Math.min(attempt.target_value, attempt.current_value + delta);

  const { error: logError } = await supabase.from("logs").insert({
    user_id: user.id,
    attempt_id: attempt.id,
    delta,
    mood,
  });

  if (logError) {
    return failure(logError.message);
  }

  const updatePayload: {
    current_value: number;
    completed_at?: string;
  } = {
    current_value: nextValue,
  };

  if (nextValue >= attempt.target_value) {
    updatePayload.completed_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from("attempts")
    .update(updatePayload)
    .eq("id", attempt.id)
    .eq("user_id", user.id);

  if (updateError) {
    return failure(updateError.message);
  }

  revalidatePath("/dashboard");
  return success(nextValue >= attempt.target_value ? "Attempt completed at 100." : `Logged +${delta}.`);
}

export async function startNextAttempt(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const auth = await requireUser();
  if ("error" in auth) {
    return failure(auth.error);
  }

  const { supabase, user } = auth;
  const activityId = getString(formData, "activityId");

  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .select("*")
    .eq("id", activityId)
    .eq("user_id", user.id)
    .single();

  if (activityError || !activity) {
    return failure(activityError?.message ?? "Activity not found.");
  }

  const { data: existingAttempt } = await supabase
    .from("attempts")
    .select("id")
    .eq("activity_id", activity.id)
    .eq("user_id", user.id)
    .is("completed_at", null)
    .maybeSingle();

  if (existingAttempt) {
    return failure("This activity already has an active attempt.");
  }

  const { error } = await supabase.from("attempts").insert({
    user_id: user.id,
    activity_id: activity.id,
    target_value: activity.target_value,
    current_value: 0,
  });

  if (error) {
    return failure(error.message);
  }

  revalidatePath("/dashboard");
  return success("New attempt started.");
}
