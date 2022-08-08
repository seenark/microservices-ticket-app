import { z } from "zod";

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
  MONGO_URI: z.string(),
});

export type TEnv = z.infer<typeof EnvSchema>;

export function validateEnv(
  config: Record<string, string>,
): Record<string, string> {
  try {
    const env = EnvSchema.parse(config);
    console.log("env", env);
    return env;
  } catch (error: any) {
    throw new Error(JSON.stringify(error));
  }
}
