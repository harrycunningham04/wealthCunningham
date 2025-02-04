import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(3, "Name is required").max(255),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.string().min(1, "Inital Balance is required").max(255),
  isDefault: z.boolean().default(false),
});
