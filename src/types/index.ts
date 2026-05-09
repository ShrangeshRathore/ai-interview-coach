export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}
