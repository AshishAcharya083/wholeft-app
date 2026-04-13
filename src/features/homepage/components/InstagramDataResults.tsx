import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { LineChart, RadarChart } from 'react-native-gifted-charts';

import {
  FollowersGrowthPoint,
  InstagramData,
  calculateSummary,
  getFollowersGrowth,
  getNotFollowingBackList,
} from '../entities';

const BRAND = {
  accentCyan: '#29A0B3',
  accentPink: '#EC339D',
  backgroundDark: '#1a1d23',
  cardDark: '#252830',
  mutedTextDark: '#C5C9D3',
};

const LINE_CHART_HEIGHT = 180;
const RADAR_SIZE = 220;

const AD_INSIGHTS = {
  ads: 420,
  posts: 890,
  categories: ['Tech', 'Fashion', 'Design', 'Finance', 'Lifestyle'],
};

interface InstagramDataResultsProps {
  data: InstagramData;
  isDark: boolean;
  onUploadNewFile: () => void;
}

export function InstagramDataResults({ data, isDark, onUploadNewFile }: InstagramDataResultsProps) {
  const colors = getColors(isDark);
  const summary = calculateSummary(data);
  const notFollowingBackList = getNotFollowingBackList(data);
  const followersGrowth = getFollowersGrowth(data);
  const growthDelta = followersGrowth.length > 0 ? followersGrowth[followersGrowth.length - 1].newFollowers : 0;
  const monthlyChartData = useMemo(() => buildGrowthChartData(followersGrowth), [followersGrowth]);
  const lineData = monthlyChartData.length ? monthlyChartData : [{ value: data.totalFollowers, label: 'Now' }];
  const recentNonFollowerCount = countRecentNonFollowers(notFollowingBackList);
  const topNonFollowers = notFollowingBackList.slice(0, 3);
  const engagementPersona = useMemo(
    () => buildEngagementPersona(data, notFollowingBackList, growthDelta),
    [data, notFollowingBackList, growthDelta]
  );

  const adsTotal = AD_INSIGHTS.ads + AD_INSIGHTS.posts;
  const adsPercent = Math.round((AD_INSIGHTS.ads / Math.max(1, adsTotal)) * 100);

  function openInstagramProfile(username: string) {
    const url = `https://www.instagram.com/${encodeURIComponent(username)}/`;
    Linking.openURL(url);
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.header, { borderColor: colors.divider, backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Insights</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>Now you know</Text>
      </View>

      <View style={[styles.card, { borderColor: colors.divider, backgroundColor: colors.cardBackground }]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>NON-FOLLOWERS</Text>
            <View style={styles.countRow}>
              <Text style={[styles.nonFollowerCount, { color: colors.text }]}>{summary.notFollowingBack.toLocaleString()}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+{recentNonFollowerCount} today</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardIcon}>
            <MaterialIcons name="person-off" size={24} color={BRAND.accentPink} />
          </View>
        </View>

        <View style={styles.nonFollowerList}>
          {topNonFollowers.length === 0 ? (
            <Text style={[styles.emptyLabel, { color: colors.mutedText }]}>Everyone you follow returns the favor.</Text>
          ) : (
            topNonFollowers.map((user) => (
              <Pressable
                key={user.username}
                style={styles.nonFollowerRow}
                onPress={() => openInstagramProfile(user.username)}
              >
                <View style={[styles.avatar, { backgroundColor: '#F4F6FB' }]}>
                  <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.nonFollowerInfo}>
                  <Text style={[styles.username, { color: colors.text }]}>{user.username}</Text>
                  <Text style={[styles.followingText, { color: colors.mutedText }]}>Following you</Text>
                </View>
                <Pressable
                  onPress={() => openInstagramProfile(user.username)}
                  style={[styles.unfollowButton, { borderColor: colors.divider }]}
                >
                  <Text style={[styles.unfollowText, { color: colors.text }]}>Unfollow</Text>
                </Pressable>
              </Pressable>
            ))
          )}
        </View>

        <Pressable style={[styles.ctaButton, { backgroundColor: BRAND.accentPink }]} onPress={onUploadNewFile}>
          <Text style={styles.ctaButtonText}>See All Non-Followers</Text>
        </Pressable>
      </View>

      <View style={[styles.card, { borderColor: colors.divider, backgroundColor: colors.cardBackground }]}>
        <View style={styles.subHeaderRow}>
          <MaterialIcons name="insights" size={20} color={BRAND.accentCyan} />
          <Text style={[styles.subHeaderTitle, { color: colors.text }]}>Ad Insights</Text>
        </View>
        <View style={styles.adDetailRow}>
          <View>
            <Text style={[styles.adLabel, { color: colors.mutedText }]}>Ads vs. Posts Viewed</Text>
            <Text style={[styles.adValue, { color: colors.text }]}>{adsPercent}% Ads</Text>
          </View>
          <Text style={[styles.adValueSecondary, { color: colors.mutedText }]}>Ads ({AD_INSIGHTS.ads}) · Posts ({AD_INSIGHTS.posts})</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.statBackground }]}>
          <View style={[styles.progressFill, { width: `${adsPercent}%`, backgroundColor: BRAND.accentPink }]} />
        </View>
        <View style={styles.chipRow}>
          {AD_INSIGHTS.categories.map((category) => (
            <View key={category} style={[styles.chip, { borderColor: colors.divider }]}>
              <Text style={[styles.chipText, { color: colors.text }]}>{category}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, styles.chartCard, { borderColor: colors.divider, backgroundColor: colors.cardBackground }]}>
        <View style={styles.chartHeading}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Follower Growth</Text>
          <Text style={[styles.growthLabel, { color: BRAND.accentPink }]}>+{growthDelta}%</Text>
        </View>
        <View style={styles.chartWrapper}>
          <LineChart
            data={lineData}
            curved
            areaChart
            spacing={30}
            thickness={3}
            hideRules
            hideDataPoints
            color={BRAND.accentPink}
            startFillColor="rgba(236,53,157,0.25)"
            endFillColor="rgba(236,53,157,0)"
            startOpacity={1}
            endOpacity={0}
            lineGradientDirection="vertical"
            xAxisTextNumberOfLines={1}
            yAxisColor="transparent"
            height={LINE_CHART_HEIGHT}
            showVerticalLines={false}
            showXAxisIndices={false}
            showYAxisIndices={false}
          />
        </View>
      </View>

      <View style={[styles.card, styles.chartCard, { borderColor: colors.divider, backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Engagement Persona</Text>
        <View style={styles.radarWrapper}>
          <RadarChart
            data={engagementPersona.values}
            labels={engagementPersona.labels}
            maxValue={100}
            startAngle={-90}
            circular
            gridConfig={{ stroke: colors.divider, strokeWidth: 1 }}
            polygonConfig={{
              stroke: BRAND.accentPink,
              strokeWidth: 2,
              fill: 'rgba(236,51,157,0.2)',
              opacity: 0.85,
            }}
            chartSize={RADAR_SIZE}
          />
        </View>
        <Text style={[styles.personaCaption, { color: colors.mutedText }]}>Balanced engagement profile</Text>
      </View>
    </View>
  );
}

function getColors(isDark: boolean) {
  return {
    cardBackground: isDark ? BRAND.cardDark : '#FFFFFF',
    cardBorder: isDark ? '#333743' : '#F3F4F6',
    text: isDark ? '#FFFFFF' : '#303338',
    mutedText: isDark ? BRAND.mutedTextDark : '#666B74',
    statBackground: isDark ? '#2a2d36' : '#F7F7F7',
    divider: isDark ? '#3a3f4b' : '#E5E7EB',
  };
}

function buildGrowthChartData(points: FollowersGrowthPoint[]) {
  const monthlyMap = new Map<string, { label: string; value: number; order: number }>();
  const monthOrder: string[] = [];

  points.forEach((point) => {
    const date = new Date(point.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleDateString(undefined, { month: 'short' });

    if (!monthlyMap.has(key)) {
      monthOrder.push(key);
    }

    monthlyMap.set(key, {
      label,
      value: point.cumulativeFollowers,
      order: date.getTime(),
    });
  });

  const monthly = monthOrder
    .map((key) => monthlyMap.get(key))
    .filter(Boolean) as { label: string; value: number; order: number }[];

  const recent = monthly.slice(-5);
  return recent.map(({ label, value }) => ({ label, value }));
}

function countRecentNonFollowers(notFollowing: { timestamp: number }[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = Math.floor(today.getTime() / 1000);
  return notFollowing.filter((item) => item.timestamp >= cutoff).length;
}

function buildEngagementPersona(
  data: InstagramData,
  notFollowingBackList: { timestamp: number }[],
  growthDelta: number
) {
  const total = Math.max(data.totalFollowers + data.totalFollowing, 1);
  const relativeFollowers = (data.totalFollowers / total) * 100;
  const nonFollowerRatio = Math.min(notFollowingBackList.length / Math.max(data.totalFollowing, 1), 1);

  const values = [
    clamp(65 + relativeFollowers * 0.1, 30, 100),
    clamp(55 + (growthDelta / Math.max(data.totalFollowers, 1)) * 60, 30, 100),
    clamp(60 - nonFollowerRatio * 15, 25, 90),
    clamp(50 + nonFollowerRatio * 35, 25, 95),
    clamp(70 - nonFollowerRatio * 25, 30, 90),
  ];

  return {
    labels: ['Likes', 'Comments', 'Saves', 'DMs', 'Shares'],
    values,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  header: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  nonFollowerCount: {
    fontSize: 36,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: '#FFE3E8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#EC339D',
    fontSize: 12,
    fontWeight: '600',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F6EBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nonFollowerList: {
    paddingVertical: 4,
    gap: 8,
  },
  emptyLabel: {
    fontSize: 13,
  },
  nonFollowerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  nonFollowerInfo: {
    flex: 1,
    gap: 0,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
  },
  followingText: {
    fontSize: 12,
  },
  unfollowButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  unfollowText: {
    fontWeight: '600',
  },
  ctaButton: {
    marginTop: 4,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  adDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
  },
  adLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '700',
  },
  adValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  adValueSecondary: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    paddingVertical: 18,
  },
  chartHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  growthLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  chartWrapper: {
    marginTop: 6,
    alignItems: 'center',
  },
  radarWrapper: {
    marginTop: 8,
    alignItems: 'center',
  },
  personaCaption: {
    fontSize: 12,
    marginTop: 8,
  },
});
