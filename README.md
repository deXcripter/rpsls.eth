This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Game Instructions.

#### NOTE -- Even though you can simulate both `Player1` and `Player2` from a single browser, I recommend you using two different browsers or even to different PCs to play the game.

- `Player 1` creates a game with the wallet address of player 2, `stake` some eth and make his commitment.
- `Player 2` just connects his ethereum account (it must be the same address `Player 1` used to create the game), and clicks on `Join Game`.
- After `Player 2` Joins the game, he selects his commitment and proceed. (he must have `>= stake` amount available in his wallet, else he wont be able to play the game).
- After `Player 2` plays, `Player 1` can now reveal his move, and the stake gets distributed to the winner, or splitted incase of a draw.

## Faucets

@> https://cloud.google.com/application/web3/faucet/ethereum/sepolia
