// frontend/src/components/admin/settings/PaymentSettings.tsx
import React, { useState } from "react";

interface PaymentSettingsProps {
  settings: any;
  onSave: (settings: any) => void;
  onChange: (category: string, key: string, value: any) => void;
  loading: boolean;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  settings,
  onSave,
  onChange,
  loading,
}) => {
  const [formData, setFormData] = useState({
    // Stripe Configuration
    stripeEnabled: settings.stripeEnabled || true,
    stripePublicKey: settings.stripePublicKey || "",
    stripeSecretKey: settings.stripeSecretKey || "",
    stripeWebhookSecret: settings.stripeWebhookSecret || "",

    // Payment Options
    allowCreditCard: settings.allowCreditCard || true,
    allowDebitCard: settings.allowDebitCard || true,
    allowBankTransfer: settings.allowBankTransfer || false,
    allowCash: settings.allowCash || false,

    // ESN Card Settings
    esnCardEnabled: settings.esnCardEnabled || true,
    esnCardDiscount: settings.esnCardDiscount || 20, // percentage
    esnCardValidationRequired: settings.esnCardValidationRequired || true,

    // Pricing & Fees
    defaultCurrency: settings.defaultCurrency || "EUR",
    processingFeePercentage: settings.processingFeePercentage || 2.9,
    processingFeeFixed: settings.processingFeeFixed || 30, // cents
    minimumPaymentAmount: settings.minimumPaymentAmount || 100, // cents
    maximumPaymentAmount: settings.maximumPaymentAmount || 50000, // cents

    // Refund Settings
    allowRefunds: settings.allowRefunds || true,
    refundDeadlineDays: settings.refundDeadlineDays || 7,
    autoRefundOnCancellation: settings.autoRefundOnCancellation || false,
    refundProcessingDays: settings.refundProcessingDays || 5,

    // Invoice Settings
    invoicePrefix: settings.invoicePrefix || "ESN",
    invoiceNumberStart: settings.invoiceNumberStart || 1000,
    invoiceEmailEnabled: settings.invoiceEmailEnabled || true,
    vatEnabled: settings.vatEnabled || false,
    vatRate: settings.vatRate || 20, // percentage
    vatNumber: settings.vatNumber || "",

    // Bank Transfer Settings
    bankName: settings.bankName || "",
    bankAccount: settings.bankAccount || "",
    bankIBAN: settings.bankIBAN || "",
    bankBIC: settings.bankBIC || "",
    bankTransferInstructions: settings.bankTransferInstructions || "",

    // Security & Compliance
    pciCompliant: settings.pciCompliant || true,
    encryptionEnabled: settings.encryptionEnabled || true,
    fraudDetectionEnabled: settings.fraudDetectionEnabled || true,

    // Notifications
    paymentConfirmationEmail: settings.paymentConfirmationEmail || true,
    paymentFailureEmail: settings.paymentFailureEmail || true,
    refundNotificationEmail: settings.refundNotificationEmail || true,
  });

  const [showSecretKeys, setShowSecretKeys] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    onChange("payments", key, value);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const maskSecretKey = (key: string) => {
    if (!key || showSecretKeys) return key;
    return key.replace(/./g, "*").slice(0, -4) + key.slice(-4);
  };

  const testStripeConnection = async () => {
    // Test Stripe connection logic would go here
    alert("Testing Stripe connection...");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Payment Settings
          </h2>
          <p className="text-sm text-gray-600">
            Configure payment gateways and processing options
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTestMode(!testMode)}
            className={`px-3 py-1 text-sm rounded-lg ${
              testMode
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {testMode ? "Test Mode" : "Live Mode"}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Stripe Configuration */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-900">
              Stripe Integration
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSecretKeys(!showSecretKeys)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showSecretKeys ? "Hide" : "Show"} Keys
              </button>
              <button
                onClick={testStripeConnection}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
              >
                Test Connection
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Enable Stripe Payments
                </h4>
                <p className="text-sm text-gray-600">
                  Accept credit/debit card payments via Stripe
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stripeEnabled}
                  onChange={(e) =>
                    handleInputChange("stripeEnabled", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.stripeEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publishable Key *
                  </label>
                  <input
                    type="text"
                    value={formData.stripePublicKey}
                    onChange={(e) =>
                      handleInputChange("stripePublicKey", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="pk_live_..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secret Key *
                  </label>
                  <input
                    type={showSecretKeys ? "text" : "password"}
                    value={
                      showSecretKeys
                        ? formData.stripeSecretKey
                        : maskSecretKey(formData.stripeSecretKey)
                    }
                    onChange={(e) =>
                      handleInputChange("stripeSecretKey", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="sk_live_..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Endpoint Secret
                  </label>
                  <input
                    type={showSecretKeys ? "text" : "password"}
                    value={
                      showSecretKeys
                        ? formData.stripeWebhookSecret
                        : maskSecretKey(formData.stripeWebhookSecret)
                    }
                    onChange={(e) =>
                      handleInputChange("stripeWebhookSecret", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="whsec_..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Webhook URL: {window.location.origin}/api/webhooks/stripe
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Accepted Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Credit Cards
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowCreditCard}
                  onChange={(e) =>
                    handleInputChange("allowCreditCard", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-green-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Debit Cards
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowDebitCard}
                  onChange={(e) =>
                    handleInputChange("allowDebitCard", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-purple-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Bank Transfer
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowBankTransfer}
                  onChange={(e) =>
                    handleInputChange("allowBankTransfer", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-orange-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Cash Payment
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowCash}
                  onChange={(e) =>
                    handleInputChange("allowCash", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* ESN Card Settings */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            ESN Card Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Enable ESN Card Discounts
                </h4>
                <p className="text-sm text-gray-600">
                  Provide discounts for verified ESN card holders
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.esnCardEnabled}
                  onChange={(e) =>
                    handleInputChange("esnCardEnabled", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.esnCardEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.esnCardDiscount}
                      onChange={(e) =>
                        handleInputChange(
                          "esnCardDiscount",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Card Validation Required
                    </h4>
                    <p className="text-xs text-gray-600">
                      Require card verification for discounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.esnCardValidationRequired}
                      onChange={(e) =>
                        handleInputChange(
                          "esnCardValidationRequired",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Fees */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Pricing & Processing Fees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.processingFeePercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "processingFeePercentage",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fixed Fee (cents)
              </label>
              <input
                type="number"
                min="0"
                value={formData.processingFeeFixed}
                onChange={(e) =>
                  handleInputChange(
                    "processingFeeFixed",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Payment (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.minimumPaymentAmount / 100}
                onChange={(e) =>
                  handleInputChange(
                    "minimumPaymentAmount",
                    parseFloat(e.target.value) * 100
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Payment (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.maximumPaymentAmount / 100}
                onChange={(e) =>
                  handleInputChange(
                    "maximumPaymentAmount",
                    parseFloat(e.target.value) * 100
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bank Transfer Settings */}
        {formData.allowBankTransfer && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Bank Transfer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bank Austria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder
                </label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) =>
                    handleInputChange("bankAccount", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ESN University Chapter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  value={formData.bankIBAN}
                  onChange={(e) =>
                    handleInputChange("bankIBAN", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="AT12 3456 7890 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BIC/SWIFT
                </label>
                <input
                  type="text"
                  value={formData.bankBIC}
                  onChange={(e) => handleInputChange("bankBIC", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="BKAUATWW"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Instructions
                </label>
                <textarea
                  value={formData.bankTransferInstructions}
                  onChange={(e) =>
                    handleInputChange(
                      "bankTransferInstructions",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please include your registration ID in the transfer description..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Refund Policy */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Refund Policy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Allow Refunds
                </h4>
                <p className="text-sm text-gray-600">
                  Enable refund processing for payments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowRefunds}
                  onChange={(e) =>
                    handleInputChange("allowRefunds", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.allowRefunds && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Deadline (days before event)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formData.refundDeadlineDays}
                    onChange={(e) =>
                      handleInputChange(
                        "refundDeadlineDays",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Processing Time (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={formData.refundProcessingDays}
                    onChange={(e) =>
                      handleInputChange(
                        "refundProcessingDays",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Auto-refund on Cancellation
                      </h4>
                      <p className="text-xs text-gray-600">
                        Automatically process refunds when events are cancelled
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.autoRefundOnCancellation}
                        onChange={(e) =>
                          handleInputChange(
                            "autoRefundOnCancellation",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
