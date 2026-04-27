import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noSilentCatch from "./eslint-rules/no-silent-catch.mjs";

/**
 * Custom plugin exposing the Atheros-scoped rules.
 * See eslint-rules/no-silent-catch.mjs for the rule implementation.
 */
const copilotPlugin = {
  rules: {
    "no-silent-catch": noSilentCatch,
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Default ignores of eslint-config-next:
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Atheros / co-pilot fail-loud rule.
  // Applied to every copilot code path + the /api/chat/v2 edge route.
  // The legacy /api/chat + /api/chat/lead routes were deleted along with
  // the legacy ChatWidget. Every failure in this scope must call
  // log.info/warn/error/fatal or carry a `copilot-allow-silent-catch`
  // explanation; the rule is implemented in eslint-rules/no-silent-catch.mjs.
  {
    files: [
      "src/lib/copilot/**/*.{ts,tsx}",
      "src/lib/content/anonymize.ts",
      "src/components/copilot/**/*.{ts,tsx}",
      "src/app/api/copilot/**/*.{ts,tsx}",
      "src/app/api/chat/v2/**/*.{ts,tsx}",
    ],
    plugins: {
      copilot: copilotPlugin,
    },
    rules: {
      "copilot/no-silent-catch": "error",
    },
  },
]);

export default eslintConfig;
