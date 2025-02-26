

/**
 * The weight class types. 
 */
export type WeightClassType = "Light" | "Medium" | "Heavy" | "Assault" | "Super Heavy";

/**
 * The interface of any unit.
 */
export interface Unit {
    /**
     * The model of the unit.
     */
    model: string;

    /**
     * The name of the unit.
     */
    name: string;

    /**
     * The unit type. 
     */
    type: string;

    /**
     * The tonnage of the unit.
     */
    tonnage: number;

    /**
     * The weight classification of the unit.
     */
    weightClass: WeightClassType;

}

/**
 * The mech types. 
 */
export type MechType = ("Quad" | "Humanoid");

/**
 * Class representing a mech.
 */
export class Mech implements Unit {

    type: MechType;
    model: string;
    name: string;
    weightClass: WeightClassType;
    tonnage: number;

    /**
     * Create a new mech.
     * @param model The mech model name.
     * @param [name] The mech name. Defaults to the model name.
     * @param [type] The mech type. Defaults to "Humanoid". 
     */
    constructor(model: string, name: string | undefined = undefined, type: MechType = "Humanoid", tonnage: number = 20) {
        this.type = type;
        this.model = model;
        this.name = name ?? model;
        this.tonnage = tonnage;
        this.weightClass = (tonnage <= 35 ? "Light" : (tonnage <= 55 ? "Medium" : (tonnage <= 75 ? "Heavy" : "Assault")));
    }

}

/**
 * A modifier type.
 */
export type Modifier<TYPE = number> = {
    name: string;
    target: string;
    modifier: TYPE;
}

/**
 * An equipment.
 */
export type Equipment = {

    /**
     * The equipment name.
     */
    name: string;
    /**
     * The equipment weight.
     */
    weight: number;

    /**
     * The equipment size in critical slots.
     */
    size: number;

    /**
     * The item modifiers.
     */
    modifiers: Modifier[];

    /**
     * The amount of heat the equipment use produces.
     */
    heat: number;
};

/**
 * A weapon type. 
 */
export type WeaponType = "Energy" | "Ballistic" | "Missile" | "Support";

/**
 * Weapon is an equipment causing damage.
 */
export interface Weapon extends Equipment {
    /**
     * The weapon type.
     */
    weaponType: WeaponType;

    /**
     * The weapon damage.
     */
    damage: number;

    /**
     * The damage modifiers, if the wepaon has some.
     */
    damageMods: Modifier[];
}

export type Location = string;

export type MechLocation = "H" | "LT" | "CT" | "RT" | "LA" | "RA" | "LL" | "RL";

export type VehicleLocation = "F" | "LS" | "RS" | "R" | "T" | "B";


/**
 * The loadout of an unit.
 */
export type Loadout = Map<Location, Equipment[]>;

/**
 * Calculate the total weight of equipment.
 * @param source The source, whose total value is calculated. It may be mapping with equipment list, an equipment list, or a single equipment.
 * @returns The total weight of the equipment.
 */
export function totalWeight<TYPE>(source: Map<TYPE, Equipment[] | Equipment> | Equipment[] | Equipment): number {
    let total = 0;
    if (source instanceof Map) {
        return [...source.entries()].reduce((result: number, entry: [TYPE, Equipment[] | Equipment]) => (result + totalWeight(entry[1] ?? [])), total);
    } else if (Array.isArray(source)) {
        return source.reduce((result: number, item: Equipment) => (result + item.weight), 0);
    } else {
        return source.weight;
    }
}

/**
 * A stored mech. 
 */
export class StoredMech extends Mech {

    /**
     * The default configuration for the stored mech.
     */
    defaultConfig?: Loadout;

    constructor(mech: Mech, defaultConfig: Loadout | undefined = undefined) {
        super(mech.model, mech.name, mech.type, mech.tonnage);
        this.defaultConfig = defaultConfig;
    }

    /**
     * 
     * @param loadout 
     * @throws {SyntaxError} The loadout could not be loaded.
     */
    assemble(loadout: Loadout): AssembledMech {

        return new AssembledMech(this, loadout ?? this.defaultConfig);
    }
}

/**
 * A mech which is assembled.
 */
export class AssembledMech extends Mech {

    loadout: Loadout;

    constructor(mech: Mech, loadout?: Loadout) {
        super(mech.model, mech.name, mech.type, mech.tonnage);
        this.loadout = loadout ?? new Map();
    }

    availableTonnage(): number {
        return this.tonnage - [...this.loadout.entries()].map(([location, entry], index) => (entry.reduce((result: number, item: Equipment) => (result + item.weight), 0))).reduce(
            (result, val) => (result + val), 0
        );
    }
}

