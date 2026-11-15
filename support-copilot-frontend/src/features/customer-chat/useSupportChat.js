import { useContext } from 'react';
import { SupportChatContext } from './SupportChatContext';

export function useSupportChat() {
  const context = useContext(SupportChatContext);

  if (!context) {
    throw new Error('useSupportChat must be used inside SupportChatProvider');
  }

  return context;
}
