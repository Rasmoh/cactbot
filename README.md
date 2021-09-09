# cactbot

A playing aid for Final Fantasy 14's Mini-Cactpot scratch-off mini-game.

### Requirements

- [Node.js](https://nodejs.dev/)

### Usage

- `node quick.js` or `node full.js`, to your preference

### Building

Building shouldn't be necessary if you just want to run the existing code, but if you want to try changing anything this is what you'll need to run:

- `npm i`
- `tsc`

### How does this work?

In short, this program will ask you to input the position and number of the pre-scratched square. Afterwards, it will recommend a square to scratch off and then ask you to input the revealed number of that square. When you have scratched off three squares, it will recommend a line to pick for the maximum payout.

Of course, there's still a lot of luck involved, so results are not guaranteed.

### *How* does this work?

To understand what this program does, let's work backwards.

First, let's suppose you have a grid of nine revealed numbers. *Which line should you choose?* You should choose the line with the highest payout. So calculate the sum of each line, map that to the payout table, and you have the payout for each line.

Now, let's suppose you have a grid of numbers, but only some of them are revealed and the rest are hidden. *Which line should you choose?* The hidden numbers can be any number that hasn't been revealed somewhere else, in any combination. We consider each line one at a time. For each possible combination of hidden numbers, we calculate the payout. Take the total sum of payouts for that line and divide by the number of combinations. This gives the *expected value* of that line. You should choose the line with the greatest expected value.

Now, let's suppose you have a grid of numbers with some revealed squares, same as before. This time, however, *which square should you scratch off?* You want to scratch off the square that gives the most valuable information. [NOTE: I'm uncertain whether the strategy I've implemented and present here is optimal, but I suspect it's at least pretty good.] The strategy of this program is to scratch off the unrevealed square that is a member of lines with the highest total expected value. Calculate the expected value for each line as above, then for each square, sum the expected values for lines of which that square is a member. For example, the top-left square is a member of the left column, the top row, and one of the diagonals, so its value is the total expected value of those three lines.