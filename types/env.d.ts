declare module '@env' {
  interface ExpoConfig {
    extra?: {
      firebaseApiKey?: string;
      firebaseAuthDomain?: string;
      firebaseProjectId?: string;
      firebaseStorageBucket?: string;
      firebaseSenderId?: string;
      firebaseAppId?: string;
      firebaseMeasurementId?: string;
    };
  }
} 