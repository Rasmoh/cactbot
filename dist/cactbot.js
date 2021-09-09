"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.run = void 0;
var readline_1 = require("readline");
var ansi_colors_1 = require("ansi-colors");
var choose_1 = require("./choose");
var types_1 = require("./types");
var rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**
 * Ask a question to the user and return an answer
 */
var question = function (query) {
    return new Promise(function (resolve) {
        rl.question(query, resolve);
    });
};
/**
 * Ask a question and ensure a valid number 1-9 is returned
 */
var num_question = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var raw, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, question(query)];
            case 2:
                raw = _a.sent();
                result = Number.parseInt(raw, 10);
                if (result >= 1 && result <= 9) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}); };
/**
 * Given a board state with partial information, return the expected
 * value of each line
 */
var calculateEVs = function (boardState) {
    // Only choose numbers that haven't already been revealed
    var remainingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (number) { return boardState.indexOf(number) === -1; });
    var evList = [];
    types_1.LineDefinitions.forEach(function (lineDefinition) {
        var existingTotal = 0;
        var blanks = 0;
        // Count the number of un-revealed squares in this line as well as the sum of the
        // revealed squares, for use below
        for (var i = 0; i < 3; ++i) {
            if (boardState[lineDefinition.indices[i]] > 0) {
                existingTotal += boardState[lineDefinition.indices[i]];
            }
            else {
                blanks++;
            }
        }
        if (blanks > 0) {
            var totalValue = 0;
            var combinationCount = 0;
            // Of the un-revealed numbers, choose one for each un-revealed square in this line
            var numbers_next = choose_1.choose(remainingNumbers, blanks);
            var chosenNumbers = void 0;
            while ((chosenNumbers = numbers_next())) {
                // Sum the numbers for each combination for this line and keep a running total
                // of the payout values.
                var lineTotal = existingTotal + chosenNumbers.reduce(function (total, current) { return total + current; });
                totalValue += types_1.Payouts[lineTotal];
                combinationCount++;
            }
            // Divide the payout value running total by the number of different combinations
            // to get the expected value
            evList.push(totalValue / combinationCount);
        }
        else {
            // This line is already entirely revealed, so the EV is just the actual value
            evList.push(types_1.Payouts[existingTotal]);
        }
    });
    return evList;
};
/**
 * For a given list of expected line values, return a list of values representing
 * the total EV of each square. For example, the top-left square (index 0 in the return list)
 * is the sum of the top row line EV, the left column line EV, and the \ diagonal EV, since
 * the top-left square is a member of each of those lines.
 */
var mapEVs = function (evList) {
    var evMap = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var _loop_1 = function (i) {
        types_1.LineDefinitions[i].indices.forEach(function (lineIndex) { return (evMap[lineIndex] += evList[i]); });
    };
    for (var i = 0; i < evList.length; ++i) {
        _loop_1(i);
    }
    return evMap;
};
/**
 * Display the list of EVs and highlight the best one.
 */
var renderEVList = function (evList) {
    var bestEVIndex = evList.reduce(function (prev, val, index) {
        return evList[index] > evList[prev] ? index : prev;
    }, 0);
    for (var i = 0; i < evList.length; ++i) {
        var color = ansi_colors_1.gray;
        if (i === bestEVIndex) {
            color = ansi_colors_1.green;
        }
        console.log(color(types_1.LineDefinitions[i].name + ": " + evList[i]));
    }
    console.log();
};
/**
 * Display the board with each square's total EV, highlighting the highest
 * total. This represents the un-revealed square the user should scratch off
 * to provide the most valuable information.
 *
 * Also returns the position of the square the user should scratch off so
 * we can avoid asking them the position they scratched off next time.
 */
var renderEVMap = function (boardState, evMap) {
    var bestEVIndex = evMap.reduce(function (prev, val, index) {
        if (boardState[index] === 0) {
            if (prev === -1) {
                return index;
            }
            else {
                return evMap[index] > evMap[prev] ? index : prev;
            }
        }
        else {
            return prev;
        }
    }, -1);
    for (var i = 0; i < 3; ++i) {
        var line = "";
        for (var j = 0; j < 3; ++j) {
            var index = i * 3 + j;
            if (boardState[index] === 0) {
                var color = ansi_colors_1.gray;
                if (index === bestEVIndex) {
                    color = ansi_colors_1.green;
                }
                line = line.concat(color(evMap[index].toFixed(0).toString().padStart(4) + " "));
            }
            else {
                line = line.concat(ansi_colors_1.gray("---- "));
            }
        }
        console.log(line);
    }
    console.log();
    return bestEVIndex;
};
var run = function (quick) { return __awaiter(void 0, void 0, void 0, function () {
    var boardState, previousPosition, evList, evMap, i, position, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                previousPosition = -1;
                evList = [];
                evMap = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < 4)) return [3 /*break*/, 7];
                position = 0;
                value = 0;
                if (!(quick && previousPosition !== -1)) return [3 /*break*/, 2];
                // In quick mode assume the user scratched off the recommended square
                position = previousPosition;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, num_question("Position (1 - 9): ")];
            case 3:
                position = (_a.sent()) - 1;
                _a.label = 4;
            case 4: return [4 /*yield*/, num_question("Value (1 - 9): ")];
            case 5:
                value = _a.sent();
                console.log();
                rl.pause();
                boardState[position] = value;
                evList = calculateEVs(boardState);
                if (i < 3) {
                    // The first three times, recommend a square to scratch off
                    evMap = mapEVs(evList);
                    previousPosition = renderEVMap(boardState, evMap);
                }
                else {
                    // The last time, recommend a line to choose
                    renderEVList(evList);
                }
                _a.label = 6;
            case 6:
                ++i;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.run = run;
