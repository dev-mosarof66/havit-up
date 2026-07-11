export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatDevMessage(level: LogLevel, context: string, message: string, error?: unknown) {
  const timestamp = new Date().toLocaleTimeString();
  
  // Terminal color codes
  const colors = {
    info: '\x1b[36m', // Cyan
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    debug: '\x1b[90m', // Gray
    reset: '\x1b[0m',
    bold: '\x1b[1m'
  };

  const color = colors[level] || colors.reset;
  const levelText = `${color}${colors.bold}[${level.toUpperCase()}]${colors.reset}`;
  const contextText = `\x1b[35m[${context}]\x1b[0m`; // Magenta for context
  
  let output = `${colors.debug}[${timestamp}]${colors.reset} ${levelText} ${contextText} ${message}`;

  if (error) {
    if (error instanceof Error) {
      output += `\n${color}► ${error.name}: ${error.message}${colors.reset}`;
      if (error.stack) {
        const stackLines = error.stack.split('\n').slice(1).map(line => `\x1b[90m${line}\x1b[0m`).join('\n');
        if (stackLines) output += `\n${stackLines}`;
      }
    } else {
      output += `\n${color}► ${JSON.stringify(error, null, 2)}${colors.reset}`;
    }
  }

  return output;
}

function log(level: LogLevel, context: string, message: string, error?: unknown) {
  if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), log as JSON so Vercel can parse it beautifully 
    // into expandable rows with level badges.
    const logObj = {
      level,
      context,
      message,
      error: error instanceof Error ? { 
        name: error.name, 
        message: error.message, 
        stack: error.stack 
      } : error,
      timestamp: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(logObj);
    
    if (level === 'error') console.error(jsonString);
    else if (level === 'warn') console.warn(jsonString);
    else if (level === 'debug') console.debug(jsonString);
    else console.log(jsonString);
  } else {
    // In development, log a pretty colored string to the terminal
    const formatted = formatDevMessage(level, context, message, error);
    
    if (level === 'error') console.error(formatted);
    else if (level === 'warn') console.warn(formatted);
    else if (level === 'debug') console.debug(formatted);
    else console.log(formatted);
  }
}

export const logger = {
  info: (context: string, message: string) => log('info', context, message),
  warn: (context: string, message: string, error?: unknown) => log('warn', context, message, error),
  error: (context: string, message: string, error?: unknown) => log('error', context, message, error),
  debug: (context: string, message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', context, message);
    }
  }
};
