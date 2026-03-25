import { useAppKitAccount } from "@reown/appkit/react";
import { useFaucetContract } from "../useContract";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import { ethers } from "ethers";

const errorDecoder = ErrorDecoder.create();

export const useWriteTodo = () => {
  const faucetContract = useFaucetContract(true);
 
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

    
  const mintToken = useCallback(async(address : string, amount: string) : Promise<boolean> => {
    if (!address) {
      toast.error("Wallet not connected!");
      return false;
    }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return false;
    }
    try {
        setIsCreatingTask(true);
        
        const createTx = await faucetContract.mint(address, ethers.parseEther(amount));
        const receipt = await createTx.wait();
        return receipt.status === 1;
    } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
    }
  }, [ faucetContract]);

   const transferToken = useCallback(async(address : string, toAddress: string, value: string) : Promise<boolean> => {
    if (!address) {
      toast.error("Wallet not connected!");
      return false;
    }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return false;
    }
    try {
        setIsCreatingTask(true);
        
        const createTx = await faucetContract.transfer(address, ethers.parseEther(value));
        const receipt = await createTx.wait();
        return receipt.status === 1;
    } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
    }
  }, [ faucetContract]);

 const requestToken = useCallback(async(address) : Promise<boolean> => {

    if (!address) {
      toast.error("Wallet not connected!");
      return false;
    }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return false;
    }
    try {
        setIsCreatingTask(true);
        
        const createTx = await faucetContract.requestToken();
           console.log("requestTokens receipt",createTx);
        const receipt = await createTx.wait();
        console.log("requestTokens receipt", receipt);
        return receipt.status === 1;
    } catch (error) {
      console.error("Error requesting tokens:", error);
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
    }
  }, [ faucetContract]);


const getRemainingTime = useCallback(async(address) : Promise<boolean> => {

    if (!address) {
      toast.error("Wallet not connected!");
      return false;
    }
    if (!faucetContract) {
      toast.error("Faucet contract not found!");
      return false;
    }
    try {
        setIsCreatingTask(true);
        
        const createTx = await faucetContract.getRemainingTime();
           console.log("requestTokens receipt",createTx);
        const receipt = await createTx.wait();
        console.log("requestTokens receipt", receipt);
        return receipt.status === 1;
    } catch (error) {
      console.error("Error requesting tokens:", error);
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
    }
  }, [ faucetContract]);


  return {mintToken,transferToken,requestToken,getRemainingTime, isCreatingTask, isUpdatingTask};
};
