# API Integration

This document describes the changes made to integrate the frontend with the backend API instead of loading data from local JSON files.

## Changes Made

### 1. API Service Layer
- Created `src/services/api.ts` with axios configuration
- Added request/response interceptors for logging
- Implemented API endpoints for ground stations and satellites

### 2. Store Updates
- Updated `useGroundStationStore` to fetch data from API instead of importing JSON
- Updated `useSatelliteStore` to fetch data from API instead of importing JSON
- Added `refreshStations()` and `refreshSatellites()` methods
- Added loading states to both stores

### 3. Data Loading Hook
- Created `useApiData` hook to manage API data loading
- Provides centralized data loading state management
- Handles errors and provides refresh functionality

### 4. UI Components
- Added `LoadingSpinner` component for loading states
- Added `RefreshButton` component for manual data refresh
- Updated main App component to show loading states
- Added refresh buttons to Ground Stations and Satellites pages

## Environment Configuration

Create a `.env` file in the frontend directory with:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Cesium Configuration
VITE_CESIUM_ION_TOKEN=your_cesium_ion_token_here
```

## API Endpoints

The frontend now uses these backend endpoints:

- `GET /ground-stations` - Fetch all ground stations
- `GET /satellites` - Fetch all satellites
- `GET /satellites/tle` - Fetch TLE data for all satellites

## Data Flow

1. **Initialization**: When the app loads, `useApiData` hook automatically fetches data from both APIs
2. **Loading State**: Shows loading spinner while data is being fetched
3. **Error Handling**: Displays error message with retry button if API calls fail
4. **Manual Refresh**: Users can manually refresh data using refresh buttons on each page
5. **Store Updates**: Data is stored in Zustand stores and automatically updates the UI

## Benefits

- **Real-time Data**: Data is fetched from the backend, allowing for dynamic updates
- **Centralized Management**: Single source of truth for data loading and error handling
- **Better UX**: Loading states and error handling improve user experience
- **Scalability**: Easy to add new API endpoints and data sources
- **Maintainability**: Centralized API configuration and error handling

## Migration Notes

- Removed direct imports of JSON files from stores
- Added axios as a dependency
- Updated store initialization to be asynchronous
- Added loading states throughout the application

## Troubleshooting

### API Connection Issues
- Ensure the backend is running on the configured port
- Check that `VITE_API_URL` is correctly set in your `.env` file
- Verify CORS settings on the backend

### Data Loading Issues
- Check browser console for API request/response logs
- Verify that the backend endpoints are working correctly
- Check network tab for failed requests

### Build Issues
- Ensure all dependencies are installed (`npm install`)
- Check that TypeScript types are correct
- Verify that all imports are properly resolved
