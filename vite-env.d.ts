/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_URL: string
    readonly VITE_LTI_CLIENT_ID: string
    // más variables de entorno aquí...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}