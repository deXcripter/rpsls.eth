import { ethers } from "ethers";

const hashMove = (move: number, salt: string | number): string => {
  const hash = ethers.solidityPackedKeccak256(
    ["uint8", "uint256"],
    [move, salt]
  );

  return hash;
};

export default hashMove;
