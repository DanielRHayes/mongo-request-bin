export default class Logger {
  info(message: string, data?: any) {
    console.log(['INFO:', message].join(' '), data);
  }

  error(err: Error) {
    console.error(['ERROR:', err.message].join(' '), err);
  }
}

export const logger = new Logger();
