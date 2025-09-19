/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_LTI_CONSUMER_KEY: string;
  readonly VITE_LTI_ENABLED: string;
  readonly VITE_LTI_LAUNCH_URL: string;
  readonly VITE_LTI_CONFIG_URL: string;
  readonly VITE_CANVAS_BASE_URL: string;
  readonly VITE_CANVAS_ACCESS_TOKEN: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}