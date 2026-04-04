import prisma from "@/lib/prisma";

export async function searchUsers(query: string, currentUserId: string) {
  const normalized = query.trim();

  if (!normalized) {
    return [];
  }

  return prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
      OR: [
        {
          email: {
            contains: normalized,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: normalized,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      trustScore: true,
    },
    orderBy: [{ trustScore: "desc" }, { email: "asc" }],
    take: 8,
  });
}
