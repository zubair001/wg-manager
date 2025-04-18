import pino from "pino";

export const logger = pino({
  browser: {
    asObject: true,
  },
  level: import.meta.env.MODE === "development" ? "debug" : "error",
});
