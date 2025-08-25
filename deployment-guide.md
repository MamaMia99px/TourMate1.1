# 🚀 TouristApp Deployment Guide

## Overview
This guide covers the complete deployment process for the TouristApp React Native project using Expo EAS Build and Firebase.

## 📋 Prerequisites

### Required Accounts
- [ ] **Expo Account** - Create at [expo.dev](https://expo.dev)
- [ ] **Apple Developer Account** - $99/year for iOS deployment
- [ ] **Google Play Console Account** - $25 one-time fee for Android
- [ ] **Firebase Project** - Free tier available

### Development Tools
- [ ] Node.js 18+ installed
- [ ] Expo CLI: `npm install -g @expo/cli`
- [ ] EAS CLI: `npm install -g eas-cli`

## 🔧 Initial Setup

### 1. EAS Project Initialization
```bash
# Login to Expo
eas login

# Initialize EAS project
eas build:configure

# Generate EAS project ID
eas project:init
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# Edit .env with your Firebase credentials
```

### 3. Firebase Setup
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Update `.env` with your Firebase credentials

## 🏗️ Build Configuration

### Development Build
```bash
# For internal testing
npm run build:dev
```

### Preview Build (Staging)
```bash
# For stakeholder review
npm run build:preview
```

### Production Build
```bash
# For app store submission
npm run build:production
```

## 📱 Platform-Specific Setup

### iOS Configuration
1. **Apple Developer Account Setup**
   - Add iOS Bundle ID: `com.tourmate`
   - Create App Store Connect app

2. **Certificates & Provisioning**
   ```bash
   # EAS handles certificates automatically
   eas build --platform ios --profile production
   ```

### Android Configuration
1. **Google Play Console Setup**
   - Create new app with package: `com.tourmate`
   - Upload app bundle

2. **Build Android App Bundle**
   ```bash
   eas build --platform android --profile production
   ```

## 🚀 Deployment Process

### Phase 1: Internal Testing
```bash
# Build development version
npm run build:dev

# Share with development team via Expo
```

### Phase 2: Staging Deployment
```bash
# Build preview version
npm run build:preview

# Test with stakeholders
```

### Phase 3: Production Deployment

#### Step 1: Build Production Apps
```bash
# Build both platforms
eas build --platform all --profile production
```

#### Step 2: Submit to App Stores
```bash
# iOS App Store
npm run submit:ios

# Google Play Store
npm run submit:android
```

## 📊 Firebase Deployment

### Firestore Rules
Update security rules in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for attractions, restaurants, etc.
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in [
          'lgu.cebu@touristapp.com',
          'cebu.tourism@touristapp.com'
        ];
    }
  }
}
```

### Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔄 OTA Updates

### Setup EAS Update
```bash
# Configure updates
eas update:configure

# Deploy update
eas update --branch production --message "Bug fixes and improvements"
```

### Automatic Updates
Updates are automatically delivered to users on app launch.

## 🔐 Security Checklist

- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] Admin email restrictions in place
- [ ] API keys secured
- [ ] App signing certificates secured

## 📈 Monitoring & Analytics

### Crash Reporting
Consider integrating:
- Sentry for error tracking
- Firebase Crashlytics
- Expo Dev Tools

### Analytics
- Firebase Analytics (already configured)
- Google Analytics
- Custom tracking for tourism features

## 🧪 Testing Strategy

### Pre-Deployment Testing
1. **Functionality Testing**
   - Authentication flows
   - Admin panel access
   - Content management
   - User features

2. **Performance Testing**
   - App startup time
   - Image loading
   - Navigation performance

3. **Device Testing**
   - iOS (iPhone 12+, iPad)
   - Android (Various screen sizes)

## 📅 Release Schedule

### Recommended Release Cycle
- **Major Updates**: Monthly
- **Bug Fixes**: Bi-weekly via OTA
- **Critical Fixes**: As needed via OTA

### Version Management
- Production: `1.0.0`, `1.1.0`, `2.0.0`
- Build numbers increment automatically

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and retry
expo r -c
eas build --clear-cache
```

**Provisioning Issues (iOS)**
```bash
# Reset credentials
eas credentials
```

**Android Signing Issues**
```bash
# Generate new keystore
eas credentials
```

## 📞 Support Contacts

- **Technical Issues**: Development Team
- **App Store Issues**: Platform-specific support
- **Firebase Issues**: Firebase Console Support
- **LGU Admin Access**: System Administrator

## 🔄 Maintenance

### Regular Tasks
- [ ] Monitor app crashes (weekly)
- [ ] Update dependencies (monthly)
- [ ] Review analytics (monthly)
- [ ] Update content as needed
- [ ] Backup Firebase data (weekly)

### Emergency Procedures
1. Critical bug discovered
2. Deploy hotfix via EAS Update
3. If severe, pull app from stores temporarily
4. Communicate with users via in-app messaging

---

## Quick Deployment Commands

```bash
# Complete deployment workflow
npm run build:production
npm run submit:ios
npm run submit:android

# Emergency update
eas update --branch production --message "Critical fix"
``` 