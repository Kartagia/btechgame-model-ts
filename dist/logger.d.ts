/**
 * A logger is a logger of messages.
 */
export interface Logger {
    /**
     * Log messages to the logger.
     * @param messages The logged messages concatenated to the error message.
     */
    log(...messages: any[]): void;
    /**
     * Log error messages to the logger.
     * @param messages The logged messages concatenated to the error message.
     */
    error(...messages: any[]): void;
    /**
    * Log warning messages to the logger.
    * @param messages The logged messages concatenated to the error message.
    */
    warn(...messages: any[]): void;
    /**
     * Log an error message followed by stack trace.
     * @param error The error, whose stack trace is logged.
     * @param messages The logged messages concatenated to the error message.
     */
    errorWithTrace(error: Error, ...messages: any[]): void;
    /**
     * Log a debug messages to the log.
     * @param messages The logged messages concatenated to the error message.
     */
    debug(...messages: any[]): void;
}
/**
 * Console logger implementation.
 */
export declare class ConsoleLogger implements Logger {
    log(...messages: any[]): void;
    error(...messages: any[]): void;
    warn(...messages: any[]): void;
    errorWithTrace(error: Error, ...messages: any[]): void;
    debug(...messages: any[]): void;
}
export default Logger;
