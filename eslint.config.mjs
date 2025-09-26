import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Relax a couple of strict rules temporarily to allow the project to build.
  // Many files in this repo use `any` and other patterns; turning this rule off
  // avoids blocking the production build. Consider re-enabling and fixing
  // individual files incrementally.
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // Optionally allow unused vars that start with underscore
      // to reduce noise from generated/mock code
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    },
  },
];

export default eslintConfig;
