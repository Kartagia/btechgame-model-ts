
/**
 * The mech storage for storing mechs.
 * @module 
 */

import BTechGameModel from "./index.ts";
import { Count, createCount, Mech, MechBay } from "./mech.ts";

/**
 * The mech storage. 
 */
export interface MechStorage {
    /**
     * The name of the mech storage.
     */
    name: string;
    /**
     * The partial mech salvage. 
     * If the value is a string, the mech details does not exists in the mech data source.
     */
    parts: Record<string, (Count<Mech|string>)>;
    /**
     * The stored mech chassis count.
     * If the value is a string, the mech does not exists in mech the mech data source.
     */
    stored: Record<string, (Count<Mech|string>)>;
    /**
     * The mech bays.
     */
    bays: MechBay[];

    /**
     * Is the storage completed.
     * A completed storage contains actual mechs for all parts and stored mechs.
     */
    readonly isComplete: boolean;
}

export class SimpleStorage implements MechStorage {

    private myName: string;

    private myParts: Map<string, Count<string  | Mech>> = new Map(); 

    private myStored: Map<string, Count<string  | Mech>> = new Map(); 


    constructor(name: string) {
        this.myName = name;
    }
    get name(): string {
        return this.myName;
    }

    set name(newName: string) {
        this.myName = newName;
    }

    /**
     * Get the part count.
     * @param model The queried model.
     * @returns An undefined value, if the storage does not recognize the model.
     * Otherwise returns the count of parts the storage has.
     */
    getParts(model: string): Count<string | Mech>|undefined {
        return this.myParts.get(model);
    }

    /**
     * Remove all parts from the storage.
     * @param model The removed model.
     * @returns The number of parts removed. An undefined value
     * indicates there is no parts to remove.
     */
    deleteParts(model: string): number|undefined {
        const result = this.getParts(model)?.count || 0;
        if (this.myParts.delete(model)) {
            return result;
        } else {
            return undefined;
        }
    }

    /**
     * Set the part count of the model.
     * @param model The mech model.
     * @param count The new count of the model.
     * @returns The part count replaced.
     */
    setParts(model: string, count: number): Count<string|Mech>|undefined {
        if ( !(Number.isSafeInteger(count) || count < 0)) {
            throw new RangeError("The part count is invalid");
        }
        let current = this.myParts.get(model);
        if (current) {
            this.myParts.set(model, createCount(model, current.count + count));
            return current;
        } else {
            // Adding a new model
            this.myParts.set(model, createCount(model, count));
            return undefined;
        }
    }

    removeParts(model: string, count: number) {

    }

    /**
     * Get the stored chassis count.
     * @param model The queried model.
     * @returns An undefined value, if the storage does not recognize the model.
     * Otherwise returns the count of stored the storage has.
     */
    getStored(model: string): Count<string | Mech>|undefined {
        return this.myStored.get(model);
    }

    /**
     * Remove all stored chassises from the storage.
     * @param model The removed model.
     * @returns The number of stored chassises removed. An undefined value
     * indicates there is no stored chassis to remove.
     */
    deleteStored(model: string): number|undefined {
        const result = this.getStored(model)?.count;
        if (this.myStored.delete(model)) {
            return result;
        } else {
            return undefined;
        }
    }

    /**
     * Set the stored chassis count of the model.
     * @param model The mech model.
     * @param count The new chassis count of the model.
     * @returns The replaced stored chassis count.
     */
    setStored(model: string, count: number): Count<string|Mech>|undefined {
        if ( !(Number.isSafeInteger(count) || count < 0)) {
            throw new RangeError("The part count is invalid");
        }
        let current = this.myStored.get(model);
        if (current) {
            this.myStored.set(model, createCount(model, current.count + count));
            return current;
        } else {
            // Adding a new model
            this.myStored.set(model, createCount(model, count));
            return undefined;
        }
    }


    get parts(): Record<string, Count<string | Mech>> {

        const mySelf = this;
        const result : Record<string, Count<string|Mech>> = {};
        return new Proxy(result, {
            get(target, prop, receiver) {
                if (typeof prop === "string") {
                    return mySelf.getParts(prop);
                } else {
                    return Reflect.get(target, prop, receiver);
                }
            },
            set(target, prop, newValue, receiver): boolean {
                if (typeof prop === "string") {
                    mySelf.setParts(prop, newValue);
                    return true;
                }
                return Reflect.set(target, prop, newValue, receiver);
            },
            deleteProperty(target, prop): boolean {
                return typeof prop === "string" && ( mySelf.deleteParts(prop) !== undefined );
            }
        });
    }
    get stored(): Record<string, Count<string | Mech>> {

        const mySelf = this;
        const result : Record<string, Count<string|Mech>> = {};
        return new Proxy(result, {
            get(target, prop, receiver) {
                if (typeof prop === "string") {
                    return mySelf.getStored(prop);
                } else {
                    return Reflect.get(target, prop, receiver);
                }
            },
            set(target, prop, newValue, receiver): boolean {
                if (typeof prop === "string") {
                    mySelf.setStored(prop, newValue);
                    return true;
                }
                return Reflect.set(target, prop, newValue, receiver);
            },
            deleteProperty(target, prop): boolean {
                return typeof prop === "string" && (mySelf.deleteStored(prop) !== undefined);
            }
        });
    }
    bays: MechBay[] = [];
    get isComplete(): boolean {
        return this.myParts.entries().every( ( entry: [string, Count<string | Mech>]) => (typeof entry[1]?.value !== "string")) &&
        this.myStored.entries().every( ( entry: [string, Count<string | Mech>]) => (typeof entry[1]?.value !== "string"));
    };

}

export default MechStorage;