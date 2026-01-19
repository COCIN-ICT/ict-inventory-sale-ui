export type UserActivityAction =
  | 'Created'
  | 'Updated'
  | 'Deactivated';

export interface UserActivity {
  entity: 'User';          // for now, only Users
  action: UserActivityAction;
  date: string;            // ISO date string
  description: string;     // human-readable text
}
