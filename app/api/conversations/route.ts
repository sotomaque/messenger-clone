import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

enum Response {
  Unauthorized = 'Unauthorized',
  MissingUserId = 'Missing User Id',
  MissingGroupChatFields = 'Missing Group Chat Fields',
}

enum Errors {
  GenericError = 'Converation Error',
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse(Response.Unauthorized, { status: 401 });
    }

    const body = await request.json();
    const { userId, isGroup, memebers, name } = body;

    if (isGroup) {
      if (!memebers || !memebers.length || memebers.length < 2 || !name) {
        return new NextResponse(Response.MissingGroupChatFields, {
          status: 400,
        });
      }

      // create new group conversation
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...memebers.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    }

    if (!userId) {
      return new NextResponse(Response.MissingUserId, { status: 400 });
    }

    // do not create a new conversation if one already exists
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // create new 1 on 1 conversation
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse(Errors.GenericError, { status: 500 });
  }
}
