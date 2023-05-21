import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';
import { FullConversationType } from '../types';

const getConversations = async (): Promise<FullConversationType[]> => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    return await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getConversations;
