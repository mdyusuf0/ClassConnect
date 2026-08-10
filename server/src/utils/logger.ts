export class Logger {
  static info(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    process.stdout.write(`[INFO] [${timestamp}] ${message} ${args.length ? JSON.stringify(args) : ''}\n`);
  }

  static warn(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    process.stderr.write(`[WARN] [${timestamp}] ${message} ${args.length ? JSON.stringify(args) : ''}\n`);
  }

  static error(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    process.stderr.write(`[ERROR] [${timestamp}] ${message} ${args.length ? JSON.stringify(args) : ''}\n`);
  }

  static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      process.stdout.write(`[DEBUG] [${timestamp}] ${message} ${args.length ? JSON.stringify(args) : ''}\n`);
    }
  }
}
