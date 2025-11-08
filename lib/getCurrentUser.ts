import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = await verifySession(token);
    if (!payload?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
