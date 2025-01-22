import { ethers } from "ethers";

const hashMove = (move: number, salt: string | number): string => {
  console.log(move, salt);
  const hash = ethers.solidityPackedKeccak256(
    ["uint8", "string"],
    [move, salt]
  );

  return hash;
};

export default hashMove;
