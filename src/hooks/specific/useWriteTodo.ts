import { useAppKitAccount } from "@reown/appkit/react";
import { useFaucetContract } from "../useContract";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { ErrorDecoder } from "ethers-decode-error";
import { ethers } from "ethers";

const errorDecoder = ErrorDecoder.create();

export const useWriteTodo = () => {
  const faucetContract = useFaucetContract(true);
  const { address } = useAppKitAccount();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

    const requestToken = useCallback(async(title : string) : Promise<boolean> => {
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
        // to estimate gas
        // const gas = await todoContract.createTask.estimateGas(title);
        // const gasVal = ethers.formatEther(gas);

        // function overload
        // const receipt = await todoContract["createTask(string,address)"](title, address);
        const createTx = await faucetContract.requestTokens(address);
        const receipt = await createTx.wait();
        return receipt.status === 1;
    } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
    }
  }, [address, faucetContract]);

  const mintToken = useCallback(async(title : string) : Promise<boolean> => {
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
        // to estimate gas
        // const gas = await todoContract.createTask.estimateGas(title);
        // const gasVal = ethers.formatEther(gas);

        // function overload
        // const receipt = await todoContract["createTask(string,address)"](title, address);
        const createTx = await faucetContract.mint(address, ethers.parseEther("1000"));
        const receipt = await createTx.wait();
        return receipt.status === 1;
    } catch (error) {
        const decodedError = await errorDecoder.decode(error);
        toast.error(decodedError.reason);
        return false;
    }
  }, [address, faucetContract]);



  return {mintToken, isCreatingTask, isUpdatingTask,requestToken};
};
