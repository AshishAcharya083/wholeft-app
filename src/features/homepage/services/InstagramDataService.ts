import { Follower, parseFollowers, FollowerRaw } from '../entities/Follower';
import { Following, parseFollowing, FollowingRaw } from '../entities/Following';
import {
  InstagramData,
  createInstagramData,
  getFollowersGrowth,
  getNotFollowedBackList,
  getNotFollowingBackList,
} from '../entities/InstagramData';
import { zipParserService, ZipFileEntry } from './ZipParserService';

export interface ParseResult {
  success: boolean;
  data?: InstagramData;
  error?: string;
}

export class InstagramDataService {
  private readonly FOLLOWERS_PATH = 'connections/followers_and_following/followers_1.json';
  private readonly FOLLOWING_PATH = 'connections/followers_and_following/following.json';
  
  /**
   * Parse Instagram export ZIP file and extract followers/following data
   * @param fileUri - URI of the ZIP file (string on native, File on web)
   * @returns Parse result with data or error
   */
  async parseInstagramExport(fileUri: string | File): Promise<ParseResult> {
    try {
      // Step 1: Extract ZIP file
      const files = await zipParserService.parseZipFile(fileUri);
      
      if (files.length === 0) {
        return {
          success: false,
          error: 'ZIP file is empty or contains no JSON files',
        };
      }
      
      // Step 2: Find and parse followers file
      const followersFile = zipParserService.findFile(files, this.FOLLOWERS_PATH);
      if (!followersFile) {
        return {
          success: false,
          error: `Followers file not found. Expected path: ${this.FOLLOWERS_PATH}`,
        };
      }
      
      const followersRaw = zipParserService.parseJsonContent<FollowerRaw[]>(followersFile);
      const followers = parseFollowers(followersRaw);
      
      // Step 3: Find and parse following file
      const followingFile = zipParserService.findFile(files, this.FOLLOWING_PATH);
      if (!followingFile) {
        return {
          success: false,
          error: `Following file not found. Expected path: ${this.FOLLOWING_PATH}`,
        };
      }
      
      const followingRaw = zipParserService.parseJsonContent<FollowingRaw>(followingFile);
      const following = parseFollowing(followingRaw);
      
      // Step 4: Create Instagram data object
      const instagramData = createInstagramData(followers, following);
      
      return {
        success: true,
        data: instagramData,
      };
    } catch (error) {
      console.error('Error parsing Instagram export:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
  
  /**
   * Validate if a ZIP file contains valid Instagram export data
   * @param files - Extracted ZIP file entries
   * @returns True if valid, false otherwise
   */
  validateInstagramExport(files: ZipFileEntry[]): boolean {
    const hasFollowers = files.some((file) => file.path.includes(this.FOLLOWERS_PATH));
    const hasFollowing = files.some((file) => file.path.includes(this.FOLLOWING_PATH));
    
    return hasFollowers && hasFollowing;
  }
  
  /**
   * Get users who don't follow back
   * @param data - Instagram data
   * @returns List of users you follow who don't follow you back
   */
  getNotFollowingBack(data: InstagramData): Following[] {
    return getNotFollowingBackList(data);
  }
  
  /**
   * Get users you don't follow back
   * @param data - Instagram data
   * @returns List of users who follow you but you don't follow back
   */
  getNotFollowedBack(data: InstagramData): Follower[] {
    return getNotFollowedBackList(data);
  }

  /**
   * Get followers growth data per day
   * @param data - Instagram data
   */
  getFollowersGrowth(data: InstagramData) {
    return getFollowersGrowth(data);
  }
}

export const instagramDataService = new InstagramDataService();
