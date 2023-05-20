import { signIn } from 'next-auth/react';
import type { FieldValues } from 'react-hook-form';

interface AuthServiceProps {
  data: FieldValues;
  onSuccess?: () => void;
  onError?: () => void;
  onComplete?: () => void;
}

// POST /api/register
export const registerService = async ({
  data,
  onSuccess,
  onError,
  onComplete,
}: AuthServiceProps) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    onSuccess && onSuccess();
  } catch (error) {
    console.error(error, 'AuthErrors > Register > catch');
    onError && onError();
  } finally {
    onComplete && onComplete();
  }
};

// NextAuth signIn
export const signInService = async ({
  data,
  onError,
  onComplete,
  onSuccess,
}: AuthServiceProps) => {
  try {
    const response = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (!response || !response.ok || response.error) {
      throw new Error('Request failed');
    }

    onSuccess && onSuccess();
  } catch (error) {
    console.error(error, 'AuthErrors > SignIn > catch');
    onError && onError();
  } finally {
    onComplete && onComplete();
  }
};
