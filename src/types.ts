import type { ReactNode } from 'react';

export type MessageType = 'bot' | 'user';

export interface Message {
  id: string;
  type: MessageType;
  content: ReactNode;
  timestamp: number;
}

export interface Option {
  label: string;
  value: string;
}

export interface Step {
  id: string;
  messages: string[]; 
  type: 'options' | 'text' | 'email' | 'tel' | 'end';
  options?: Option[];
  inputPlaceholder?: string;
  field?: string; 
}

export interface UserData {
  [key: string]: string;
}
