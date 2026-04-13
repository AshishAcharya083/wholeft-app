import { create } from 'zustand';
import { InstagramData, InstagramDataSummary, calculateSummary } from '../entities';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface InstagramDataState {
  // Data
  data: InstagramData | null;
  summary: InstagramDataSummary | null;
  
  // Upload state
  uploadState: UploadState;
  
  // Actions
  setData: (data: InstagramData) => void;
  clearData: () => void;
  setUploadState: (state: Partial<UploadState>) => void;
  resetUploadState: () => void;
}

const initialUploadState: UploadState = {
  isUploading: false,
  progress: 0,
  error: null,
};

export const useInstagramDataStore = create<InstagramDataState>((set, get) => ({
  // Initial state
  data: null,
  summary: null,
  uploadState: initialUploadState,
  
  // Actions
  setData: (data: InstagramData) => {
    const summary = calculateSummary(data);
    set({
      data,
      summary,
      uploadState: {
        isUploading: false,
        progress: 100,
        error: null,
      },
    });
  },
  
  clearData: () => {
    set({
      data: null,
      summary: null,
      uploadState: initialUploadState,
    });
  },
  
  setUploadState: (state: Partial<UploadState>) => {
    set({
      uploadState: {
        ...get().uploadState,
        ...state,
      },
    });
  },
  
  resetUploadState: () => {
    set({
      uploadState: initialUploadState,
    });
  },
}));

// Selectors
export const selectData = (state: InstagramDataState) => state.data;
export const selectSummary = (state: InstagramDataState) => state.summary;
export const selectUploadState = (state: InstagramDataState) => state.uploadState;
export const selectIsUploading = (state: InstagramDataState) => state.uploadState.isUploading;
export const selectUploadError = (state: InstagramDataState) => state.uploadState.error;
