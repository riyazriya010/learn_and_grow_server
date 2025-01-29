
export interface ValidationRule {
    field: string;
    required?: boolean;
    type?: "string" | "number" | "email" | "boolean";
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    customValidator?: (value: any) => boolean;
    errorMessage?: string;
  }
  
  export const validationRules: Record<string, ValidationRule[]> = {
    signupForm: [
      { field: "username", required: true, type: "string", minLength: 3, maxLength: 30, errorMessage: "Invalid username" },
      { field: "email", required: true, type: "email", errorMessage: "Invalid email address" },
      { field: "password", required: true, type: "string", minLength: 6, errorMessage: "Password must be at least 6 characters" },
    ],
    loginForm: [
      { field: "email", required: true, type: "email", errorMessage: "Invalid email address" },
      { field: "password", required: true, type: "string", errorMessage: "Password is required" },
    ],
  };
  