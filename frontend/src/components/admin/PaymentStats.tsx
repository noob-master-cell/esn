// frontend/src/components/admin/PaymentStats.tsx
import React from "react";
import { StatsCard } from "./StatsCard";

interface Payment {
  id: string;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
}

interface PaymentStatsProps {
  data: Payment[];
}

export const PaymentStats: React.FC<PaymentStatsProps> = ({ data }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate stats
  const totalRevenue = data
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransactions = data.length;

  const pendingPayments = data.filter((p) => p.status === "PENDING").length;

  const recentRevenue = data
    .filter(
      (p) => p.status === "COMPLETED" && new Date(p.createdAt) >= thirtyDaysAgo
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const failedPayments = data.filter((p) => p.status === "FAILED").length;
  const failureRate =
    totalTransactions > 0 ? (failedPayments / totalTransactions) * 100 : 0;

  // Calculate growth (mock calculation - you'd want to compare with previous period)
  const revenueGrowth = "+12.5%"; // This would be calculated from actual data
  const transactionGrowth = "+8.2%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Revenue"
        value={`€${(totalRevenue / 100).toFixed(2)}`}
        change={revenueGrowth}
        trend="up"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        }
      />

      <StatsCard
        title="Total Transactions"
        value={totalTransactions.toLocaleString()}
        change={transactionGrowth}
        trend="up"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        }
      />

      <StatsCard
        title="Pending Payments"
        value={pendingPayments.toString()}
        change={pendingPayments > 10 ? "High" : "Normal"}
        trend={pendingPayments > 10 ? "down" : "neutral"}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      <StatsCard
        title="Success Rate"
        value={`${(100 - failureRate).toFixed(1)}%`}
        change={
          failureRate < 5
            ? "Excellent"
            : failureRate < 10
            ? "Good"
            : "Needs Attention"
        }
        trend={failureRate < 5 ? "up" : failureRate < 10 ? "neutral" : "down"}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    </div>
  );
};
