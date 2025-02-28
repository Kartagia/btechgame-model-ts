/******/ // The require scope
/******/ var __nccwpck_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  A: () => (/* binding */ BTechGameModel)
});

;// CONCATENATED MODULE: ./src/main/logger.ts
/**
 * Console logger implementation.
 */
class ConsoleLogger {
    log(...messages) {
        console.log(...messages);
    }
    error(...messages) {
        console.error(...messages);
    }
    warn(...messages) {
        console.warn(...messages);
    }
    errorWithTrace(error, ...messages) {
        this.error(...messages);
        console.trace(error);
    }
    debug(...messages) {
        console.debug(...messages);
    }
}

;// CONCATENATED MODULE: ./src/main/index.ts
/**
 * The module containing the model of the battletech game aid.
 * @module "@kartagia/btechgame-model"
 */

/**
 *
 * @param logger
 */
async function BTechGameModel(logger = undefined) {
    if (logger) {
        logger.log("Battletech aid module loaded successfully");
    }
}
BTechGameModel(new ConsoleLogger());

var __webpack_exports__default = __webpack_exports__.A;
export { __webpack_exports__default as default };
