"use strict";
exports.__esModule = true;
exports.run = void 0;
var cactbot_1 = require("./cactbot");
var permute_1 = require("./permute");
var run = function () {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var totalTests = 0;
    var summedEVMisses = 0;
    var summedHighValueMisses = 0;
    var totalIdealValue = 0;
    var totalSummedEV = 0;
    var startTime = Date.now();
    do {
        // Calculate ideal line
        var idealValues = cactbot_1.calculateEVs(arr);
        var _a = cactbot_1.getBestEV(idealValues), bestValueLine = _a[0], bestValue = _a[1];
        for (var initialPos = 0; initialPos < 9; initialPos++) {
            totalTests++;
            totalIdealValue += bestValue;
            // Calculate the result using the summed EV strategy
            var boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            var previousPosition = initialPos;
            var evList = [];
            for (var i = 0; i < 4; ++i) {
                boardState[previousPosition] = arr[previousPosition];
                evList = cactbot_1.calculateEVs(boardState);
                if (i < 3) {
                    // The first three times, recommend a square to scratch off
                    previousPosition = cactbot_1.summedEVStrategy(boardState, evList)[0];
                }
                else {
                    // The last time, recommend a line to choose
                    var _b = cactbot_1.getBestEV(evList), summedEVLine = _b[0], summedEV = _b[1];
                    totalSummedEV += summedEV;
                    if (bestValueLine !== summedEVLine) {
                        summedEVMisses++;
                        if (bestValue >= 1000) {
                            summedHighValueMisses++;
                        }
                    }
                }
            }
        }
    } while (permute_1.permute(arr));
    console.log("Runtime: " + (Date.now() - startTime) + "ms");
    console.log("Permutations tested: " + totalTests);
    console.log("Summed EV success rate: " + (1 - (summedEVMisses / totalTests)) * 100 + "%");
    console.log("Summed EV high-value success rate: " + (1 - (summedHighValueMisses / totalTests)) * 100 + "%");
    console.log("Summed EV value rating: " + (totalSummedEV / totalIdealValue) * 100 + "%");
};
exports.run = run;
