# Quick Start Guide - Instagram Data Parser

## For Developers

### Using the Feature in Your Code

#### 1. Access the Parsed Data

```typescript
import { useInstagramDataStore, selectData, selectSummary } from '@/src/features/homepage/store';

function MyComponent() {
  // Get the parsed data
  const data = useInstagramDataStore(selectData);
  const summary = useInstagramDataStore(selectSummary);
  
  if (!data) {
    return <Text>No data uploaded yet</Text>;
  }
  
  return (
    <View>
      <Text>Followers: {data.totalFollowers}</Text>
      <Text>Following: {data.totalFollowing}</Text>
      <Text>Not following back: {summary?.notFollowingBack}</Text>
    </View>
  );
}
```

#### 2. Trigger Upload Flow

```typescript
import { instagramUploadViewModel } from '@/src/features/homepage/viewmodels';
import { useInstagramDataStore, selectIsUploading } from '@/src/features/homepage/store';

function UploadButton() {
  const isUploading = useInstagramDataStore(selectIsUploading);
  
  const handleUpload = async () => {
    await instagramUploadViewModel.handleUploadZip();
  };
  
  return (
    <Button 
      onPress={handleUpload} 
      disabled={isUploading}
      title={isUploading ? "Uploading..." : "Upload ZIP"}
    />
  );
}
```

#### 3. Access Individual Lists

```typescript
import { useInstagramDataStore } from '@/src/features/homepage/store';
import { instagramDataService } from '@/src/features/homepage/services';

function UnfollowersScreen() {
  const data = useInstagramDataStore((state) => state.data);
  
  if (!data) return null;
  
  // Get people who don't follow you back
  const notFollowingBack = instagramDataService.getNotFollowingBack(data);
  
  return (
    <FlatList
      data={notFollowingBack}
      renderItem={({ item }) => (
        <View>
          <Text>{item.username}</Text>
          <Text>{new Date(item.timestamp * 1000).toLocaleDateString()}</Text>
        </View>
      )}
    />
  );
}
```

#### 4. Clear Data

```typescript
import { instagramUploadViewModel } from '@/src/features/homepage/viewmodels';

function ClearDataButton() {
  const handleClear = () => {
    instagramUploadViewModel.clearData();
  };
  
  return <Button onPress={handleClear} title="Clear Data" />;
}
```

### Store API Reference

#### State

```typescript
interface InstagramDataState {
  // The parsed Instagram data
  data: InstagramData | null;
  
  // Calculated summary statistics
  summary: InstagramDataSummary | null;
  
  // Upload progress and status
  uploadState: {
    isUploading: boolean;
    progress: number;      // 0-100
    error: string | null;
  };
}
```

#### Actions

```typescript
// Set parsed data (automatically calculates summary)
setData(data: InstagramData): void

// Clear all data
clearData(): void

// Update upload state
setUploadState(state: Partial<UploadState>): void

// Reset upload state to initial
resetUploadState(): void
```

#### Selectors

```typescript
// Pre-built selectors for common use cases
selectData           // Get the Instagram data
selectSummary        // Get the calculated summary
selectUploadState    // Get the full upload state
selectIsUploading    // Get just the uploading boolean
selectUploadError    // Get just the error message
```

### ViewModel API Reference

```typescript
class InstagramUploadViewModel {
  // Main upload flow
  async handleUploadZip(): Promise<void>
  
  // Clear all data
  clearData(): void
  
  // Retry after error
  async retryUpload(): Promise<void>
}

// Singleton instance
export const instagramUploadViewModel = new InstagramUploadViewModel();
```

### Service API Reference

#### InstagramDataService

```typescript
class InstagramDataService {
  // Parse Instagram export ZIP
  async parseInstagramExport(fileUri: string): Promise<ParseResult>
  
  // Validate export structure
  validateInstagramExport(files: ZipFileEntry[]): boolean
  
  // Get unfollowers
  getNotFollowingBack(data: InstagramData): Following[]
  
  // Get people you don't follow back
  getNotFollowedBack(data: InstagramData): Follower[]
}

// Singleton instance
export const instagramDataService = new InstagramDataService();
```

#### ZipParserService

```typescript
class ZipParserService {
  // Parse ZIP file
  async parseZipFile(fileUri: string): Promise<ZipFileEntry[]>
  
  // Find file by path pattern
  findFile(files: ZipFileEntry[], pathPattern: string): ZipFileEntry | null
  
  // Parse JSON from file
  parseJsonContent<T>(file: ZipFileEntry): T
}

// Singleton instance
export const zipParserService = new ZipParserService();
```

