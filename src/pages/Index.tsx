import { useState, useCallback } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { WalletConnect } from "@/components/WalletConnect";
import { TokenInfoPanel } from "@/components/TokenInfoPanel";
import { RequestTokensCard } from "@/components/RequestTokensCard";
import { MintTokensCard } from "@/components/MintTokensCard";
import { TransferTokensCard } from "@/components/TransferTokensCard";

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
