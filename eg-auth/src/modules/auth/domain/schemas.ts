import { z } from "zod";

export const signupSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least 1 letter, 1 number, and 1 special character"
    ),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
