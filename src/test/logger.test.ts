
import { ConsoleLogger, Logger } from "../main/logger.js";
import {test, expect} from 'vitest';

/**
 * Test script for logger.
 */
test("Testing logger is available", function() {
    expect(ConsoleLogger, "Console logger not defined").toBeDefined();
    let logger: Logger; 
    expect(() => {logger = new ConsoleLogger()}).not.toThrow();
    const strVal: string = "Tested string value";
    const objVal : object = { toString() { return "I am alive!"}};
    expect(() => {
        logger.log("Testing logging details with ", "a number ", 10, ", a string ", strVal);
    }).not.toThrow();
});
