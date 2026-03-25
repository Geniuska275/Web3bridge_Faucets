import { useAppKitAccount } from "@reown/appkit/react";
import {useFaucetContract } from "../useContract";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { getMaxSupply } from "@/features/token-faucet/services/tokenService";


export const useReadFaucet = () => {
  const faucetContract = useFaucetContract();
  const { address } = useAppKitAccount();
  const [isLoadingTokenName, setIsLoadingTokenName] = useState(false);

  const getTokenName = useCallback(async () => {
    // if(!address){
    //     toast.error("Wallet not connected!");
    //     return;
    // }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return null;
    }
    try {
  
      const result= await faucetContract.name();
      return result;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingTokenName(false);
    }
  }, [address, faucetContract]);


  const getSymbol = useCallback(async () => {
    // if(!address){
    //     toast.error("Wallet not connected!");
    //     return;
    // }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return null;
    }
    try {
  
      const result= await faucetContract.symbol();
      return result;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingTokenName(false);
    }
  }, [address, faucetContract]);



   const getCooldown = useCallback(async () => {
    // if(!address){
    //     toast.error("Wallet not connected!");
    //     return;
    // }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return null;
    }
    try {
  
      const result= await faucetContract.cooldown();
      return result;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingTokenName(false);
    }
  }, [address, faucetContract]);




  const getTotalSupply = useCallback(async () => {
    // if(!address){
    //     toast.error("Wallet not connected!");
    //     return;
    // }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return null;
    }
    try {
  
      const result= await faucetContract.totalSupply();
      return result;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingTokenName(false);
    }
  }, [address, faucetContract]);
  

  const getBalance = useCallback(async () => {
    // if(!address){
    //     toast.error("Wallet not connected!");
    //     return;
    // }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return null;
    }
    try {
  
      const result= await faucetContract.totalSupply();
      return result;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingTokenName(false);
    }
  }, [address, faucetContract]);

  return {
    isLoadingTokenName,
    getTokenName,
    getSymbol,
    getTotalSupply,
    getMaxSupply,
    getBalance,
    getCooldown
  };
};
