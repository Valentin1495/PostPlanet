import db from '@/lib/db';
import { User } from '@prisma/client';

export async function getActivities({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  try {
    const activities = await db.activity.findMany({
      where: {
        receiverId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: page * limit,
    });

    return activities;
  } catch (error) {
    console.error(error);
  }
}

export async function createPost({
  text,
  image,
  authorId,
}: {
  text: string;
  image: string;
  authorId: string;
}) {
  try {
    const newPost = await db.post.create({
      data: {
        text,
        image,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    return newPost;
  } catch (error) {
    console.error(error);
  }
}

export async function getPost(postId: string) {
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    return post;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllPosts(limit: number, page: number) {
  try {
    const allPosts = await db.post.findMany({
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allPosts;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId: string) {
  try {
    const deletedPost = await db.post.delete({
      where: {
        id: postId,
      },
    });

    return deletedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function follow({
  userId,
  currentUserId,
  followingIds,
}: {
  userId: string;
  currentUserId: string;
  followingIds: string[];
}) {
  followingIds.push(userId);

  try {
    const userFollowed = await db.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingIds,
      },
    });

    const followActivity = await db.activity.create({
      data: {
        giverId: currentUserId,
        receiverId: userId,
        type: 'follow',
      },
    });

    return { userFollowed, followActivity };
  } catch (error) {
    console.error(error);
  }
}

export async function unfollow({
  userId,
  currentUserId,
  followingIds,
}: {
  userId: string;
  currentUserId: string;
  followingIds: string[];
}) {
  const newFollowingIds = followingIds.filter((id) => id !== userId);

  try {
    const unfollowedUser = await db.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingIds: newFollowingIds,
      },
    });

    return unfollowedUser;
  } catch (error) {
    console.error(error);
  }
}

export async function getUser(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function isFollowing(userFollowing: string, userFollowed: string) {
  try {
    const currentUser = await getUser(userFollowing);
    return currentUser?.followingIds.includes(userFollowed);
  } catch (error) {
    console.error(error);
  }
}

export async function countFollowers(userId: string) {
  try {
    const followersCount = await db.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    return followersCount;
  } catch (error) {
    console.error(error);
  }
}

export async function countFollowing(userId: string) {
  try {
    const user = await getUser(userId);
    if (!user) return;

    return user.followingIds.length;
  } catch (error) {
    console.log(error);
  }
}

export async function replyToPost({
  text,
  image,
  userId,
  postId,
}: {
  text: string;
  image: string;
  userId: string;
  postId: string;
}) {
  const post = await getPost(postId);

  if (!post) return;
  const { authorId, text: postText } = post;

  try {
    await db.reply.create({
      data: {
        text,
        image,
        author: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    await db.activity.create({
      data: {
        type: 'reply',
        giverId: userId,
        receiverId: authorId,
        postId,
        text: postText,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getReplies({
  postId,
  limit,
  page,
}: {
  postId: string;
  limit: number;
  page: number;
}) {
  try {
    const replies = await db.reply.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: page * limit,
    });

    return replies;
  } catch (error) {
    console.error(error);
  }
}

export async function countReplies(postId: string) {
  try {
    const repliesCount = await db.reply.count({
      where: {
        postId,
      },
    });

    return repliesCount;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteReply(replyId: string) {
  try {
    const reply = await db.reply.delete({
      where: {
        id: replyId,
      },
    });

    return reply;
  } catch (error) {
    console.error(error);
  }
}

export async function checkHasLiked(postId: string, userId: string) {
  const post = await getPost(postId);
  const hasLiked = post?.likedIds.includes(userId);

  return hasLiked;
}

export async function countPostReplies(postId: string) {
  try {
    const repliesCount = await db.reply.count({
      where: {
        postId,
      },
    });

    return repliesCount;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostInfo({
  id,
  authorId,
  currentUserId,
}: {
  id: string;
  authorId: string;
  currentUserId: string;
}) {
  const author = await getUser(authorId);
  const post = await getPost(id);
  const likesCount = post?.likedIds.length;
  const hasLiked = await checkHasLiked(id, currentUserId);
  const replyCount = await countPostReplies(id);
  const followers = await countFollowers(authorId);

  return { author, hasLiked, replyCount, followers, likesCount };
}

export async function getUserId(username: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    return user?.id;
  } catch (error) {
    console.error(error);
  }
}

export async function getFollowingUsers({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  const { followingIds } = (await getUser(userId)) as User;

  const startIndex = page * limit;
  const paginatedFollowingIds = followingIds.slice(
    startIndex,
    startIndex + limit
  );

  const promises = paginatedFollowingIds.map(async (id) => await getUser(id));
  const followingUsers = await Promise.all(promises);

  return followingUsers;
}

export async function getFollowers({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  try {
    const followers = await db.user.findMany({
      where: {
        followingIds: {
          has: userId,
        },
      },
      take: limit,
      skip: limit * page,
    });

    return followers;
  } catch (error) {
    console.error(error);
  }
}

export async function getRepliesWithPost({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  try {
    const repliesWithPost = await db.reply.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
        post: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: limit * page,
    });

    return repliesWithPost;
  } catch (error) {
    console.error(error);
  }
}

export async function searchPeople({
  q,
  limit,
  page,
}: {
  q: string;
  limit: number;
  page: number;
}) {
  let query = q;
  if (query?.includes(' ')) {
    query = query.replace(/ /g, '');
  }

  try {
    const people = db.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
      skip: limit * page,
    });

    return people;
  } catch (error) {
    console.error(error);
  }
}

export async function searchPosts({
  q,
  limit,
  page,
}: {
  q: string;
  limit: number;
  page: number;
}) {
  let query = q?.trim();
  query = query.replace(/\s+/g, ' ');

  try {
    const posts = await db.post.findMany({
      where: {
        text: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
      skip: limit * page,
    });

    return posts;
  } catch (error) {
    console.error(error);
  }
}
