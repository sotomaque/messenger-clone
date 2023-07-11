'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import format from 'date-fns/format';

import Avatar from '@/app/components/Avatar';
import type { FullConversationType } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';

interface ConvserationItemProps {
  conversation: FullConversationType;
  selected?: boolean;
}

const ConvserationItem: React.FC<ConvserationItemProps> = ({
  conversation,
  selected,
}) => {
  // Hook(s)
  const router = useRouter();
  const session = useSession();
  const otherUser = useOtherUser(conversation);

  // Handler(s)
  const handleConversationClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation, router]);

  // Computed Variable(s)
  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];
    const lastMessage = messages[messages.length - 1];

    return lastMessage;
  }, [conversation.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    if (!userEmail) return false;

    const seenArray = lastMessage.seen || [];
    const hasSeen =
      seenArray.filter((user) => user.email === userEmail).length !== 0;

    return hasSeen;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an Image';

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  if (!otherUser) return null;

  return (
    <div
      className={clsx(
        `
          w-full
          flex
          items-center
          space-x-3
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
          p-3
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
      onClick={handleConversationClick}
    >
      <Avatar user={otherUser} />

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            {/* Name */}
            <p className="text-md font-medium text-gray-900">
              {conversation.name || otherUser.name}
            </p>
            {/* Time */}
            {lastMessage?.createdAt && (
              <p
                className="
                text-xs
                text-gray-400
                font-light
              "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          {/* Last Message */}
          <p
            className={clsx(
              `
                truncate
                text-sm
              `,
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConvserationItem;
