# Admin Content Management System

## Overview
The TourMate app now features a comprehensive admin content management system that allows administrators to add, edit, and manage content that is visible to users in the mobile app.

## Features

### 🔧 Admin Dashboard
- **Content Overview**: View statistics of all content types (attractions, restaurants, beaches, destinations)
- **Real-time Status**: See live content count and sync status
- **Role-based Access**: Different permissions for LGU admins vs reports admins

### 📝 Content Management
- **Add Content**: Create new attractions, restaurants, beaches, and destinations
- **Edit Content**: Update existing content with a user-friendly modal interface
- **Delete Content**: Remove content with confirmation dialogs
- **Search & Filter**: Find specific content quickly
- **Category Management**: Organize content by type

### 🔄 Real-time Sync
- **Firebase Integration**: All content is stored in Firebase Firestore
- **User App Sync**: Changes made by admins are immediately visible to users
- **Fallback System**: Static data serves as backup if Firebase is unavailable

## Admin Workflow

### 1. Adding Content
1. Navigate to Admin Dashboard
2. Click "Add Attraction/Restaurant/Beach/Destination"
3. Fill in required fields (name, location, description)
4. Add optional details (rating, price range, opening hours, specialties)
5. Save - content is immediately available to users

### 2. Editing Content
1. Go to "Manage Content" section
2. Select content category (attractions, restaurants, etc.)
3. Click "Edit" on any item
4. Modify fields in the modal
5. Save changes - updates are reflected in user app

### 3. Managing Content
1. Use search to find specific content
2. Filter by category
3. Delete unwanted content with confirmation
4. View creation dates and content status

## User App Integration

### Home Screen
- Featured attractions from Firebase
- Popular destinations from Firebase
- Local delicacies (restaurants) from Firebase
- Fallback to static data if Firebase unavailable

### Search Screen
- All attractions, destinations, and beaches from Firebase
- Search and filter functionality
- Category-based organization

### Attraction Details
- Nearby restaurants from Firebase
- Real-time content updates
- Location-based restaurant suggestions

## Technical Implementation

### Firebase Collections
- `attractions` - Tourist attractions and landmarks
- `restaurants` - Dining establishments and local delicacies
- `beaches` - Beach destinations and coastal areas
- `destinations` - Travel destinations and points of interest

### Data Structure
Each content item includes:
- `id` - Unique identifier
- `name` - Content name
- `location` - Geographic location
- `description` - Detailed description
- `rating` - User rating (optional)
- `priceRange` - Price information (restaurants)
- `openHours` - Operating hours (restaurants)
- `specialties` - Special features or menu items
- `status` - Content status (active/inactive)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Services
- `AdminDataService` - Admin CRUD operations
- `FirebaseDataService` - User app data fetching
- `AttractionsDataService` - Static data fallback

## Security & Permissions

### Admin Roles
- **LGU Admin**: Full content management access
- **Reports Admin**: Analytics and reporting only

### Data Validation
- Required field validation
- Input sanitization
- Confirmation dialogs for destructive actions

## Benefits

### For Administrators
- Easy content management interface
- Real-time content updates
- Comprehensive content overview
- Search and filter capabilities

### For Users
- Always up-to-date content
- Rich, detailed information
- Reliable data with fallback system
- Enhanced user experience

## Future Enhancements
- Image upload and management
- Content approval workflow
- Analytics and usage statistics
- Multi-language support
- Content scheduling and publishing
