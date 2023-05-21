'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';

import type { FullConversationType } from '../types';

const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        users: User[];
      }
): User | undefined => {
  // Hook(s)
  const session = useSession();
  const otherUser = useMemo<User | undefined>(() => {
    const currentUserEmail = session?.data?.user?.email;
    if (!currentUserEmail) return undefined;
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    if (!otherUser) return undefined;

    return otherUser[0];
  }, [conversation.users, session?.data?.user?.email]);

  return otherUser;
};

export default useOtherUser;
