# Firebase Setup Guide

## Overview
The TourMate app uses Firebase Firestore for content management. This guide will help you set up Firebase properly to avoid index errors and ensure the app works correctly.

## Firebase Configuration

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Firestore Database
4. Set up security rules for Firestore

### 2. Required Firebase Indexes
To avoid the index error you encountered, you need to create composite indexes in Firebase:

#### For Attractions Collection:
- **Fields**: `status` (Ascending), `rating` (Descending)
- **Collection**: `attractions`

#### For Restaurants Collection:
- **Fields**: `status` (Ascending), `rating` (Descending)
- **Collection**: `restaurants`

#### For Destinations Collection:
- **Fields**: `status` (Ascending), `rating` (Descending)
- **Collection**: `destinations`

#### For Beaches Collection:
- **Fields**: `status` (Ascending), `rating` (Descending)
- **Collection**: `beaches`

### 3. Creating Indexes
1. Go to Firebase Console → Firestore Database
2. Click on "Indexes" tab
3. Click "Create Index"
4. Select the collection (e.g., `restaurants`)
5. Add fields:
   - `status` (Ascending)
   - `rating` (Descending)
6. Click "Create"

### 4. Alternative: Use the Direct Link
You can use the direct link from the error message:
```
https://console.firebase.google.com/v1/r/project/tourismapp-82791/firestore/indexes?create_composite=ClRwcm9qZWN0cy90b3VyaXNtYXBwLTgyNzkxL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9yZXN0YXVyYW50cy9pbmRleGVzL18QARoKCgZzdGF0dXMQARoKCgZyYXRpbmcQAhoMCghfX25hbWVfXxAC
```

## App Behavior Without Firebase

### ✅ **App Works Without Firebase**
The app is designed to work even without Firebase configuration:

1. **User App**: Falls back to static data
2. **Admin App**: Shows "Firebase not available" messages
3. **No crashes**: Graceful error handling

### 🔄 **Fallback System**
- **Home Screen**: Uses static attractions and destinations
- **Search Screen**: Uses static data
- **Admin Dashboard**: Shows Firebase unavailable status
- **Content Management**: Displays appropriate error messages

## Testing Without Firebase

### For Development/Testing:
1. **No Firebase config needed** - app will use static data
2. **Admin features disabled** - but no crashes
3. **User features work** - with static content

### For Production:
1. **Configure Firebase** using the steps above
2. **Create required indexes**
3. **Test admin features**
4. **Verify real-time sync**

## Firebase Configuration File

Make sure your `firebaseConfig.js` is properly set up:

```javascript
// src/services/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## Troubleshooting

### Common Issues:

1. **Index Error**: Create the required composite indexes
2. **Firebase not available**: Check firebaseConfig.js
3. **Permission denied**: Update Firestore security rules
4. **Network error**: Check internet connection

### Security Rules Example:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development
      // Use proper authentication for production
    }
  }
}
```

## Benefits of Firebase Setup

### With Firebase:
- ✅ Real-time content management
- ✅ Admin can add/edit/delete content
- ✅ Content syncs to user app immediately
- ✅ Scalable database solution

### Without Firebase:
- ✅ App still works with static data
- ✅ No crashes or errors
- ✅ Good for development/testing
- ❌ No admin content management
- ❌ No real-time updates

## Next Steps

1. **For Development**: App works fine without Firebase
2. **For Production**: Set up Firebase and create indexes
3. **For Testing**: Use static data mode
4. **For Deployment**: Configure Firebase properly

The app is designed to be robust and work in both scenarios!
