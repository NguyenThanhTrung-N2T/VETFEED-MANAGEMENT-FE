import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore generated client files
    "client/**",
  ]),
  // Custom rules to reduce noise while maintaining code quality
  {
    rules: {
      // Allow unused variables as warnings instead of errors
      "@typescript-eslint/no-unused-vars": "warn",

      // Allow explicit any (common in API responses and dynamic data)
      "@typescript-eslint/no-explicit-any": "warn",

      // Allow missing ts-expect-error descriptions
      "@typescript-eslint/ban-ts-comment": "warn",

      // React hooks - warn instead of error
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error", // Keep this as error
      "react-hooks/set-state-in-effect": "warn",

      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "warn",

      // Next.js specific - warn about img tags but don't block
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
