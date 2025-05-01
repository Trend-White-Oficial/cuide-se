module.exports = {
  expo: {
    name: "Cuide-Se",
    slug: "cuide-se",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cuide.se"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.cuide.se",
      versionCode: 2
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          },
          android: {
            vectorDrawablesUsesSupportLibrary: true
          }
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "317a29d9-d6c1-4554-a9cf-52cd8066ed27"
      },
      expoClient: {
        scheme: "cuide-se"
      }
    }
  }
};
