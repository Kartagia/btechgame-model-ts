import {test, expect} from 'vitest';

import { Count, createCount, createIntCount } from '../main/mech.ts';

test("Testing create count", () => {
    let count: Count<void>|undefined = undefined;
    expect(() => {
        count = createCount(undefined, 0, (val: undefined) => ("Undefined"))
    }).not.toThrow();
    count = createCount(undefined, 0, (val: undefined) => ("Undefined"))
    expect(count?.value).toBeUndefined();
    expect(count?.count).toBe(0);
});
