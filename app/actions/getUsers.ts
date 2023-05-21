import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) return [];

  try {
    // get all users excluding the current user
    // ordered by newest
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getUsers;
