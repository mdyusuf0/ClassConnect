export const logger = {
  info: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.info(`[ClassConnect Frontend] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.warn(`[ClassConnect Frontend WARN] ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    console.error(`[ClassConnect Frontend ERROR] ${message}`, ...args);
  },
};

export default logger;
