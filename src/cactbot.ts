import { createInterface } from "readline";
import { green, gray } from "ansi-colors";
import { choose } from "./choose";
import { LineDefinitions, Payouts } from "./types";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * Ask a question to the user and return an answer
 */
const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

/**
 * Ask a question and ensure a valid number 1-9 is returned
 */
const num_question = async (query: string): Promise<number> => {
    while (true) {
        try {
            const raw = await question(query);
            const result = Number.parseInt(raw, 10);
            if (result >= 1 && result <= 9) {
                return result;
            }
        } catch (error) {}
    }
};

/**
 * Given a board state with partial information, return the expected
 * value of each line
 */
const calculateEVs = (boardState: number[]) => {
    // Only choose numbers that haven't already been revealed
    const remainingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((number) => boardState.indexOf(number) === -1);
    const evList = [];

    LineDefinitions.forEach((lineDefinition) => {
        let existingTotal = 0;
        let blanks = 0;
        // Count the number of un-revealed squares in this line as well as the sum of the
        // revealed squares, for use below
        for (let i = 0; i < 3; ++i) {
            if (boardState[lineDefinition.indices[i]] > 0) {
                existingTotal += boardState[lineDefinition.indices[i]];
            } else {
                blanks++;
            }
        }

        if (blanks > 0) {
            let totalValue = 0;
            let combinationCount = 0;
            // Of the un-revealed numbers, choose one for each un-revealed square in this line
            const numbers_next = choose(remainingNumbers, blanks);
            let chosenNumbers: number[];
            while ((chosenNumbers = numbers_next())) {
                // Sum the numbers for each combination for this line and keep a running total
                // of the payout values.
                let lineTotal = existingTotal + chosenNumbers.reduce((total, current) => total + current);
                totalValue += Payouts[lineTotal];
                combinationCount++;
            }
            // Divide the payout value running total by the number of different combinations
            // to get the expected value
            evList.push(totalValue / combinationCount);
        } else {
            // This line is already entirely revealed, so the EV is just the actual value
            evList.push(Payouts[existingTotal]);
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
const mapEVs = (evList: number[]) => {
    const evMap = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < evList.length; ++i) {
        LineDefinitions[i].indices.forEach((lineIndex) => (evMap[lineIndex] += evList[i]));
    }
    return evMap;
};

/**
 * Display the list of EVs and highlight the best one.
 */
const renderEVList = (evList: number[]) => {
    const bestEVIndex = evList.reduce((prev, val, index) => {
        return evList[index] > evList[prev] ? index : prev;
    }, 0);

    for (let i = 0; i < evList.length; ++i) {
        let color = gray;
        if (i === bestEVIndex) {
            color = green;
        }
        console.log(color(`${LineDefinitions[i].name}: ${evList[i]}`));
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
const renderEVMap = (boardState: number[], evMap: number[]) => {
    const bestEVIndex = evMap.reduce((prev, val, index) => {
        if (boardState[index] === 0) {
            if (prev === -1) {
                return index;
            } else {
                return evMap[index] > evMap[prev] ? index : prev;
            }
        } else {
            return prev;
        }
    }, -1);

    for (let i = 0; i < 3; ++i) {
        let line = "";
        for (let j = 0; j < 3; ++j) {
            const index = i * 3 + j;
            if (boardState[index] === 0) {
                let color = gray;
                if (index === bestEVIndex) {
                    color = green;
                }
                line = line.concat(color(`${evMap[index].toFixed(0).toString().padStart(4)} `));
            } else {
                line = line.concat(gray("---- "));
            }
        }
        console.log(line);
    }
    console.log();

    return bestEVIndex;
};

export const run = async (quick: boolean) => {
    const boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let previousPosition: number = -1;
    let evList: number[] = [];
    let evMap: number[] = [];

    for (let i = 0; i < 4; ++i) {
        let position: number = 0;
        let value: number = 0;


        if (quick && previousPosition !== -1) {
            // In quick mode assume the user scratched off the recommended square
            position = previousPosition;
        } else {
            position = (await num_question("Position (1 - 9): ")) - 1;
        }

        value = await num_question("Value (1 - 9): ");
        console.log();
        rl.pause();

        boardState[position] = value;
        evList = calculateEVs(boardState);

        if (i < 3) {
            // The first three times, recommend a square to scratch off
            evMap = mapEVs(evList);
            previousPosition = renderEVMap(boardState, evMap);
        } else {
            // The last time, recommend a line to choose
            renderEVList(evList);
        }
    }
};
