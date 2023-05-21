import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
});

// matchers -> protected routes
export const config = {
  matcher: ['/users/:path*'],
};
