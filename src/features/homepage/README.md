# Homepage Feature - Instagram Data Parser

This feature implements a robust, layered architecture for parsing Instagram export ZIP files and analyzing follower/following data.

## Architecture

The implementation follows a clean, feature-based architecture with clear separation of concerns:

```
homepage/
├── entities/           # Data models and business logic
│   ├── Follower.ts    # Follower entity and parsing logic
│   ├── Following.ts   # Following entity and parsing logic
│   └── InstagramData.ts # Aggregate data model and calculations
│
├── services/          # Business services
│   ├── ZipParserService.ts        # ZIP file extraction
│   └── InstagramDataService.ts    # Instagram data parsing
│
├── store/             # State management (Zustand)
│   └── useInstagramDataStore.ts   # Global state store
│
├── viewmodels/        # Controllers/ViewModels
│   └── InstagramUploadViewModel.ts # Upload flow controller
│
├── components/        # UI components
│   ├── HomepageUploadCard.tsx     # Upload UI card
│   ├── InstagramDataResults.tsx   # Results display
│   └── GradientButton.tsx         # Reusable button
│
└── screen/            # Screens
    └── HomepageUploadZip.tsx      # Main screen
```

## Layer Responsibilities

### 1. Entities (`entities/`)
- Pure data models with no external dependencies
- Parsing logic for raw JSON data
- Business calculations (e.g., calculating summary stats)
- **Example**: `Follower`, `Following`, `InstagramData`

### 2. Services (`services/`)
- Stateless business logic
- External integrations (file system, etc.)
- Data transformations
- **Example**: `ZipParserService`, `InstagramDataService`

### 3. Store (`store/`)
- Global state management using Zustand
- Reactive state updates
- Selectors for derived state
- **Example**: `useInstagramDataStore`

### 4. ViewModels (`viewmodels/`)
- Controllers that orchestrate the flow
- Connect UI to services
- Handle user interactions
- Update store state
- **Example**: `InstagramUploadViewModel`

### 5. Components (`components/`)
- Pure UI components
- Consume state from store
- Delegate actions to ViewModels
- **Example**: `HomepageUploadCard`, `InstagramDataResults`

## Data Flow

```
User Action (Upload ZIP)
    ↓
ViewModel (InstagramUploadViewModel)
    ↓
Service (InstagramDataService)
    ↓
Service (ZipParserService)
    ↓
Entity Parsers (parseFollowers, parseFollowing)
    ↓
Store (useInstagramDataStore)
    ↓
UI Update (React re-render)
```

## Usage Example

```typescript
import { instagramUploadViewModel } from '@/src/features/homepage/viewmodels';
import { useInstagramDataStore, selectData } from '@/src/features/homepage/store';

// In a component
function MyComponent() {
  const data = useInstagramDataStore(selectData);
  
  const handleUpload = async () => {
    await instagramUploadViewModel.handleUploadZip();
  };
  
  return (
    // UI here
  );
}
```

## Key Features

1. **Type Safety**: Full TypeScript support with strict typing
2. **Error Handling**: Comprehensive error handling at each layer
3. **Separation of Concerns**: Each layer has a single responsibility
4. **Testability**: Pure functions and dependency injection make testing easy
5. **Scalability**: Easy to add new features or modify existing ones

## Dependencies

- `jszip`: ZIP file parsing
- `expo-file-system`: File system access
- `expo-document-picker`: Document selection
- `zustand`: State management

## Instagram Export Structure

The feature expects the following structure in the Instagram export ZIP:

```
connections/
  followers_and_following/
    ├── followers_1.json
    └── following.json
```

### Followers Format
```json
[
  {
    "title": "...",
    "string_list_data": [
      {
        "href": "https://www.instagram.com/username",
        "value": "username",
        "timestamp": 1234567890
      }
    ]
  }
]
```

### Following Format
```json
{
  "relationships_following": [
    {
      "title": "...",
      "string_list_data": [
        {
          "href": "https://www.instagram.com/username",
          "timestamp": 1234567890
        }
      ]
    }
  ]
}
```

## Future Enhancements

1. **Firebase Integration**: Upload parsed data to Firebase for persistence
2. **Advanced Analytics**: More detailed insights and visualizations
3. **History Tracking**: Track changes over time
4. **Export Features**: Export analysis results
5. **Batch Processing**: Handle large datasets more efficiently
