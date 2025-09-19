/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_TITLE?: string
  readonly VITE_BACKEND_URL?: string
  readonly VITE_DEV?: string
  readonly VITE_MODE?: string
  readonly VITE_BASE_URL?: string
  readonly VITE_PROD?: string
  // Agregar más variables VITE_ según necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}