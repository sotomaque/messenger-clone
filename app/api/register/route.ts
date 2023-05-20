import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse, type NextRequest } from 'next/server';

enum Response {
  InvalidRequest = 'Invalid request',
  MissingFields = 'Missing fields',
}

enum Errors {
  RegistrationError = 'Registration error',
}

// need named export bc of app directory
export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return new NextResponse(Response.InvalidRequest, { status: 405 }); // Return a 405 Method Not Allowed status if the method is not POST
  }

  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse(Response.MissingFields, { status: 400 });
    }

    // second argument is the salt
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error, Errors.RegistrationError);
    return new NextResponse(error.message || Errors.RegistrationError, {
      status: 500,
    });
  }
}
