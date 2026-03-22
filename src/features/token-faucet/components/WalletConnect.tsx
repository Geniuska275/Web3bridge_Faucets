import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  address: string;
  onConnect: (address: string) => void;
}

export function WalletConnect({ address, onConnect }: WalletConnectProps) {
  const [input, setInput] = useState(address);

  const generateRandom = () => {
    const hex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const addr = "0x" + hex;
    setInput(addr);
    onConnect(addr);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm opacity-0 animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Wallet</h2>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter wallet address (0x...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono text-sm"
        />
        <Button onClick={() => onConnect(input)} variant="default" className="shrink-0">
          Connect
        </Button>
        <Button onClick={generateRandom} variant="secondary" className="shrink-0">
          Random
        </Button>
      </div>
      {address && (
        <p className="mt-3 text-sm text-muted-foreground">
          Connected: <span className="font-mono-data text-foreground">{address.slice(0, 10)}...{address.slice(-8)}</span>
        </p>
      )}
    </div>
  );
}