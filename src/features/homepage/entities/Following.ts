export interface Following {
  username: string;
  profileUrl: string;
  timestamp: number;
}

export interface FollowingRaw {
  relationships_following: {
    title: string;
    string_list_data: {
      href: string;
      timestamp: number;
    }[];
  }[];
}

export function parseFollowing(raw: FollowingRaw): Following[] {
  if (!raw.relationships_following || raw.relationships_following.length === 0) {
    return [];
  }

  const followingList: Following[] = [];

  for (const item of raw.relationships_following) {
    if (!item.string_list_data || item.string_list_data.length === 0) {
      continue;
    }

    for (const data of item.string_list_data) {
      // Extract username from href (format: https://www.instagram.com/{username})
      const username = extractUsernameFromUrl(data.href);
      
      followingList.push({
        username,
        profileUrl: data.href,
        timestamp: data.timestamp,
      });
    }
  }

  return followingList;
}

function extractUsernameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter(Boolean);
    return segments.length > 0 ? segments[segments.length - 1] : url;
  } catch {
    return url;
  }
}
