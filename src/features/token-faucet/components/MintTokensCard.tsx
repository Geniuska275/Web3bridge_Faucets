import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mintTokens } from "../services/tokenService";
import { Hammer } from "lucide-react";
import { toast } from "sonner";
import { useWriteTodo } from "@/hooks/specific/useWriteTodo";
import { ethers } from "ethers";

interface MintTokensCardProps {
  address: string;
  onSuccess: () => void;
}

export function MintTokensCard({ address, onSuccess }: MintTokensCardProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
   const { mintToken, isCreatingTask } = useWriteTodo();
  const handleMint = async () => {
    if (!address) {
      toast.error("Connect your wallet first");
      return;
    }
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setLoading(true);
    const result = await mintToken(address,);
    setLoading(false);

    // if (result.success) {
    //   toast.success(result.message);
    //   setAmount("");
    //   onSuccess();
    // } else {
    //   toast.error(result.message);
    // }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-2 mb-2">
        <Hammer className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Mint Tokens</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Mint new GTK tokens to your wallet. Max 10,000 per transaction.
      </p>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount to mint"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          max="10000"
          className="font-mono text-sm"
        />
        <Button
          onClick={handleMint}
          disabled={loading || !address}
          className="shrink-0 active:scale-[0.97] transition-transform"
        >
          {loading ? "Minting..." : "Mint"}
        </Button>
      </div>
    </div>
  );
}