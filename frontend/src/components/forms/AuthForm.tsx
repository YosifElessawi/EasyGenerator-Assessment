// src/components/auth/AuthForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";



// Base schema for both forms
const baseSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string()
  .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/, 
      "Password must include at least one letter, one number, and one special character"
    ),
});

// Sign in schema
const signInSchema = baseSchema;

// Sign up schema with additional fields and password confirmation
const signUpSchema = baseSchema.extend({
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

interface SignInFormProps {
  type: "signin";
  onSubmit: (values: SignInFormData) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  switchAuthType: () => void;
}

interface SignUpFormProps {
  type: "signup";
  onSubmit: (values: SignUpFormData) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  switchAuthType: () => void;
}

type AuthFormProps = SignInFormProps | SignUpFormProps;

export function AuthForm({ type, onSubmit, isLoading = false, error, switchAuthType }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = type === "signup" ? signUpSchema : signInSchema;
  
const form = useForm<SignInFormData | SignUpFormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",
    password: "",
    ...(type === "signup" ? { name: "", confirmPassword: "" } : {})
  }
});

  const handleSubmit = async (values: SignInFormData | SignUpFormData) => {
    try {
      if (type === "signup") {
        (onSubmit as (values: SignUpFormData) => void)(values as SignUpFormData);
      } else {
        (onSubmit as (values: SignInFormData) => void)(values as SignInFormData);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {type === "signin" ? "Welcome back" : "Create account"}
        </CardTitle>
        <CardDescription>
          {type === "signin"
            ? "Enter your credentials to sign in"
            : "Enter your information to get started"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {type === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    {type === "signin" && (
                      <Button 
                        type="button" 
                        variant="link" 
                        className="px-0 h-auto text-sm"
                        disabled={isLoading}
                      >
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        disabled={isLoading}
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "signup" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          disabled={isLoading}
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {type === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                type === "signin" ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          {type === "signin" ? "Don't have an account?" : "Already have an account?"}
          {" "}
          <Button
            type="button"
            variant="link"
            className="px-0 h-auto font-medium"
            onClick={switchAuthType}
            disabled={isLoading}
          >
            {type === "signin" ? "Sign up" : "Sign in"}
          </Button>
        </div>
        
        {type === "signup" && (
          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{" "}
            <Button variant="link" className="px-0 h-auto text-xs">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-0 h-auto text-xs">
              Privacy Policy
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}