import { z } from "zod";

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
});

export type TEnv = z.infer<typeof EnvSchema>;

export function validateEnv(
  config: Record<string, string>,
): Record<string, string> {
  try {
    const env = EnvSchema.parse(config);
    return env;
  } catch (error) {
    throw new Error("Env is invalid");
  }
}
