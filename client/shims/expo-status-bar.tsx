import React from 'react';

export interface StatusBarProps {
  style?: 'light' | 'dark' | 'auto';
  backgroundColor?: string;
  hidden?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = () => {
  return null;
};
