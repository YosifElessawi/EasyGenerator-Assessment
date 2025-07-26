import { Check, X } from "lucide-react";
import { passwordRequirements } from "@/schemas/auth";
import type { JSX } from "react";

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements = ({ password }: PasswordRequirementsProps): JSX.Element => {
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-muted-foreground">Password must contain:</p>
      {passwordRequirements.map((req, index) => {
        const isValid = req.regex.test(password);
        return (
          <div key={index} className="flex items-center gap-2 text-xs">
            {isValid ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={isValid ? "text-green-600" : "text-muted-foreground"}>
              {req.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
