import { Coins } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Coins className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Verdant Token</h1>
            <p className="text-sm text-muted-foreground">Faucet & Management Dashboard</p>
          </div>
        </div>
      </div>
    </header>
  );
}