# Cebu Tourist App

A React Native/Expo application for exploring Cebu's attractions, local delicacies, and travel experiences with enhanced performance, security, and user experience.

## ✨ **Recent Improvements**

### 🔒 **Security & Configuration**
- **Enhanced Environment Management**: Secure configuration with validation
- **Firebase Security**: Improved error handling and configuration validation
- **Production-Ready Setup**: Environment-specific configurations for dev/staging/production

### 🚀 **Performance & Reliability**
- **Advanced Error Handling**: Centralized error management with user-friendly messages
- **Loading States**: Beautiful loading indicators and user feedback
- **Error Boundaries**: React error boundaries for graceful failure handling
- **Retry Logic**: Automatic retry mechanisms for failed operations
- **Network Awareness**: Offline detection and network status indicators

### 🎨 **User Experience**
- **Enhanced Theme System**: Extended color palette with overlay and shadow support
- **Async Operation Management**: Custom hooks for handling loading states
- **Improved CLI**: Updated to use latest Expo CLI with optimized scripts

## 📁 Project Structure

```
TouristApp/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Common components (Logo, LoadingSpinner, ErrorBoundary, etc.)
│   │   ├── modals/          # Modal components (RatingModal, etc.)
│   │   └── forms/           # Form-related components
│   │
│   ├── screens/             # Application screens
│   │   ├── auth/           # Authentication screens (Login, Signup, Landing)
│   │   ├── main/           # Main app screens (Home, Search, AttractionDetails)
│   │   ├── profile/        # Profile-related screens (Profile, EditProfile, Reviews, etc.)
│   │   └── settings/       # Settings screens (Settings, Language, Help)
│   │
│   ├── navigation/         # Navigation configuration
│   │   ├── AppNavigator.js    # Main app navigator
│   │   ├── AuthNavigator.js   # Authentication flow navigator
│   │   └── MainNavigator.js   # Bottom tab navigator
│   │
│   ├── services/           # External services and APIs
│   │   ├── firebase/       # Firebase configuration and services
│   │   ├── api/           # API service calls
│   │   └── storage/       # Local storage services
│   │
│   ├── utils/             # Utility functions and helpers
│   │   ├── ErrorHandler.js # Centralized error handling
│   │   └── imageMap.js    # Image asset mapping
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── useAsyncOperation.js # Async operation management
│   │
│   ├── styles/            # Styling and theming
│   │   ├── colors.js      # Enhanced color palette
│   │   └── globalStyles.js # Global styles
│   │
│   ├── config/            # Configuration management
│   │   └── environment.js # Environment variables and validation
│   │
│   └── contexts/          # React Context providers
│
├── assets/                # Static assets
│   └── images/           # Image assets
│
├── docs/                 # Documentation
│   └── ACCESSIBILITY_GUIDE.md
│
├── App.js               # Root component with error boundary
├── index.js             # Entry point
└── package.json         # Dependencies and optimized scripts
```

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- Android Studio or Xcode for simulators

### 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TouristApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Fix Expo SDK compatibility:**
   ```bash
   npm run install:fix
   ```

4. **Start the development server:**
   ```bash
   npm start
   # or for cleared cache
   npm run start:clear
   ```

5. **Run on devices:**
   - **Mobile**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press 'i' in terminal
   - **Android Emulator**: Press 'a' in terminal
   - **Web**: Press 'w' in terminal

### 🔧 Development Scripts

```bash
# Development
npm start                 # Start development server
npm run start:clear       # Start with cleared cache
npm run start:dev         # Start in development mode
npm run start:staging     # Start in staging mode

# Building
npm run build:dev         # Development build
npm run build:preview     # Preview build
npm run build:production  # Production build
npm run build:apk         # Android APK build

# Maintenance
npm run doctor           # Check project health
npm run clean           # Clean cache and restart
npm run lint            # Check code quality
npm run lint:fix        # Fix code issues
```

## 🏗️ Architecture Benefits

- **🔒 Security**: Environment variable validation and secure configuration
- **⚡ Performance**: Optimized loading states and error recovery
- **🎯 Reliability**: Comprehensive error handling and retry mechanisms
- **📱 User Experience**: Network awareness and graceful degradation
- **🛠️ Maintainability**: Clean architecture with separation of concerns
- **🧪 Testability**: Modular design makes testing easier
- **🔄 Scalability**: Easy to add new features without cluttering

## 📱 Features

- ✅ **Enhanced User Authentication** (Login/Signup with improved error handling)
- ✅ **Browse Cebu Attractions** and destinations with rich media
- ✅ **Advanced Search** functionality with filters
- ✅ **User Profiles** and review system
- ✅ **Travel History** tracking
- ✅ **Favorite Spots** management
- ✅ **Multi-language Support**
- ✅ **Accessibility Features**
- ✅ **Offline Detection** and network status
- ✅ **Error Recovery** and retry mechanisms
- ✅ **Loading States** and user feedback

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo SDK 53
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Navigation**: React Navigation v6
- **Forms**: Formik & Yup with enhanced validation
- **Styling**: React Native StyleSheet with theme system
- **State Management**: React Context with custom hooks
- **Error Handling**: Custom ErrorHandler utility
- **Development**: Modern Expo CLI with optimized scripts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory (see `.env.example` for template):

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config

# App Environment
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_EAS_PROJECT_ID=your_eas_project_id
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication, Firestore, and Storage
3. Add your configuration to environment variables
4. Configure authentication providers

## 📝 Development Notes

- **Firebase Configuration**: Located in `src/services/firebase/` with enhanced error handling
- **Error Handling**: Centralized in `src/utils/ErrorHandler.js`
- **Theme System**: Enhanced with overlay and shadow support
- **Async Operations**: Managed through `useAsyncOperation` hook
- **Network Status**: Automatic detection and user notification
- **Image Assets**: Managed through `src/utils/imageMap.js`

## 🚀 Deployment

The app is configured for deployment through EAS Build:

```bash
# Build for different environments
npm run build:dev         # Development build
npm run build:preview     # Preview/staging build  
npm run build:production  # Production build

# Submit to app stores
npm run submit:ios        # Submit to App Store
npm run submit:android    # Submit to Google Play
```

## 🐛 Troubleshooting

### Common Issues:
1. **Metro bundler cache**: Run `npm run clean`
2. **Dependency conflicts**: Run `npm run install:fix`
3. **Network issues**: Check your internet connection
4. **Firebase errors**: Verify your environment configuration

### Getting Help:
- Check the console for detailed error messages
- Use `npm run doctor` to diagnose issues
- Enable debug logging in development mode

---

**Built with ❤️ for exploring the beautiful Philippines** 🇵🇭 