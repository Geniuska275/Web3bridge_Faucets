import { useState, useCallback } from "react";
import { DashboardHeader } from "@/features/token-faucet/components/DashboardHeader";
import { WalletConnect } from "@/features/token-faucet/components/WalletConnect";
import { TokenInfoPanel } from "@/features/token-faucet/components/TokenInfoPanel";
import { RequestTokensCard } from "@/features/token-faucet/components/RequestTokensCard";
import { MintTokensCard } from "@/features/token-faucet/components/MintTokensCard";
import { TransferTokensCard } from "@/features/token-faucet/components/TransferTokensCard";

const Index = () => {
  const [address, setAddress] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-8 space-y-6">
        <WalletConnect address={address} onConnect={setAddress} />
        <TokenInfoPanel address={address} refreshKey={refreshKey} />
        <div className="grid gap-6 md:grid-cols-3">
          <RequestTokensCard address={address} onSuccess={handleRefresh} />
          <MintTokensCard address={address} onSuccess={handleRefresh} />
          <TransferTokensCard address={address} onSuccess={handleRefresh} />
        </div>
      </main>
    </div>
  );
};

export default Index;
