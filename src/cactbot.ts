import { createInterface } from "readline";
import { green, gray } from "ansi-colors";
import { choose } from "./choose";
import { LineDefinitions, Payouts } from "./types";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (query: string): Promise<string> => {
    return new Promise(resolve => {
        rl.question(query, resolve);
    })
}

const num_question = async (query): Promise<number> => {
    while (true) {
        try {
            const raw = await question(query);
            const result = Number.parseInt(raw, 10);
            if (result >= 1 || result <= 9) {
                return result;
            }
        } catch (error) { }
    }
}

const calculateEVs = (boardState: number[]) => {
    const remainingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(number => boardState.indexOf(number) === -1);
    const evList = [];

    LineDefinitions.forEach(lineDefinition => {
        let existingTotal = 0;
        let blanks = 0;
        for (let i = 0; i < 3; ++i) {
            if (boardState[lineDefinition.indices[i]] > 0) {
                existingTotal += boardState[lineDefinition.indices[i]]
            } else {
                blanks++;
            }
        }

        if (blanks > 0) {
            let totalValue = 0;
            let combinationCount = 0;
            const numbers_next = choose(remainingNumbers, blanks);
            let chosenNumbers: number[];
            while (chosenNumbers = numbers_next()) {
                let lineTotal = existingTotal + chosenNumbers.reduce((total, current) => total + current);
                totalValue += Payouts[lineTotal];
                combinationCount++;
            }
            evList.push(totalValue / combinationCount);
        } else {
            evList.push(Payouts[existingTotal]);
        }
    });

    return evList;
};

const mapEVs = (boardState: number[], evList: number[]) => {
    const evMap = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < evList.length; ++i) {
        LineDefinitions[i].indices.forEach(lineIndex => evMap[lineIndex] += evList[i]);
    }
    return evMap;
}

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
}

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
            const index = (i * 3) + j;
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
}

export const runSimple = () => {
    if (process.argv.length != 11) {
        console.log("Please specify all nine positions");
    } else {

        const input: number[] = [];

        for (let i = 2; i < 11; ++i) {
            input.push(Number.parseInt(process.argv[i], 10));
        }

        const evList = calculateEVs(input);

        renderEVList(evList);
    }
    rl.close();
}

export const run = async (quick: boolean) => {
    const boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let position: number = 0;
    let previousPosition: number = 0;
    let value: number = 0;
    let evList: number[] = [];
    let evMap: number[] = [];
    
    position = await num_question("Position (1 - 9): ") - 1;
    value = await num_question("Value (1 - 9): ");
    console.log();
    rl.pause();

    boardState[position] = value;
    evList = calculateEVs(boardState);
    evMap = mapEVs(boardState, evList);
    previousPosition = renderEVMap(boardState, evMap);

    if (quick) {
        position = previousPosition;
    } else {
        position = await num_question("Position (1 - 9): ") - 1;
    }
    value = await num_question("Value (1 - 9): ");
    console.log();
    rl.pause();

    boardState[position] = value;
    evList = calculateEVs(boardState);
    evMap = mapEVs(boardState, evList);
    previousPosition = renderEVMap(boardState, evMap);

    if (quick) {
        position = previousPosition;
    } else {
        position = await num_question("Position (1 - 9): ") - 1;
    }
    value = await num_question("Value (1 - 9): ");
    console.log();
    rl.pause();

    boardState[position] = value;
    evList = calculateEVs(boardState);
    evMap = mapEVs(boardState, evList);
    previousPosition = renderEVMap(boardState, evMap);

    if (quick) {
        position = previousPosition;
    } else {
        position = await num_question("Position (1 - 9): ") - 1;
    }
    value = await num_question("Value (1 - 9): ");
    console.log();
    rl.pause();

    boardState[position] = value;
    evList = calculateEVs(boardState);
    renderEVList(evList);
}