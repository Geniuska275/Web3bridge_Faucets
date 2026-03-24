import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { transferTokens } from "../services/tokenService";
import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { useWriteTodo } from "@/hooks/specific/useWriteTodo";
import { useAppKitAccount } from "@reown/appkit/react";
import { Value } from "@radix-ui/react-select";

interface TransferTokensCardProps {
  address: string;
  onSuccess: () => void;
}

export function TransferTokensCard({onSuccess }: TransferTokensCardProps) {
  const [toAddress, setToAddress] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
   const { transferToken } = useWriteTodo();
    const { address } = useAppKitAccount();
   

  const handleTransfer = async () => {
    if (!address) {
      toast.error("Connect your wallet first");
      return;
    }
    const num = Number(value);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!toAddress) {
      toast.error("Enter a recipient address");
      return;
    }
    setLoading(true);
    const result = await transferToken(address, toAddress, value);
    console.log(result);
    setLoading(false);

    
      toast.success("Tokens transferred successfully!");
      setToAddress("");
      setValue("");
      onSuccess();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center gap-2 mb-2">
        <ArrowRightLeft className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Transfer Tokens</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Send GTK tokens to another wallet address.
      </p>
      <div className="space-y-3">
        <Input
          placeholder="Recipient address (0x...)"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="1"
            className="font-mono text-sm"
          />
          <Button
            onClick={handleTransfer}
            disabled={loading || !address}
            className="shrink-0 active:scale-[0.97] transition-transform"
          >
            {loading ? "Sending..." : "Transfer"}
          </Button>
        </div>
      </div>
    </div>
  );
}