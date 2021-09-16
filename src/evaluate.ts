import { calculateEVs, getBestEV, summedEVStrategy } from "./cactbot";
import { permute } from "./permute";

export const run = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let totalTests = 0;
    let summedEVMisses = 0;
    let totalIdealValue = 0;
    let totalSummedEV = 0;

    const startTime = Date.now();

    do {
        // Calculate ideal line
        const idealValues = calculateEVs(arr);
        const [bestValueLine, bestValue] = getBestEV(idealValues);

        for (let initialPos = 0; initialPos < 9; initialPos++)
        {
            totalTests++;
            totalIdealValue += bestValue;

            // Calculate the result using the summed EV strategy
            const boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            let previousPosition: number = initialPos;
            let evList: number[] = [];

            for (let i = 0; i < 4; ++i) {
                boardState[previousPosition] = arr[previousPosition];
                evList = calculateEVs(boardState);

                if (i < 3) {
                    // The first three times, recommend a square to scratch off
                    previousPosition = summedEVStrategy(boardState, evList)[0];
                } else {
                    // The last time, recommend a line to choose
                    const [summedEVLine, summedEV] = getBestEV(evList);
                    totalSummedEV += summedEV;
                    if (bestValueLine !== summedEVLine) {
                        summedEVMisses++;
                    }
                }
            }
        }
    } while (permute(arr));

    console.log(`Runtime: ${Date.now() - startTime}ms`);
    console.log(`Permutations tested: ${totalTests}`);
    console.log(`Summed EV success rate: ${(1 - (summedEVMisses / totalTests)) * 100}%`);
    console.log(`Summed EV value rating: ${(totalSummedEV / totalIdealValue) * 100}%`);
};
