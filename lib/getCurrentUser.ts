import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  let token: string | undefined;

  try {
    const jar = await cookies();
    token = jar.get(COOKIE_NAME)?.value;
  } catch (e) {
    console.error("getCurrentUser: failed to read cookies:", e);
    return null;
  }

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
  } catch (e) {
    console.error("getCurrentUser: verify or DB lookup failed:", e);
    return null;
  }
}
