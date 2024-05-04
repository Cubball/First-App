export const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type Priority = (typeof ALLOWED_PRIORITIES)[number];
