export type DashboardActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialDashboardActionState: DashboardActionState = {
  status: "idle",
  message: "",
};
