export const getContractAddress = (): string => {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is not defined");
  }
  return address;
};
