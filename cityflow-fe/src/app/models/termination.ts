import { User } from "./user";

export interface Termination {
    id: number;
    user: User;
    terminationDate: Date;
    reason: string;
  }