import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { transferTokens } from "../services/tokenService";
import { ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

interface TransferTokensCardProps {
  address: string;
  onSuccess: () => void;
}

export function TransferTokensCard({ address, onSuccess }: TransferTokensCardProps) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!address) {
      toast.error("Connect your wallet first");
      return;
    }
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!toAddress) {
      toast.error("Enter a recipient address");
      return;
    }
    setLoading(true);
    const result = await transferTokens(address, toAddress, num);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setToAddress("");
      setAmount("");
      onSuccess();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center gap-2 mb-2">
        <ArrowRightLeft className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Transfer Tokens</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Send VRD tokens to another wallet address.
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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