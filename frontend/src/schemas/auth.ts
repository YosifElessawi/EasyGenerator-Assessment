import { z } from "zod";

// Password validation helpers
export const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[A-Za-z]/, text: "At least one letter" },
  { regex: /\d/, text: "At least one number" },
  { regex: /[^A-Za-z\d]/, text: "At least one special character" }
] as const;

// Base schema for both forms
export const baseSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/, 
      "Password must include at least one letter, one number, and one special character"
    ),
});

// Sign in schema
export const signInSchema = baseSchema;

// Sign up schema with additional fields and password confirmation
export const signUpSchema = baseSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

// Type definitions
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

export interface BaseAuthFormProps {
  isLoading?: boolean;
  error?: string | null;
  switchAuthType: () => void;
  onForgotPassword?: () => void;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
}

export interface SignInFormProps extends BaseAuthFormProps {
  type: "signin";
  onSubmit: (values: SignInFormData) => void | Promise<void>;
}

export interface SignUpFormProps extends BaseAuthFormProps {
  type: "signup";
  onSubmit: (values: SignUpFormData) => void | Promise<void>;
}

export type AuthFormProps = SignInFormProps | SignUpFormProps;
