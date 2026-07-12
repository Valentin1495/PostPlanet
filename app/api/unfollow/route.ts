import { unfollow } from '@/actions/user.actions';

export async function POST(request: Request) {
  try {
    const { userId, currentUserId } = await request.json();
    await unfollow(currentUserId, userId);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to unfollow the user',
      },
      { status: 500 }
    );
  }
}
