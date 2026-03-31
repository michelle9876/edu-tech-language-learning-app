import Constants from "expo-constants";

type ExtraConfig = {
  appName?: string;
  appScheme?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  allowDemoAuth?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const env = {
  appName: extra.appName ?? "Saylo",
  appScheme: extra.appScheme ?? "saylo",
  supabaseUrl: extra.supabaseUrl ?? "",
  supabaseAnonKey: extra.supabaseAnonKey ?? "",
  allowDemoAuth: extra.allowDemoAuth ?? false,
};
