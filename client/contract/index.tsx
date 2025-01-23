import { ethers } from "ethers";
import contractABI from "./abi";
import { bytecode } from "./bytecode";

export const createGame = async (
  hashedMove: string,
  oppWallet: string,
  stake: string,
  signer: ethers.ContractRunner
) => {
  const factory = new ethers.ContractFactory(contractABI, bytecode, signer);

  const rpsContract = await factory.deploy(hashedMove, oppWallet, {
    value: ethers.parseEther(stake.toString()),
  });

  await rpsContract.waitForDeployment();
  const contractAddress = await rpsContract.getAddress();
  return { contractAddress, rpsContract };
};

export const play = async (
  contractAddress: string,
  c2: number,
  signer: ethers.ContractRunner
) => {
  console.log(c2);
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const stake = await contract.stake();
  const tx = await contract.play(c2, {
    value: stake,
  });
  await tx.wait();
};

export const solveGame = async (
  contractAddress: string,
  move: number,
  salt: number,
  signer: ethers.ContractRunner
) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const tx = await contract.solve(move, salt);

  await tx.wait();
};

export const claimPlayer2Timeout = async (
  contractAddress: string,
  signer: ethers.ContractRunner
) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const tx = await contract.j2Timeout();
  await tx.wait();
};

export const claimPlayer1Timeout = async (
  contractAddress: string,
  signer: ethers.ContractRunner
) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const tx = await contract.j1Timeout();
  await tx.wait();
};

export const checkWinForPlayer1 = async (
  contractAddress: string,
  playerMove: number,
  signer: ethers.ContractRunner
) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const opponentMove = await contract.c2();
  const formatted = opponentMove.toString();
  return await contract.win(playerMove, formatted);
};

export const checkWinForPlayer2 = async (
  contractAddress: string,
  playerMove: number,
  signer: ethers.ContractRunner
) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const opponentMove = await contract.c2();
  const formatted = opponentMove.toString();
  return await contract.win(parseInt(formatted), playerMove);
};
