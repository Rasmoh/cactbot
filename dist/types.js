"use strict";
exports.__esModule = true;
exports.Payouts = exports.LineDefinitions = void 0;
exports.LineDefinitions = [
    { name: "Top Row", indices: [0, 1, 2] },
    { name: "Middle Row", indices: [3, 4, 5] },
    { name: "Bottom Row", indices: [6, 7, 8] },
    { name: "Left Column", indices: [0, 3, 6] },
    { name: "Middle Column", indices: [1, 4, 7] },
    { name: "Right Column", indices: [2, 5, 8] },
    { name: "\\ Diagonal", indices: [0, 4, 8] },
    { name: "/ Diagonal", indices: [2, 4, 6] },
];
// The payout value of each possible line sum
exports.Payouts = [
    0, 0, 0, 0, 0, 0, 10000, 36, 720, 360, 80, 252, 108, 72, 54, 180, 72, 180, 119, 36, 306, 1080, 144, 1800, 3600,
];
