
/**
 * The mech storage for storing mechs.
 * @module 
 */

import BTechGameModel from "./index.ts";
import { Count, createCount, createIntCount, Mech, MechBay } from "./mech.ts";

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
    parts: Record<string, (Count<Mech | string>)>;
    /**
     * The stored mech chassis count.
     * If the value is a string, the mech does not exists in mech the mech data source.
     */
    stored: Record<string, (Count<Mech | string>)>;
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

    private myParts: Map<string, Count<string | Mech>> = new Map();

    private myStored: Map<string, Count<string | Mech>> = new Map();
    
    
    
    constructor(name: string, options?: Partial<{ parts: Iterable<Count<string | Mech>>, stored: Iterable<Count<string | Mech>> }>) {
        this.myName = name;
        if (options) {
            if (options.parts) {
                for (let count of options.parts) {
                    switch (typeof count.value) {
                        case "string":
                            this.addParts(count.value, count.count); 
                            break;
                        default:
                            // Mech.
                            this.addParts(count.value.model, count.count);
                    }
                }
            }
            if (options.stored) {
                for (let count of options.stored) {
                    switch (typeof count.value) {
                        case "string":
                            this.addStored(count.value, count.count); 
                            break;
                        default:
                            // Mech.
                            this.addStored(count.value.model, count.count);
                    }
                }

            }
        };
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
    getParts(model: string): Count<string | Mech> | undefined {
        return this.myParts.get(model);
    }

    /**
     * Remove all parts from the storage.
     * @param model The removed model.
     * @returns The number of parts removed. An undefined value
     * indicates there is no parts to remove.
     */
    deleteParts(model: string): number | undefined {
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
     * @throws {RangeError} The count is invalid.
     */
    setParts(model: string, count: number): Count<string | Mech> | undefined {
        if (!(Number.isSafeInteger(count) || count < 0)) {
            throw new RangeError("The part count is invalid");
        }
        let current = this.myParts.get(model);
        if (current) {
            this.myParts.set(model, current.set(count));
            return current;
        } else {
            // Adding a new model
            this.myParts.set(model, createIntCount(model, count, { min: 0 }));
            return undefined;
        }
    }

    /**
     * Add parts to storage.
     * @param model The model, whose parts is added.
     * @param delta The mount of parts added. 
     */
    addParts(model: string, delta: number) {
        const current : Count<string | Mech>|undefined = this.myParts.get(model);
        if (current) {
            this.setParts(model, current.add(delta).count);
        } else {
            this.setParts(model, delta);
        }
    }

    /**
     * Remove parts from storage.
     * @param model The model.
     * @param count The amoutn of parts removed.
     */
    removeParts(model: string, count: number) {
        const current : Count<string | Mech>|undefined = this.myParts.get(model);
        if (current) {
            this.setParts(model, current.add(-count).count);
        } else {
            this.setParts(model, -count);
        }

    }

    /**
     * Get the stored chassis count.
     * @param model The queried model.
     * @returns An undefined value, if the storage does not recognize the model.
     * Otherwise returns the count of stored the storage has.
     */
    getStored(model: string): Count<string | Mech> | undefined {
        return this.myStored.get(model);
    }

    /**
     * Remove all stored chassises from the storage.
     * @param model The removed model.
     * @returns The number of stored chassises removed. An undefined value
     * indicates there is no stored chassis to remove.
     */
    deleteStored(model: string): number | undefined {
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
     * @throws {RangeError} The count is invalid.
     */
    setStored(model: string, count: number|Count<string | Mech>): Count<string | Mech> | undefined {
        if (typeof count === "number" && !(Number.isSafeInteger(count) || count < 0)) {
            throw new RangeError("The part count is invalid");
        }
        let current = this.myStored.get(model);
        if (current) {
            if (typeof current.value !== "string" || typeof count === "number" || typeof count.value === "string"
                || count.value.model !== model
            ) {
                // The current value is a mech or the count does not have proper mech as its value
                // - creating a new value by deriving a count from the current count. 
                this.myStored.set(model, current.set(typeof count === "number" ? count : count.count));
            } else {
                // The current value is a count of model name, and the new count contains a valid mech.
                // - Creating a new count with count mech as its value.
                this.myStored.set(model, createIntCount(count.value, count.count, {min: 0}));
            }
            return current;
        } else if (typeof count === "number") {
            // The count is a number, thus using the model name for counted value.
            this.myStored.set(model, createIntCount(model, count, { min: 0 }));
        } else if ( (typeof count.value === "string" ? count.value : count.value.model) === model) {
            // The count.valu is either a valid mech with proper model name or a valid model name. Using it as counted value.
            this.myStored.set(model, createIntCount(count.value, count.count, {min: 0}));
        } else {
            // The count does not have a valid mech or mech name, and thus only using the count.
            this.myStored.set(model, createIntCount(model, count.count, {min: 0}));
        }
        return undefined; 
    }

    /**
     * Add stored chassis to storage.
     * @param model The model, whose chasis are stored is added.
     * @param delta The amount of added chassis. 
     */
    addStored(model: string, delta: number) {
        if (delta < 0) throw new RangeError("Cannot add negative number of stored chassis");
        const current : Count<string | Mech>|undefined = this.myStored.get(model);
        if (current) {
            this.setStored(model, current.add(delta).count);
        } else {
            this.setStored(model, delta);
        }
    }

    /**
     * Remove stored chassis from storage.
     * @param model The model, whose chasis are stored is removed.
     * @param delta The amount of removed chassis. 
     */
    removeStored(model: string, delta: number) {
        if (delta < 0) throw new RangeError("Cannot remove negative number of stored chassis");
        const current : Count<string | Mech>|undefined = this.myStored.get(model);
        if (current) {
            if (delta > current.valueOf()) {
                throw new RangeError("Cannot reduce chassic count below zero");
            }
            this.setStored(model, current.add(-delta).count);
        } else {
            this.setStored(model, -delta);
        }
    }


    get parts(): Record<string, Count<string | Mech>> {

        const mySelf = this;
        const result: Record<string, Count<string | Mech>> = {};
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
                return typeof prop === "string" && (mySelf.deleteParts(prop) !== undefined);
            }
        });
    }
    get stored(): Record<string, Count<string | Mech>> {

        const mySelf = this;
        const result: Record<string, Count<string | Mech>> = {};
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
        return this.myParts.entries().every((entry: [string, Count<string | Mech>]) => (typeof entry[1]?.value !== "string")) &&
            this.myStored.entries().every((entry: [string, Count<string | Mech>]) => (typeof entry[1]?.value !== "string"));
    };

}

export default MechStorage;