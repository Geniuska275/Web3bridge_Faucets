import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { requestTokens, getCooldownRemaining } from "../services/tokenService";
import { useCountdown, formatCountdown } from "../hooks/useCountdown";
import { Droplets, Clock } from "lucide-react";
import { toast } from "sonner";
import { useWriteTodo } from "@/hooks/specific/useWriteTodo";
import { useAppKitAccount } from "@reown/appkit/react";

interface RequestTokensCardProps {
  // address: string;
  onSuccess: () => void;
}

export function RequestTokensCard({ onSuccess }: RequestTokensCardProps) {
  const [loading, setLoading] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const { remaining, reset, isActive } = useCountdown(cooldownMs);
  const { requestToken,getRemainingTime } = useWriteTodo();
  const { address } = useAppKitAccount();
  
  

  useEffect(() => {
    if (!address) return;
    getRemainingTime(address).then((ms) => {
      console.log("Cooldown remaining (ms):", ms);
      // setCooldownMs(ms);
      // reset(ms);
    });
  }, [address, reset]);

  const handleRequest = async () => {
    if (!address) {
      toast.error("Connect your wallet first");
      return;
    }
    setLoading(true);
    const result = await requestToken(address);
    console.log("result",result)
    setLoading(false);

    if (result) {
      toast.success("Tokens requested successfully! Check your balance shortly.");
      onSuccess();
      const ms = await getRemainingTime(address);
      console.log(ms)
    } else {
      // if (result.cooldownMs) {
      //   setCooldownMs(result.cooldownMs);
      //   reset(result.cooldownMs);
      // }
      toast.error("Failed to request tokens.");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-2 mb-2">
        <Droplets className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Request Tokens</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Claim 100 GTK tokens from the faucet. One claim per 24 hours.
      </p>

      {isActive ? (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-warning">Cooldown Active</span>
          </div>
          <p className="font-mono-data text-2xl font-bold tracking-tight">
            Retry in {formatCountdown(remaining)}
          </p>
        </div>
      ) : (
        <Button
          onClick={handleRequest}
          disabled={loading || !address}
          className="w-full active:scale-[0.97] transition-transform"
        >
          {loading ? "Requesting..." : "Request 100 GTK"}
        </Button>
      )}
    </div>
  );
}