"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.choose = void 0;
/**
 * Choose `k` elements from `array`.
 *
 * Returns a generator function that returns the next combination of elements
 * each time it is called, or `undefined` if there are no more combinations.
 */
var choose = function (array, k) {
    if (k === 1) {
        // Base case. Return each remaining element in turn.
        var index_1 = 0;
        var next = function () {
            if (index_1 >= array.length) {
                index_1 = 0;
                return undefined;
            }
            return [array[index_1++]];
        };
        return next;
    }
    else {
        // Recursively slice up the array. Pick each element in order
        // and then choose `k - 1` elements from the remaining.
        var index_2 = 0;
        var subset_1 = exports.choose(array.slice(index_2 + 1), k - 1);
        var next = function () {
            var r = subset_1();
            if (!r) {
                ++index_2;
                if (index_2 >= array.length - (k - 1)) {
                    index_2 = 0;
                    return undefined;
                }
                subset_1 = exports.choose(array.slice(index_2 + 1), k - 1);
                r = subset_1();
            }
            return __spreadArray([array[index_2]], r);
        };
        return next;
    }
};
exports.choose = choose;
