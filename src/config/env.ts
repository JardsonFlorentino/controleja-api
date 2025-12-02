import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default("3001"),
  DATABASE_URL: z.string().min(5, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['dev','prod','test']).default('dev'),
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().min(1, 'FIREBASE_CLIENT_EMAIL is required'),
  FIREBASE_PRIVATE_KEY_BASE64: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
