// POST /api/register

import type { User } from '@prisma/client';

interface ConversationServiceProps {
  user: User;
  onError?: (error: any) => void;
  onComplete?: () => void;
  onSuccess?: (res: any) => void;
}

export const startConversation = async ({
  user,
  onError,
  onComplete,
  onSuccess,
}: ConversationServiceProps) => {
  try {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const result = await response.json();

    onSuccess && onSuccess(result);
  } catch (error) {
    console.error(error, 'ConversationErrors > Get > catch');
    onError && onError(error);
  } finally {
    onComplete && onComplete();
  }
};
