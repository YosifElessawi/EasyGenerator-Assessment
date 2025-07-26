// src/components/forms/AuthForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";
import type { 
  AuthFormProps, 
  SignInFormData, 
  SignUpFormData,
  SignInFormProps,
  SignUpFormProps
} from "@/schemas/auth";
import { signInSchema, signUpSchema } from "@/schemas/auth";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";

export const AuthForm = (props: AuthFormProps) => {
  const { type, isLoading = false, error, switchAuthType, onForgotPassword, termsOfServiceUrl, privacyPolicyUrl } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const schema = type === "signup" ? signUpSchema : signInSchema;
  
  const form = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "signup" ? { name: "", confirmPassword: "" } : {})
    }
  });

  // Separate handlers for better type safety
  const handleSignInSubmit = async (values: SignInFormData) => {
    if (type === "signin") {
      await (props as SignInFormProps).onSubmit(values);
    }
  };

  const handleSignUpSubmit = async (values: SignUpFormData) => {
    if (type === "signup") {
      await (props as SignUpFormProps).onSubmit(values);
    }
  };

  const handleSubmit = async (values: SignInFormData | SignUpFormData) => {
    try {
      if (type === "signup") {
        await handleSignUpSubmit(values as SignUpFormData);
      } else {
        await handleSignInSubmit(values as SignInFormData);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const passwordValue = form.watch("password") || "";

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
                        autoComplete="name"
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
                      autoComplete="email"
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
                    {type === "signin" && onForgotPassword && (
                      <Button 
                        type="button" 
                        variant="link" 
                        className="px-0 h-auto text-sm"
                        disabled={isLoading}
                        onClick={onForgotPassword}
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
                        autoComplete={type === "signin" ? "current-password" : "new-password"}
                        {...field}
                        onFocus={() => type === "signup" && setShowPasswordRequirements(true)}
                        onBlur={() => {
                          field.onBlur();
                          setShowPasswordRequirements(false);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {type === "signup" && (showPasswordRequirements || passwordValue) && (
                    <PasswordRequirements password={passwordValue} />
                  )}
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
                          autoComplete="new-password"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {field.value && passwordValue && field.value === passwordValue && (
                      <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
                        <Check className="h-3 w-3" />
                        <span>Passwords match</span>
                      </div>
                    )}
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
            {termsOfServiceUrl ? (
              <a 
                href={termsOfServiceUrl} 
                className="text-primary hover:underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            ) : (
              <span className="text-primary">Terms of Service</span>
            )}
            {" "}and{" "}
            {privacyPolicyUrl ? (
              <a 
                href={privacyPolicyUrl} 
                className="text-primary hover:underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            ) : (
              <span className="text-primary">Privacy Policy</span>
            )}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}