"use client";

import { ethers } from "ethers";

const hashMove = (move: number, salt: string | number): string => {
  const abiCoder = new ethers.AbiCoder();
  const encodedParams = abiCoder.encode(["uint8", "string"], [move, salt]);
  return ethers.keccak256(encodedParams);
};

export default hashMove;
