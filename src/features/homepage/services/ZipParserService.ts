import JSZip from 'jszip';
import { Platform } from 'react-native';
import { File } from 'expo-file-system';

export interface ZipFileEntry {
  path: string;
  content: string;
}

export class ZipParserService {
  /**
   * Parse a ZIP file and extract its contents
   * @param fileUri - URI of the ZIP file to parse (or File object on web)
   * @returns Promise resolving to an array of file entries
   */
  async parseZipFile(fileUri: string | globalThis.File): Promise<ZipFileEntry[]> {
    try {
      // Read the file based on platform
      const zipData = await this.readFile(fileUri);
      
      // Load the ZIP file
      const zip = await JSZip.loadAsync(zipData);
      
      // Extract all files
      const files: ZipFileEntry[] = [];
      
      for (const [path, zipEntry] of Object.entries(zip.files)) {
        // Skip directories
        if (zipEntry.dir) {
          continue;
        }
        
        // Only process JSON files
        if (!path.endsWith('.json')) {
          continue;
        }
        
        // Read file content as text
        const content = await zipEntry.async('text');
        
        files.push({
          path,
          content,
        });
      }
      
      return files;
    } catch (error) {
      console.error('Error parsing ZIP file:', error);
      throw new Error(
        `Failed to parse ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  
  /**
   * Find a specific file in the extracted files
   * @param files - Array of extracted files
   * @param pathPattern - Path pattern to match (can be partial)
   * @returns The file entry if found, null otherwise
   */
  findFile(files: ZipFileEntry[], pathPattern: string): ZipFileEntry | null {
    return files.find((file) => file.path.includes(pathPattern)) || null;
  }
  
  /**
   * Parse JSON content from a file entry
   * @param file - File entry to parse
   * @returns Parsed JSON object
   */
  parseJsonContent<T>(file: ZipFileEntry): T {
    try {
      return JSON.parse(file.content) as T;
    } catch (error) {
      console.error(`Error parsing JSON from ${file.path}:`, error);
      throw new Error(
        `Failed to parse JSON from ${file.path}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Read file based on platform
   * Web: Uses File API (file is already a Blob/File object)
   * Native: Uses expo-file-system new File API
   */
  private async readFile(fileUri: string | globalThis.File): Promise<ArrayBuffer | Uint8Array> {
    if (Platform.OS === 'web') {
      if (isBlobLike(fileUri)) {
        return await fileUri.arrayBuffer();
      }
      
      // If it's a string URL on web, try to fetch it as a blob
      try {
        const response = await fetch(fileUri as string);
        const blob = await response.blob();
        return await blob.arrayBuffer();
      } catch (error) {
        console.error('Error fetching file on web:', error);
        throw new Error('Failed to read file on web platform');
      }
    } else {
      // On native platforms, use expo-file-system new File API to read as bytes
      try {
        const file = new File(fileUri as string);
        const bytes = await file.bytes();
        return bytes;
      } catch (error) {
        console.error('Error reading file on native:', error);
        throw new Error('Failed to read file on native platform');
      }
    }
  }
}

export const zipParserService = new ZipParserService();

function isBlobLike(value: unknown): value is { arrayBuffer: () => Promise<ArrayBuffer> } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer === 'function'
  );
}
