

/**
 * The module containing the model of the battletech game aid.
 * @module "@kartagia/btechgame-model"
 */

import { Logger, ConsoleLogger } from "./logger.js";

/**
 * 
 * @param logger 
 */
export default async function moduleLoader(logger: Logger|undefined = undefined) {
    if (logger) {
        logger.log("Battletech aid module loaded successfully");
    }
}

moduleLoader(new ConsoleLogger());
