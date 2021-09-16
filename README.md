# cactbot

A playing aid for Final Fantasy 14's Mini-Cactpot scratch-off mini-game.

### Requirements

- [Node.js](https://nodejs.dev/)

### Setup

Run this first:

- `npm i`

### Usage

- `node quick.js` or `node full.js`, to your preference

### Building

Building shouldn't be necessary if you just want to run the existing code, but if you want to try changing anything this is what you'll need to run:

- `tsc`

### How does this work?

In short, this program will ask you to input the position and number of the pre-scratched square. Afterwards, it will recommend a square to scratch off and then ask you to input the revealed number of that square. When you have scratched off three squares, it will recommend a line to pick for the maximum payout.

Of course, there's still a lot of luck involved, so results are not guaranteed.

### *How* does this work?

To understand what this program does, let's work backwards.

First, let's suppose you have a grid of nine revealed numbers. *Which line should you choose?* You should choose the line with the highest payout. So calculate the sum of each line, map that to the payout table, and you have the payout for each line.

Now, let's suppose you have a grid of numbers, but only some of them are revealed and the rest are hidden. *Which line should you choose?* The hidden numbers can be any number that hasn't been revealed somewhere else, in any combination. We consider each line one at a time. For each possible combination of hidden numbers, we calculate the payout. Take the total sum of payouts for that line and divide by the number of combinations. This gives the *expected value* of that line. You should choose the line with the greatest expected value.

Now, let's suppose you have a grid of numbers with some revealed squares, same as before. This time, however, *which square should you scratch off?* You want to scratch off the square that gives the most valuable information. [NOTE: I'm aware of algorithms developed by others that are probably better but haven't investigated them yet.] The strategy of this program is to scratch off the unrevealed square that is a member of lines with the highest total expected value. Calculate the expected value for each line as above, then for each square, sum the expected values for lines of which that square is a member. For example, the top-left square is a member of the left column, the top row, and one of the diagonals, so its value is the total expected value of those three lines.

### Evaluation

By testing every permutation of the grid and starting scratched-off square, we can evaluate how well a particular solving strategy fares versus the ideal (where you always select the line with the highest payout). There are only about 3.2 million of these permutations, so it's a reasonable computation. So you don't have to run the evaluation function yourself, here are the (cleaned up) results:

Runtime: ~5 minutes
Permutations tested: 3265920
Summed EV success rate: 36.69%
Summed EV value rating: 78.49%

A success rate of barely 1/3 does not look that impressive, but keep in mind that the algorithm favors investigating high EV lines. If such a line doesn't exist, the algorithm isn't going to have a great chance of finding the best, lower-paying line. The EV value rating is better. In essence, it says that if you played every possible grid, you'd earn 78% of the maximum payout. In other words, this strategy largely succeeds at finding higher payouts by ignoring lower payouts, since missing low payouts for even lower payouts doesn't matter as much.