/**
 * A pair of a value and its count.
 */
export type Count<TYPE> = {
    /**
     * The counted value.
     */
    value: TYPE;
    /**
     * The count.
     */
    count: number;
    valueOf(): number;
    toString(): string;
    /**
     * Create a new count with a delta added to the count.
     * @param delta The added count.
     * @returns The count with given number added to the count.
     * @throws {RangeError} The count was invalid.
     */
    add(delta: number): Count<TYPE>;

    /**
     * Create a new count with a value.
     * @param newCount The new count.
     * @reutrns The count with given new count.
     * @throws {RangeError} The new count was not accepted.
     */
    set(newCount: number): Count<TYPE>;
}

/**
 * Create a value.
 * @param value The value. 
 * @param count The count of values. @default 1
 * @param stringifier The stringifier of the value. @default + The defualt stringifier of the javascript.
 * @returns The count with given paramters.
 */
export function createCount<TYPE>(value: TYPE, count: number = 1, stringifier: (val: TYPE) => string = (val) => ("" + val),
    validator: (val: number) => boolean = (val) => (true)): Count<TYPE> {

    if (!validator(count)) {
        throw new RangeError("Invalid count");
    }

    /**
     * Create resulting count.
     */
    const result: Count<TYPE> = {
        get value() { return value; },
        get count() { return count; },
        add(count) {
            return createCount(this.value, this.count + count, stringifier);
        },
        set(count) {
            if (validator(count)) {
                return createCount(this.value, count, stringifier);
            } else {
                throw new RangeError("Invalid new count");
            }
        },
        valueOf() { return this.count },
        toString() {
            return stringifier(this.value);
        }
    };
    return result;
}

export interface IntCountOptions<TYPE> {
    /**
     * The value stringifier.
     * @param value The stringified value.
     * @return The string reprsentation of the value.
     * @throws {SyntaxError} The value is not stringifiable.
     */
    stringifier?(value: TYPE): string;

    /**
     * Test validity of a count.
     * @param count THe tested count.
     * @eturns True, if and only if the count is a valid count.
     */
    validator?(count: number): boolean;

    /**
     * The smallest accepted value.
     */
    min?: number;

    /**
     * The largest accepted value.
     */
    max?: number;
}

/**
 * Create an integer count.
 * @param value The counted value.
 * @param count The intial counted value. Defaults to 1.
 * @param options The options of the integer count.
 * @returns The integer count with given value, count, and constraints.
 */
export function createIntCount<TYPE>(value: TYPE, count: number = 1, options: IntCountOptions<TYPE> = {}): Count<TYPE> {

    const validator = (value: number) => (Number.isSafeInteger(value) && (options.validator === undefined || options.validator(count)) 
&& ((options.min ?? Number.MIN_SAFE_INTEGER) <= count && count <= (options.max ?? Number.MAX_SAFE_INTEGER)));
    
    if (!validator(count)) {
        throw new RangeError("Invalid count");
    }

    /**
     * Create resulting count.
     */
    const result: Count<TYPE> = {
        get value() { return value; },
        get count() { return count; },
        add(count) {
            if (!validator(count)) {
                throw new RangeError("Invalid added count");
            } 
            return createIntCount(this.value, this.count + count, options);
        },
        set(count) {
            if (validator(count)){
                return createIntCount(this.value, count, options);
            } else {
                throw new RangeError("Invalid new count");
            }
        },
        valueOf() { return this.count },
        toString() {
            return (options?.stringifier || ((val) => (""+val)))(this.value);
        }
    };
    return result;


    return createCount(value, count, options.stringifier ?? ((value: TYPE) => ("" + value)),
        (val: number) => (Number.isSafeInteger(val) && (!options.validator || options.validator(val)) &&
            (options.max === undefined || count <= options.max) && (options.min === undefined || options.min <= count)));
}


/**
 * A mech bay stores mechs.
 */
export type MechBay = {
    /**
     * The name of the mech bay.
     */
    name: string;
    /**
     * The capacity of the mech bay.
     */
    capacity: number;
    /**
     * The contents of the mech bay.
     */
    contents: AssembledMech[];

    /**
     * Add mech to the mech bay.
     * @param mech The added mech.
     * @returns True, if and only if the mech was added to the mech bay.
     */
    addMech(mech: AssembledMech): boolean;

    /**
     * Store an assembled mech in the bay. The bay emptied.
     * @param mech THe stored mech, or mech position in the mech bay.
     * @returns The stored mech and the unassembled equipment, or an undefined
     * value indicating the bay does not have a mech.
     */
    storeMech(mech: AssembledMech | number): [StoredMech, Loadout] | undefined;
}


