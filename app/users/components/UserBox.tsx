'use client';

import Avatar from '@/app/components/Avatar';
import { startConversation } from '@/app/services/conversationService';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

interface UserBoxProps {
  user: User;
}

enum UserBoxToast {
  GenericError = "Couldn't start conversation",
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  // Hook(s)
  const router = useRouter();

  // State
  const [isLoading, setIsLoading] = useState(false);

  // Function(s)
  const handleClick = useCallback(async () => {
    setIsLoading(true);

    await startConversation({
      user,
      onSuccess: (res) => {
        if (res && res.id) {
          router.push(`/conversations/${res.id}`);
        }
      },
      onComplete: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Couldn't start conversation", error);
        toast.error(UserBoxToast.GenericError);
      },
    });
  }, [user, router]);

  return (
    <div
      className="
        w-full 
        relative 
        flex 
        items-center
        space-x-3 
        bg-white 
        p-3 
        hover:bg-neutral-100 
        rounded-lg 
        transition 
        cursor-pointer
      "
      onClick={handleClick}
    >
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
            flex
            justify-between
            items-center
            mb-1
          "
          >
            <p
              className="
              text-sm
              font-medium
              text-gray-900
            "
            >
              {user.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
