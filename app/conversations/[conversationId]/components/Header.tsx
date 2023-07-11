'use client';

import Avatar from '@/app/components/Avatar';
import useOtherUser from '@/app/hooks/useOtherUser';
import type { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import { useMemo, type FC } from 'react';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: FC<HeaderProps> = ({ conversation }) => {
  // Hook(s)
  const otherUser = useOtherUser(conversation);

  // Computed Variable(s)
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    // TODO: active or offline
    return 'Active';
  }, [conversation]);

  if (!otherUser) return null;

  // Handler(s)
  const onClick = () => {};

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations"
          className={`lg:hidden block text-sky-500 hover:text-sky-600 transistion cursor-pointer`}
        >
          <HiChevronLeft size={32} />
        </Link>
        <Avatar user={otherUser} />
        <div className="flex flex-col">
          <div>{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        onClick={onClick}
        className="text-sky-500 cursor:pointer transition hover:text-sky-600"
      />
    </div>
  );
};

export default Header;
