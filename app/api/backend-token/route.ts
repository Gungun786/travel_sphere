import { auth } from '@/auth';
import { SignJWT } from 'jose';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const secret = process.env.BACKEND_JWT_SECRET;
  if (!secret) {
    return Response.json(
      { error: 'Backend token signing is not configured.' },
      { status: 500 }
    );
  }

  const token = await new SignJWT({
    email: session.user.email,
    name: session.user.name ?? null,
    picture: session.user.image ?? null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.user.id)
    .setIssuer('travelsphere-web')
    .setAudience('travelsphere-api')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(new TextEncoder().encode(secret));

  return Response.json({ token, expiresIn: 300 });
}
