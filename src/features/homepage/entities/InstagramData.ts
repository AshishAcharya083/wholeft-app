import { Follower } from './Follower';
import { Following } from './Following';

export interface FollowersGrowthPoint {
  date: string;
  cumulativeFollowers: number;
  newFollowers: number;
}

export interface InstagramData {
  followers: Follower[];
  following: Following[];
  uploadedAt: Date;
  totalFollowers: number;
  totalFollowing: number;
}

export interface InstagramDataSummary {
  totalFollowers: number;
  totalFollowing: number;
  notFollowingBack: number;
  notFollowedBack: number;
}

export function createInstagramData(
  followers: Follower[],
  following: Following[]
): InstagramData {
  return {
    followers,
    following,
    uploadedAt: new Date(),
    totalFollowers: followers.length,
    totalFollowing: following.length,
  };
}

export function calculateSummary(data: InstagramData): InstagramDataSummary {
  const notFollowingBackList = getNotFollowingBackList(data);
  const notFollowedBackList = getNotFollowedBackList(data);

  return {
    totalFollowers: data.totalFollowers,
    totalFollowing: data.totalFollowing,
    notFollowingBack: notFollowingBackList.length,
    notFollowedBack: notFollowedBackList.length,
  };
}

export function getNotFollowingBackList(data: InstagramData): Following[] {
  const followerUsernames = createUsernameSet(data.followers);
  return data.following.filter((user) => !followerUsernames.has(user.username));
}

export function getNotFollowedBackList(data: InstagramData): Follower[] {
  const followingUsernames = createUsernameSet(data.following);
  return data.followers.filter((user) => !followingUsernames.has(user.username));
}

export function getFollowersGrowth(data: InstagramData): FollowersGrowthPoint[] {
  const dailyBuckets = buildDailyFollowerBuckets(data.followers);
  const sortedDailyEntries = Array.from(dailyBuckets.entries()).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  let cumulative = 0;
  return sortedDailyEntries.map(([date, count]) => {
    cumulative += count;
    return {
      date,
      cumulativeFollowers: cumulative,
      newFollowers: count,
    };
  });
}

function createUsernameSet(items: { username: string }[]): Set<string> {
  return new Set(items.map((item) => item.username));
}

function buildDailyFollowerBuckets(followers: Follower[]): Map<string, number> {
  const buckets = new Map<string, number>();

  for (const follower of followers) {
    if (!follower.timestamp) {
      continue;
    }

    const date = normalizeToDate(follower.timestamp);
    const current = buckets.get(date) ?? 0;
    buckets.set(date, current + 1);
  }

  return buckets;
}

function normalizeToDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
}
