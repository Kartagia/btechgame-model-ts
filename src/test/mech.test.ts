import { test, it, expect, describe } from 'vitest';

import { Count, createCount, createIntCount } from '../main/mech.ts';

describe("Testing create count", () => {
    it("Void valued count", () => {
        let count: Count<void> | undefined = undefined;
        expect(() => {
            count = createCount(undefined, 0, (val: undefined) => ("Undefined"))
        }).not.toThrow();
        count = createCount(undefined, 0, (val: undefined) => ("Undefined"))
        expect(count?.value).toBeUndefined();
        expect(count?.count).toBe(0);
    });
    it("String valued count", () => {
        let count: Count<string> | undefined;
        expect(() => {
            count = createCount("Foo", 0, undefined, (val) => (Number.isFinite(val)));
        }).not.toThrow();
        expect(count?.value).toBeDefined();
        expect(count?.value).toBe("Foo");
        expect(count?.count).toBe(0);
        expect(count?.toString()).toBe("Foo");
    });
});



test("Count add", () => {
    let count: Count<string> | undefined;
    expect(() => {
        count = createCount("Foo", 0, undefined, (val) => (Number.isFinite(val)));
        count = count.add(Number.MAX_SAFE_INTEGER);
    }).not.toThrow();

});

test("Testing create int count", () => {
    let count: Count<void> | undefined = undefined;
    expect(() => {
        count = createIntCount(undefined, 0, { stringifier: (val: undefined) => ("Undefined") })
    }).not.toThrow();
    count = createIntCount(undefined, 0, { stringifier: (val: undefined) => ("Undefined") })
    expect(count?.value).toBeUndefined();
    expect(count?.count).toBe(0);
    expect(() => {
        count = createIntCount(undefined, 0.5, { stringifier: (val: undefined) => ("Undefined") });
    }, `Expect ${Number.isSafeInteger(0.5)} to be ${false}`).toThrow();
});
