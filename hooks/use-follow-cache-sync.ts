import { useEffect } from 'react';
import type {
  InfiniteData,
  Query,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';
import type { User } from '@/lib/types';
import type { FollowInfo } from './use-follow-info';

export type FollowMutationVariables = {
  userId: string;
  currentUserId: string;
  user?: User;
  currentUser?: User | null;
};

export type FollowAction = 'follow' | 'unfollow';

type FollowListData = InfiniteData<User[], number>;
type CacheSnapshot<T> = Array<[QueryKey, T | undefined]>;

export type FollowCacheSnapshot = {
  followInfo: CacheSnapshot<FollowInfo>;
  followLists: CacheSnapshot<FollowListData>;
};

type FollowCacheMessage =
  | {
      type: 'follow-cache:update';
      action: FollowAction;
      variables: FollowMutationVariables;
      sourceId: string;
    }
  | {
      type: 'follow-cache:invalidate';
      variables: FollowMutationVariables;
      sourceId: string;
    };

const FOLLOW_CACHE_CHANNEL = 'postplanet-follow-cache';
let sourceId: string | undefined;

const getSourceId = () => {
  if (!sourceId) {
    sourceId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
  }

  return sourceId;
};

const isFollowListQuery = (query: Query) =>
  query.queryKey[0] === 'followers' || query.queryKey[0] === 'following';

const isAffectedFollowInfoQuery =
  ({ userId, currentUserId }: FollowMutationVariables) =>
  (query: Query) => {
    const [type, subjectUserId, viewerUserId] = query.queryKey;

    if (type !== 'followInfo') return false;

    return (
      (subjectUserId === userId && viewerUserId === currentUserId) ||
      subjectUserId === currentUserId
    );
  };

const getAffectedFollowListQueries = (queryClient: QueryClient) =>
  queryClient.getQueryCache().findAll({ predicate: isFollowListQuery });

const getAffectedFollowInfoQueries = (
  queryClient: QueryClient,
  variables: FollowMutationVariables
) =>
  queryClient
    .getQueryCache()
    .findAll({ predicate: isAffectedFollowInfoQuery(variables) });

const insertUser = (
  data: FollowListData,
  user: User | null | undefined
): FollowListData => {
  if (!user) return data;

  const exists = data.pages.some((page) =>
    page.some((cachedUser) => cachedUser.id === user.id)
  );

  if (exists) return data;

  if (data.pages.length === 0) {
    return { ...data, pages: [[user]] };
  }

  const [firstPage, ...restPages] = data.pages;

  return {
    ...data,
    pages: [[user, ...firstPage], ...restPages],
  };
};

const removeUser = (data: FollowListData, userId: string): FollowListData => {
  let changed = false;
  const pages = data.pages.map((page) => {
    const filteredPage = page.filter((user) => user.id !== userId);
    changed ||= filteredPage.length !== page.length;
    return filteredPage;
  });

  return changed ? { ...data, pages } : data;
};

const updateFollowList = (
  data: FollowListData | undefined,
  queryKey: QueryKey,
  variables: FollowMutationVariables,
  action: FollowAction
) => {
  if (!data) return data;

  const [type, ownerUserId] = queryKey;

  if (type === 'following' && ownerUserId === variables.currentUserId) {
    return action === 'follow'
      ? insertUser(data, variables.user)
      : removeUser(data, variables.userId);
  }

  if (type === 'followers' && ownerUserId === variables.userId) {
    return action === 'follow'
      ? insertUser(data, variables.currentUser)
      : removeUser(data, variables.currentUserId);
  }

  return data;
};

const updateFollowInfo = (
  data: FollowInfo | undefined,
  queryKey: QueryKey,
  { userId, currentUserId }: FollowMutationVariables,
  action: FollowAction
) => {
  if (!data) return data;

  const [, subjectUserId, viewerUserId] = queryKey;
  const delta = action === 'follow' ? 1 : -1;
  const next = { ...data };

  if (subjectUserId === userId && viewerUserId === currentUserId) {
    next.isFollowingUser = action === 'follow';
    next.followersCount = Math.max(0, next.followersCount + delta);
  }

  if (subjectUserId === currentUserId) {
    next.followingCount = Math.max(0, next.followingCount + delta);
  }

  return next;
};

const isFollowCacheMessage = (
  message: unknown
): message is FollowCacheMessage => {
  if (!message || typeof message !== 'object') return false;

  const { type } = message as { type?: string };
  return type === 'follow-cache:update' || type === 'follow-cache:invalidate';
};

export const snapshotFollowCaches = (
  queryClient: QueryClient,
  variables: FollowMutationVariables
): FollowCacheSnapshot => ({
  followInfo: getAffectedFollowInfoQueries(queryClient, variables).map((query) => [
    query.queryKey,
    queryClient.getQueryData<FollowInfo>(query.queryKey),
  ]),
  followLists: getAffectedFollowListQueries(queryClient).map((query) => [
    query.queryKey,
    queryClient.getQueryData<FollowListData>(query.queryKey),
  ]),
});

export const cancelFollowCaches = (
  queryClient: QueryClient,
  variables: FollowMutationVariables
) =>
  Promise.all([
    queryClient.cancelQueries({
      predicate: isAffectedFollowInfoQuery(variables),
    }),
    queryClient.cancelQueries({ predicate: isFollowListQuery }),
  ]);

export const restoreFollowCaches = (
  queryClient: QueryClient,
  snapshot: FollowCacheSnapshot | undefined
) => {
  if (!snapshot) return;

  snapshot.followInfo.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });

  snapshot.followLists.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

