export default ({ config }) => {
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';
  const IS_STAGING = process.env.NODE_ENV === 'staging';
  
  return {
    ...config,
    name: IS_PRODUCTION ? "TourMate" : IS_STAGING ? "TourMate Staging" : "TourMate Dev",
    slug: "tourmate",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*",
      "assets/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_PRODUCTION ? "com.tourmate" : IS_STAGING ? "com.tourmate.staging" : "com.tourmate.dev",
      buildNumber: "1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: IS_PRODUCTION ? "com.tourmate" : IS_STAGING ? "com.tourmate.staging" : "com.tourmate.dev",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || "your-eas-project-id-here"
      }
    },
    updates: {
      url: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ? 
        `https://u.expo.dev/${process.env.EXPO_PUBLIC_EAS_PROJECT_ID}` : 
        undefined
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  };
}; 