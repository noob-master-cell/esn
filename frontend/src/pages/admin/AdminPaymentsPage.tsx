// frontend/src/pages/admin/AdminPaymentsPage.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { PaymentsTable } from "../../components/admin/PaymentsTable";
import { PaymentFilters } from "../../components/admin/PaymentFilters";
import { PaymentStats } from "../../components/admin/PaymentStats";
import {
  GET_PAYMENTS,
  REFUND_PAYMENT,
  EXPORT_PAYMENTS,
} from "../../lib/graphql/payments";

interface PaymentFilters {
  status?: string;
  method?: string;
  eventId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export const AdminPaymentsPage: React.FC = () => {
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showRefundModal, setShowRefundModal] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_PAYMENTS, {
    variables: { filter: filters },
    fetchPolicy: "cache-and-network",
  });

  const [refundPayment] = useMutation(REFUND_PAYMENT, {
    onCompleted: () => {
      refetch();
      setShowRefundModal(null);
    },
  });

  const [exportPayments] = useMutation(EXPORT_PAYMENTS);

  const handleFilterChange = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
  };

  const handleRefund = async (paymentId: string, reason: string) => {
    if (window.confirm("Are you sure you want to refund this payment?")) {
      try {
        await refundPayment({
          variables: {
            id: paymentId,
            reason,
          },
        });
      } catch (err) {
        console.error("Error refunding payment:", err);
      }
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await exportPayments({
        variables: { filter: filters },
      });

      // Download the exported file
      const link = document.createElement("a");
      link.href = data.exportPayments.downloadUrl;
      link.download = `payments-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting payments:", err);
    }
  };

  const totalRevenue =
    data?.payments?.reduce(
      (sum: number, payment: any) =>
        payment.status === "COMPLETED" ? sum + payment.amount : sum,
      0
    ) || 0;

  const actions = (
    <div className="flex items-center gap-3">
      {selectedPayments.length > 0 && (
        <span className="text-sm text-gray-600">
          {selectedPayments.length} selected
        </span>
      )}
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Export CSV
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Payments Management"
      subtitle={`Total Revenue: €${(totalRevenue / 100).toFixed(2)}`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Payment Stats */}
        <PaymentStats data={data?.payments || []} />

        {/* Filters */}
        <PaymentFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Payments Table */}
        <PaymentsTable
          payments={data?.payments || []}
          loading={loading}
          error={error}
          selectedPayments={selectedPayments}
          onSelectionChange={setSelectedPayments}
          onRefund={handleRefund}
          onViewDetails={(id) => setShowRefundModal(id)}
        />
      </div>
    </AdminLayout>
  );
};
