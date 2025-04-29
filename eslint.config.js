// Configuração do ESLint para o projeto Cuide-Se.
// Inclui regras para TypeScript, React e boas práticas de código.

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    // Configurações gerais do ESLint
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020, // Define a versão do ECMAScript
      globals: globals.browser, // Define os globais do ambiente de navegador
    },
    plugins: {
      // Plugins utilizados
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Regras específicas
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off", // Desativa a regra de variáveis não utilizadas
    },
  }
);
