// rollbar.config.js
export default {
  accessToken: "257c9b62169541db82b9f575da40db13",
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: "dev",
    client: {
      javascript: {
        code_version: "1.0.0",
      },
    },
  },
};
