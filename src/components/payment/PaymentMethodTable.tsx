import React from "react";
import { QrCode, Smartphone, CreditCard, Edit, Trash2 } from "lucide-react";
import { ParkingPaymentType } from "@/types/api";

interface PaymentMethodTableProps {
  paymentTypes: ParkingPaymentType[];
  isLoading: boolean;
  error: string | null;
  onEdit: (paymentType: ParkingPaymentType) => void;
  onDelete: (id: string, name: string) => void;
}

export function PaymentMethodTable({
  paymentTypes,
  isLoading,
  error,
  onEdit,
  onDelete,
}: PaymentMethodTableProps) {
  const getPaymentIcon = (name: string) => {
    const iconName = name.toLowerCase();
    if (iconName.includes("qr") || iconName.includes("qris")) {
      return QrCode;
    } else if (iconName.includes("cash") || iconName.includes("tunai")) {
      return CreditCard;
    } else {
      return Smartphone;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete payment method "${name}"?`
      )
    ) {
      await onDelete(id, name);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading payment methods...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      {paymentTypes.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p>No payment methods found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentTypes.map((paymentType) => {
              const IconComponent = getPaymentIcon(paymentType.name);
              return (
                <tr key={paymentType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {paymentType.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {paymentType.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {paymentType.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(paymentType)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(paymentType.id, paymentType.name)
                        }
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
