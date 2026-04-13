import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { HomepageUploadCard } from '@/src/features/homepage/components/HomepageUploadCard';
import { InstagramDataResults } from '@/src/features/homepage/components/InstagramDataResults';
import { instagramUploadViewModel } from '@/src/features/homepage/viewmodels';
import { useInstagramDataStore, selectData, selectUploadState } from '@/src/features/homepage/store';
import { PieChart } from 'react-native-gifted-charts';

export default function HomepageUploadZip() {
  const isDark = useColorScheme() === 'dark';
  
  // Get state from Zustand store
  const data = useInstagramDataStore(selectData);
  const uploadState = useInstagramDataStore(selectUploadState);

  const progressValue = Math.min(Math.max(uploadState.progress, 0), 100);
  const progressData = [
    {
      value: progressValue,
      color: '#EC339D',
    },
    {
      value: 100 - progressValue,
      color: isDark ? '#1E2127' : '#E5E7EB',
    },
  ];

  const handleUploadPress = async () => {
    try {
      await instagramUploadViewModel.handleUploadZip();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleHowToPress = () => {
    Alert.alert(
      'How to get your data',
      'Go to Instagram Settings → Security → Download Your Information and request a JSON export. You will receive a ZIP file via email.',
      [{ text: 'Got it' }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1a1d23' : '#f7f7f7' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#303338' }]}>
              Who Left?{'\n'}Now You Know
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#A7AFBE' : '#666B74' }]}>
              No login. Just insights.
            </Text>
          </View>

          <View style={styles.cardWrap}>
            {/* Show loading state */}
            {uploadState.isUploading && (
              <View style={styles.loadingContainer}>
                <View style={styles.progressContainer}>
                  <PieChart
                    data={progressData}
                    donut
                    innerRadius={58}
                    radius={78}
                    showGradient
                    gradientCenterColor="rgba(236, 51, 157, 0.35)"
                    backgroundColor={isDark ? '#101217' : '#FFFFFF'}
                    strokeWidth={12}
                    centerLabelComponent={() => (
                      <View style={styles.progressCenter}>
                        <Text style={[styles.progressPercent, { color: isDark ? '#FFFFFF' : '#303338' }]}>
                          {progressValue}%
                        </Text>
                        <Text style={[styles.progressLabel, { color: isDark ? '#A7AFBE' : '#666B74' }]}>
                          Parsing
                        </Text>
                      </View>
                    )}
                  />
                </View>
                <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#303338' }]}>
                  Parsing your Instagram data...
                </Text>
                <Text style={[styles.progressText, { color: isDark ? '#A7AFBE' : '#666B74' }]}>
                  {progressValue}%
                </Text>
              </View>
            )}

            {/* Show error state */}
            {uploadState.error && !uploadState.isUploading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {uploadState.error}</Text>
              </View>
            )}

            {/* Show upload card if no data yet */}
            {!data && !uploadState.isUploading && (
              <HomepageUploadCard
                isDark={isDark}
                onHowToPress={handleHowToPress}
                onUploadPress={handleUploadPress}
              />
            )}

            {/* Show results if data is available */}
            {data && !uploadState.isUploading && (
              <InstagramDataResults
                data={data}
                isDark={isDark}
                onUploadNewFile={handleUploadPress}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardWrap: {
    width: '100%',
    maxWidth: 420,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(41, 160, 179, 0.1)',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressCenter: {
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
  },
});
