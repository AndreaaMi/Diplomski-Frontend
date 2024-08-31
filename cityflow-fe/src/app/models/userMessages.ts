export interface UserMessages{
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  readStatus: boolean;
}