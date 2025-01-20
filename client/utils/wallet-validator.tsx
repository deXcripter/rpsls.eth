export const isValidEthereumAddress = (address: string): boolean | string => {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
  if (address === "0x0000000000000000000000000000000000000000") return false;
  return address.toLocaleLowerCase();
};
