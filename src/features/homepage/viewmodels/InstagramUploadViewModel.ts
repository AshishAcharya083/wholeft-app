import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { instagramDataService } from '../services';
import { useInstagramDataStore } from '../store';

export class InstagramUploadViewModel {
  private store = useInstagramDataStore;
  
  /**
   * Handle ZIP file selection and upload
   */
  async handleUploadZip(): Promise<void> {
    try {
      // Update state to uploading
      this.store.getState().setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
      });
      
      // Step 1: Pick document
      const result = await this.pickDocument();
      
      if (!result) {
        // User cancelled
        this.store.getState().resetUploadState();
        return;
      }
      
      // Update progress
      this.store.getState().setUploadState({ progress: 20 });
      
      // Step 2: Parse the ZIP file
      // On web, pass the File object; on native, pass the URI
      const fileInput = Platform.OS === 'web' && result.file 
        ? result.file 
        : result.uri;
      
      const parseResult = await instagramDataService.parseInstagramExport(fileInput);
      
      if (!parseResult.success || !parseResult.data) {
        throw new Error(parseResult.error || 'Failed to parse Instagram export');
      }
      
      // Update progress
      this.store.getState().setUploadState({ progress: 80 });
      
      // Step 3: Store the data
      this.store.getState().setData(parseResult.data);
      
      console.log('Successfully parsed Instagram data:', {
        followers: parseResult.data.totalFollowers,
        following: parseResult.data.totalFollowing,
      });
    } catch (error) {
      console.error('Error uploading ZIP:', error);
      
      this.store.getState().setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }
  
  /**
   * Pick a document using Expo Document Picker
   */
  private async pickDocument(): Promise<(DocumentPicker.DocumentPickerAsset & { file?: File }) | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'web' ? '.zip' : 'application/zip',
        copyToCacheDirectory: Platform.OS !== 'web',
      });
      
      if (result.canceled) {
        return null;
      }
      
      const asset = result.assets[0];
      
      // Debug logging
      console.log('Document picker result:', {
        platform: Platform.OS,
        asset,
        hasFile: !!(asset as any).file,
      });
      
      // On web, the file property might contain the File object
      if (Platform.OS === 'web' && (asset as any).file) {
        return {
          ...asset,
          file: (asset as any).file,
        };
      }
      
      return asset;
    } catch (error) {
      console.error('Error picking document:', error);
      throw new Error('Failed to pick document');
    }
  }
  
  /**
   * Clear all data
   */
  clearData(): void {
    this.store.getState().clearData();
  }
  
  /**
   * Retry upload after error
   */
  async retryUpload(): Promise<void> {
    this.store.getState().resetUploadState();
    await this.handleUploadZip();
  }
}

export const instagramUploadViewModel = new InstagramUploadViewModel();