export const applyFollowCacheUpdate = (
  queryClient: QueryClient,
  variables: FollowMutationVariables,
  action: FollowAction
) => {
  getAffectedFollowInfoQueries(queryClient, variables).forEach((query) => {
    queryClient.setQueryData<FollowInfo>(query.queryKey, (data) =>
      updateFollowInfo(data, query.queryKey, variables, action)
    );
  });

  getAffectedFollowListQueries(queryClient).forEach((query) => {
    queryClient.setQueryData<FollowListData>(query.queryKey, (data) =>
      updateFollowList(data, query.queryKey, variables, action)
    );
  });
};

export const invalidateFollowCaches = (
  queryClient: QueryClient,
  variables: FollowMutationVariables
) => {
  queryClient.invalidateQueries({
    predicate: (query) =>
      isFollowListQuery(query) || isAffectedFollowInfoQuery(variables)(query),
  });
};

export const broadcastFollowCacheUpdate = (
  variables: FollowMutationVariables,
  action: FollowAction
) => {
  if (typeof BroadcastChannel === 'undefined') return;

  const channel = new BroadcastChannel(FOLLOW_CACHE_CHANNEL);

  channel.postMessage({
    type: 'follow-cache:update',
    action,
    variables,
    sourceId: getSourceId(),
  } satisfies FollowCacheMessage);

  channel.close();
};

export const broadcastFollowCacheInvalidation = (
  variables: FollowMutationVariables
) => {
  if (typeof BroadcastChannel === 'undefined') return;

  const channel = new BroadcastChannel(FOLLOW_CACHE_CHANNEL);

  channel.postMessage({
    type: 'follow-cache:invalidate',
    variables,
    sourceId: getSourceId(),
  } satisfies FollowCacheMessage);

  channel.close();
};

export const useFollowCacheSync = (queryClient: QueryClient) => {
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(FOLLOW_CACHE_CHANNEL);
    const currentSourceId = getSourceId();

    channel.onmessage = (event: MessageEvent<unknown>) => {
      const message = event.data;

      if (!isFollowCacheMessage(message) || message.sourceId === currentSourceId) {
        return;
      }

      if (message.type === 'follow-cache:update') {
        applyFollowCacheUpdate(queryClient, message.variables, message.action);
        return;
      }

      invalidateFollowCaches(queryClient, message.variables);
    };

    return () => channel.close();
  }, [queryClient]);
};
