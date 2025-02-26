

/**
 * The module containing the model of the battletech game aid.
 * @module "@kartagia/btechgame-model"
 */

import { Logger, ConsoleLogger } from "./logger.js";

import { Count, createCount, createIntCount } from "./mech.js";

export interface BTechGameModelLib {
    createCount: typeof createCount,
    createIntCount: typeof createIntCount
}

/**
 * 
 * @param logger 
 */
export default async function BTechGameModel(logger: Logger|undefined = undefined): Promise<BTechGameModelLib> {
    if (logger) {
        logger.log("Battletech aid module loaded successfully");
    }
    return {
        createCount, createIntCount
    };
}

BTechGameModel(new ConsoleLogger());
