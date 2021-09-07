/**
 * Choose `k` elements from `array`.
 *
 * Returns a generator function that returns the next combination of elements
 * each time it is called, or `undefined` if there are no more combinations.
 */
export const choose = <T>(array: T[], k: number): (() => T[] | undefined) => {
    if (k === 1) {
        // Base case. Return each remaining element in turn.
        let index = 0;
        const next = () => {
            if (index >= array.length) {
                index = 0;
                return undefined;
            }

            return [array[index++]];
        };

        return next;
    } else {
        // Recursively slice up the array. Pick each element in order
        // and then choose `k - 1` elements from the remaining.
        let index = 0;
        let subset = choose(array.slice(index + 1), k - 1);
        const next = () => {
            let r = subset();
            if (!r) {
                ++index;
                if (index >= array.length - (k - 1)) {
                    index = 0;
                    return undefined;
                }

                subset = choose(array.slice(index + 1), k - 1);
                r = subset();
            }
            return [array[index], ...r];
        };

        return next;
    }
};
