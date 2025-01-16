import { ethers } from "ethers";

const hashMove = (move: number, salt: string | number): string => {
  const hash = ethers.solidityPackedKeccak256(
    ["uint8", "uint256"],
    [move, salt]
  );

  console.log(hash, "the move index -> ", move);

  return hash;
};

export default hashMove;
