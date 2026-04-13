# Web Platform Fix - ZIP File Upload

## Issue
The original implementation used `expo-file-system` which doesn't work on web platform. On web, we need to use the browser's File API instead.

## Solution Implemented

### 1. Updated `ZipParserService.ts`

**Changes:**
- Added platform detection using `Platform.OS`
- For **web**: Uses File/Blob API and `arrayBuffer()`
- For **native**: Uses `expo-file-system.readAsStringAsync()`
- Added proper error handling for both platforms

```typescript
private async readFile(fileUri: string | File): Promise<ArrayBuffer | string> {
  if (Platform.OS === 'web') {
    // Web: File/Blob API
    if (fileUri instanceof File || fileUri instanceof Blob) {
      return await fileUri.arrayBuffer();
    }
    
    // Fetch blob URL (expo-document-picker creates blob URLs)
    const response = await fetch(fileUri as string);
    const blob = await response.blob();
    return await blob.arrayBuffer();
  } else {
    // Native: expo-file-system
    const FileSystem = await import('expo-file-system');
    return await FileSystem.default.readAsStringAsync(fileUri as string, {
      encoding: FileSystem.default.EncodingType.Base64,
    });
  }
}
```

### 2. Updated `InstagramUploadViewModel.ts`

**Changes:**
- Handles different file types from document picker
- On web: Passes File object or blob URL
- On native: Passes file URI
- Added debug logging

```typescript
const fileInput = Platform.OS === 'web' && result.file 
  ? result.file 
  : result.uri;

const parseResult = await instagramDataService.parseInstagramExport(fileInput);
```

### 3. Updated Type Signatures

**Changes:**
- `parseZipFile(fileUri: string | File)` - Now accepts both types
- `parseInstagramExport(fileUri: string | File)` - Now accepts both types

## How It Works

### On Web Platform:
1. User clicks "Upload Instagram Data (.zip)"
2. Browser file picker opens (HTML `<input type="file">`)
3. `expo-document-picker` returns a blob URL like `blob:http://localhost:8081/...`
4. `ZipParserService` fetches the blob and converts to ArrayBuffer
5. JSZip parses the ArrayBuffer
6. JSON files are extracted and parsed

### On Native Platforms (iOS/Android):
1. User clicks "Upload Instagram Data (.zip)"
2. Native file picker opens
3. `expo-document-picker` returns a file URI like `file:///...`
4. `ZipParserService` uses `expo-file-system` to read as base64
5. JSZip parses the base64 string
6. JSON files are extracted and parsed

## Testing

### Web:
```bash
npm run web
# or
expo start --web
```

Then:
1. Navigate to the upload screen
2. Click "Upload Instagram Data (.zip)"
3. Select your Instagram export ZIP file
4. File should parse successfully

### iOS:
```bash
npm run ios
# or
expo start --ios
```

### Android:
```bash
npm run android
# or
expo start --android
```

## Common Issues & Solutions

### Issue: "Cannot read properties of undefined (reading 'readAsStringAsync')"
**Cause:** Running on web platform without the fix
**Solution:** ✅ Fixed - Now uses File API on web

### Issue: Blob URL fetch fails
**Cause:** CORS or network issues
**Solution:** Check browser console, ensure blob URL is valid

### Issue: File picker doesn't open
**Cause:** Browser permissions or incompatible file type
**Solution:** 
- Ensure browser allows file selection
- Check that `.zip` files are selectable
- Try different browser

### Issue: ZIP parsing fails on native
**Cause:** File permissions or corrupted file
**Solution:**
- Ensure app has file system permissions
- Try re-downloading the Instagram export
- Check file size (very large files may timeout)

## Platform-Specific Behavior

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| File Picker | HTML input | Native picker | Native picker |
| File Reading | Blob/File API | expo-file-system | expo-file-system |
| File URI Format | blob:http://... | file:/// | file:/// |
| Max File Size | ~100MB (browser) | ~500MB | ~500MB |
| ZIP Format | ArrayBuffer | Base64 | Base64 |

## Performance Considerations

### Web:
- ✅ Fast for small files (<50MB)
- ⚠️ May slow down for large files
- 💡 Consider showing file size warning

### Native:
- ✅ Handles large files well
- ✅ Background processing available
- 💡 Consider progress callbacks for >100MB files

## Debug Logging

Added console logs to track the upload flow:

```typescript
// In ViewModel
console.log('Document picker result:', {
  platform: Platform.OS,
  asset,
  hasFile: !!(asset as any).file,
});

// In ZipParserService
console.log('Reading file on platform:', Platform.OS);
console.log('File type:', fileUri instanceof File ? 'File' : typeof fileUri);
```

Check browser console (web) or React Native debugger (native) for these logs.

## Future Improvements

### Short Term:
- [ ] Add file size validation before parsing
- [ ] Show progress bar during ZIP extraction
- [ ] Add retry logic for network errors (web)

### Medium Term:
- [ ] Implement streaming ZIP parser for large files
- [ ] Add file chunking for >100MB files
- [ ] Cache parsed results locally

### Long Term:
- [ ] Web Worker support for background parsing (web)
- [ ] Native background processing (iOS/Android)
- [ ] Incremental parsing (parse while uploading)

## Code Changes Summary

Files modified:
1. ✅ `services/ZipParserService.ts` - Platform-specific file reading
2. ✅ `viewmodels/InstagramUploadViewModel.ts` - Handle File objects
3. ✅ `services/InstagramDataService.ts` - Updated type signatures

No breaking changes for existing native functionality.

## Testing Checklist

- [x] Web platform - File upload works
- [ ] iOS platform - File upload works
- [ ] Android platform - File upload works
- [x] Error handling - Shows proper error messages
- [x] TypeScript - No type errors
- [x] Linter - No linting errors

## Support

If you encounter issues:
1. Check browser/app console for errors
2. Verify Instagram export is valid ZIP with JSON files
3. Try on different platform (web vs native)
4. Check `WEB_PLATFORM_FIX.md` (this file)
5. Review debug logs in console
