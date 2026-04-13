export interface Follower {
    username: string;
    profileUrl: string;
    timestamp: number;
}

export interface FollowerRaw {
    title: string;
    media_list_data: unknown[];
    string_list_data: {
        href: string;
        value: string;
        timestamp: number;
    }[];
}

export function parseFollower(raw: FollowerRaw): Follower | null {
    if (!raw.string_list_data || raw.string_list_data.length === 0) {
        return null;
    }

    const data = raw.string_list_data[0];

    return {
        username: data.value,
        profileUrl: data.href,
        timestamp: data.timestamp,
    };
}

export function parseFollowers(rawData: FollowerRaw[]): Follower[] {
    return rawData
        .map(parseFollower)
        .filter((follower): follower is Follower => follower !== null);
}
