import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
  };
}
