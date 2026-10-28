import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

/**
 * Validated, type-safe environment variables.
 *
 * Always read env values through `env` instead of `import.meta.env` so that
 * missing or malformed variables fail fast at startup instead of surfacing as
 * `undefined` deep inside the app. Only `VITE_` variables are exposed to the
 * client bundle, so never put secrets here.
 */
export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_API_BASE_URL: z.url(),
    VITE_FIREBASE_API_KEY: z.string().min(1),
    VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    VITE_FIREBASE_PROJECT_ID: z.string().min(1),
    VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
    VITE_FIREBASE_APP_ID: z.string().min(1),
    VITE_FIREBASE_MEASUREMENT_ID: z.string().min(1).optional(),
  },
  // Empty values in `.env` become `undefined` so optional vars and defaults
  // behave as expected instead of failing validation on "".
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
})
