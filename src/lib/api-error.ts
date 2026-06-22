import type { AxiosError } from "axios";

export function getApiErrorMessage(
  err: unknown,
  fallback: string,
  offlineMessage = "Cannot reach API server. Make sure the backend is running on port 5000.",
): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
  if (axiosErr.request && !axiosErr.response) return offlineMessage;
  if (axiosErr.message) return axiosErr.message;
  return fallback;
}
