import { useQuery } from "@tanstack/react-query";
import { getTokenName, getTokenSymbol, getDecimals, getTotalSupply, getMaxSupply, getBalance } from "../services/tokenService";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Database, Hash, Layers, Tag, Wallet } from "lucide-react";

interface TokenInfoPanelProps {
  address: string;
  refreshKey: number;
}

const infoCards = [
  { key: "name", label: "Token Name", icon: Tag, fetcher: getTokenName },
  { key: "symbol", label: "Symbol", icon: Hash, fetcher: getTokenSymbol },
  { key: "decimals", label: "Decimals", icon: Layers, fetcher: getDecimals },
] as const;

export function TokenInfoPanel({ address, refreshKey }: TokenInfoPanelProps) {
  const nameQ = useQuery({ queryKey: ["tokenName"], queryFn: getTokenName, staleTime: Infinity });
  const symbolQ = useQuery({ queryKey: ["tokenSymbol"], queryFn: getTokenSymbol, staleTime: Infinity });
  const decimalsQ = useQuery({ queryKey: ["tokenDecimals"], queryFn: getDecimals, staleTime: Infinity });
  const supplyQ = useQuery({ queryKey: ["totalSupply", refreshKey], queryFn: getTotalSupply });
  const maxSupplyQ = useQuery({ queryKey: ["maxSupply"], queryFn: getMaxSupply, staleTime: Infinity });
  const balanceQ = useQuery({
    queryKey: ["balance", address, refreshKey],
    queryFn: () => getBalance(address),
    enabled: !!address,
  });

  const items = [
    { label: "Token Name", icon: Tag, value: nameQ.data, loading: nameQ.isLoading },
    { label: "Symbol", icon: Hash, value: symbolQ.data, loading: symbolQ.isLoading },
    { label: "Decimals", icon: Layers, value: decimalsQ.data, loading: decimalsQ.isLoading },
    { label: "Total Supply", icon: Database, value: supplyQ.data?.toLocaleString(), loading: supplyQ.isLoading },
    { label: "Max Supply", icon: Activity, value: maxSupplyQ.data?.toLocaleString(), loading: maxSupplyQ.isLoading },
    { label: "Your Balance", icon: Wallet, value: address ? balanceQ.data?.toLocaleString() ?? "0" : "—", loading: address ? balanceQ.isLoading : false },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm opacity-0 animate-fade-up"
          style={{ animationDelay: `${i * 80 + 100}ms` }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
          </div>
          {item.loading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <p className="font-mono-data text-lg font-semibold">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}