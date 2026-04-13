import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from './GradientButton';

type HomepageUploadCardProps = {
  isDark: boolean;
  onUploadPress: () => void;
  onHowToPress: () => void;
};

const BRAND = {
  accentCyan: '#29A0B3',
  backgroundDark: '#1a1d23',
  cardDark: '#252830',
  navDark: '#1e2128',
  mutedTextDark: '#C5C9D3',
};

function getColors(isDark: boolean) {
  return {
    cardBackground: isDark ? BRAND.cardDark : '#FFFFFF',
    cardBorder: isDark ? '#333743' : '#F3F4F6',
    visualBackground: isDark ? '#2a2d36' : '#F7F7F7',
    listCardBackground: isDark ? '#1e2128' : '#FFFFFF',
    listCardBorder: isDark ? '#3a3f4b' : '#F3F4F6',
    mutedText: isDark ? BRAND.mutedTextDark : '#666B74',
    secondaryText: isDark ? '#D0D4DD' : '#666B74',
    secondaryIcon: isDark ? '#9CA3AF' : '#9CA3AF',
    secondaryHover: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(17,24,28,0.04)',
    skeleton1: isDark ? '#3A3F4B' : '#E5E7EB',
    skeleton2: isDark ? '#2F3440' : '#F3F4F6',
    avatar: isDark ? '#2F3440' : '#EEF0F3',
    remove: '#F87171',
  };
}

function SkeletonRow({ isDark, faded = false }: { isDark: boolean; faded?: boolean }) {
  const colors = getColors(isDark);

  return (
    <View style={[styles.row, faded && styles.rowFaded]}>
      <View style={[styles.avatar, { backgroundColor: colors.avatar }]} />
      <View style={styles.rowLines}>
        <View style={[styles.line, { backgroundColor: colors.skeleton1, width: '68%' }]} />
        <View style={[styles.lineSmall, { backgroundColor: colors.skeleton2, width: '40%' }]} />
      </View>
      <MaterialIcons color={colors.remove} name="remove-circle" size={18} />
    </View>
  );
}

export function HomepageUploadCard({ isDark, onUploadPress, onHowToPress }: HomepageUploadCardProps) {
  const colors = getColors(isDark);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
      <View style={[styles.visual, { backgroundColor: colors.visualBackground }]}>
        <View style={styles.topRightDots}>
          <View style={[styles.smallDot, { backgroundColor: 'rgba(41,160,179,0.20)' }]} />
          <View style={[styles.smallDot, { backgroundColor: 'rgba(236,51,157,0.20)' }]} />
        </View>

        <View style={styles.chart}>
          <View style={[styles.chartLine, { backgroundColor: BRAND.accentCyan }]} />
          <View style={[styles.chartDot, styles.chartDotMid, { borderColor: BRAND.accentCyan }]} />
          <View style={[styles.chartDot, styles.chartDotEnd, { borderColor: BRAND.accentCyan }]} />
        </View>

        <View
          style={[
            styles.listCard,
            { backgroundColor: colors.listCardBackground, borderColor: colors.listCardBorder },
          ]}>
          <SkeletonRow isDark={isDark} />
          <SkeletonRow faded isDark={isDark} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.microcopy, { color: colors.mutedText }]}>
          Your privacy comes first. Upload your Instagram data zip file locally to see who stopped
          following, track your growth, and analyze your audience without ever logging in.
        </Text>

        <View style={styles.buttons}>
          <GradientButton iconName="folder-zip" onPress={onUploadPress} title="Upload Instagram Data (.zip)" />

          <Pressable
            accessibilityRole="button"
            onPress={onHowToPress}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { backgroundColor: colors.secondaryHover },
            ]}>
            <MaterialIcons color={colors.secondaryIcon} name="help-outline" size={18} style={styles.secondaryIcon} />
            <Text style={[styles.secondaryText, { color: colors.secondaryText }]}>
              How to get my data from Instagram?
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  visual: {
    height: 240,
    paddingTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  topRightDots: {
    position: 'absolute',
    top: 14,
    right: 16,
    flexDirection: 'row',
    gap: 6,
  },
  smallDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  chart: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    marginBottom: 14,
  },
  chartLine: {
    height: 2,
    borderRadius: 999,
    opacity: 0.9,
  },
  chartDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 2,
  },
  chartDotMid: {
    left: '52%',
  },
  chartDotEnd: {
    left: '94%',
  },
  listCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFaded: {
    opacity: 0.6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    marginRight: 12,
  },
  rowLines: {
    flex: 1,
    gap: 6,
  },
  line: {
    height: 10,
    borderRadius: 999,
  },
  lineSmall: {
    height: 8,
    borderRadius: 999,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  microcopy: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttons: {
    gap: 10,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryIcon: {
    marginRight: 8,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