## For Users

### How to Get Your Instagram Data

1. **Open Instagram App**
   - Go to your profile
   - Tap the menu (☰)
   - Select "Settings and Privacy"

2. **Request Your Data**
   - Tap "Accounts Center"
   - Select "Your information and permissions"
   - Tap "Download your information"
   - Select "Download or transfer information"

3. **Configure Download**
   - Select your Instagram account
   - Choose "Download to device"
   - Select date range: "All time"
   - Format: **JSON** (important!)
   - Media quality: Low (optional, we only need the data)

4. **Wait for Email**
   - Instagram will process your request
   - You'll receive an email (usually within 48 hours)
   - The email contains a download link

5. **Download ZIP File**
   - Click the link in the email
   - Download the ZIP file to your device
   - Keep it secure (contains personal data)

6. **Upload to WhoLeft**
   - Open WhoLeft app
   - Tap "Upload Instagram Data (.zip)"
   - Select the downloaded ZIP file
   - Wait for parsing to complete

### What Data Is Analyzed

- ✅ Followers list (who follows you)
- ✅ Following list (who you follow)
- ✅ Timestamps of when you followed/were followed
- ❌ No login credentials
- ❌ No messages content
- ❌ No media files
- ❌ Data never leaves your device (for now)

### Privacy

- **All processing happens on your device**
- **No data is uploaded to servers** (in current version)
- **Your login credentials are never accessed**
- **Instagram data stays private**

## Troubleshooting

### "Failed to parse ZIP file"
- Ensure you downloaded the **JSON format** (not HTML)
- Check that the ZIP file is complete and not corrupted
- Try downloading the export again

### "Followers file not found"
- Your export might be incomplete
- Request a new export from Instagram
- Ensure you selected "All time" date range

### "Following file not found"
- Same as above - request a new export
- Ensure the ZIP file is the complete Instagram export

### App crashes during parsing
- File might be too large
- Try closing other apps
- Restart the app and try again

### No data shown after upload
- Check for error messages
- Look in console logs for details
- Try uploading again

## Examples

### Complete Upload Flow Example

```typescript
import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { 
  useInstagramDataStore, 
  selectData, 
  selectUploadState 
} from '@/src/features/homepage/store';
import { instagramUploadViewModel } from '@/src/features/homepage/viewmodels';

export function MyUploadScreen() {
  const data = useInstagramDataStore(selectData);
  const uploadState = useInstagramDataStore(selectUploadState);
  
  const handleUpload = async () => {
    await instagramUploadViewModel.handleUploadZip();
  };
  
  if (uploadState.isUploading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Uploading... {uploadState.progress}%</Text>
      </View>
    );
  }
  
  if (uploadState.error) {
    return (
      <View>
        <Text>Error: {uploadState.error}</Text>
        <Button 
          title="Try Again" 
          onPress={() => instagramUploadViewModel.retryUpload()} 
        />
      </View>
    );
  }
  
  if (data) {
    return (
      <View>
        <Text>Followers: {data.totalFollowers}</Text>
        <Text>Following: {data.totalFollowing}</Text>
        <Button 
          title="Upload New File" 
          onPress={handleUpload} 
        />
      </View>
    );
  }
  
  return (
    <Button 
      title="Upload Instagram Data" 
      onPress={handleUpload} 
    />
  );
}
```

### Analysis Example

```typescript
import { useInstagramDataStore } from '@/src/features/homepage/store';
import { instagramDataService } from '@/src/features/homepage/services';

export function AnalysisScreen() {
  const data = useInstagramDataStore((state) => state.data);
  
  if (!data) return <Text>No data</Text>;
  
  const notFollowingBack = instagramDataService.getNotFollowingBack(data);
  const notFollowedBack = instagramDataService.getNotFollowedBack(data);
  
  return (
    <View>
      <Section title="Not Following You Back">
        {notFollowingBack.map(user => (
          <UserCard key={user.username} user={user} />
        ))}
      </Section>
      
      <Section title="You Don't Follow Back">
        {notFollowedBack.map(user => (
          <UserCard key={user.username} user={user} />
        ))}
      </Section>
    </View>
  );
}
```

## Need Help?

- Check the detailed `README.md` in the feature folder
- Review `IMPLEMENTATION_SUMMARY.md` for architecture details
- Look at the inline code comments
- Check TypeScript types for API details
