import db from '@/lib/db';

export async function readActivities(userId: string) {
  try {
    const activities = await db.activity.findMany({
      where: {
        receiverId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return activities;
  } catch (error: any) {
    throw new Error(error);
  }
}
