import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import useRunners from "./useRunner.ts";
import { FAUCET_TOKEN_ABI } from "../ABI/faucet.ts";

export const useFaucetContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS),
        FAUCET_TOKEN_ABI,
        signer
      );
    }
    return new Contract(
      getAddress(import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS),
      FAUCET_TOKEN_ABI,
      readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner]);
};
