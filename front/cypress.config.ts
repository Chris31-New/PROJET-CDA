import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'gbxu6s',
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts"
  },
});
