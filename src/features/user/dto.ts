export interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  plan: string;
  created_at: Date;
  updated_at: Date;
  avatar?: string;
  avatar_url?: string;
}
