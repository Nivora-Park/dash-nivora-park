import React from "react";
import { DollarSign, Edit, Trash2, Tag } from "lucide-react";
import { ParkingRate } from "@/types/api";

interface ParkingRateTableProps {
  rates: ParkingRate[];
  isLoading: boolean;
  error: string | null;
  getVehicleTypeName: (vehicleTypeId: string) => string;
  onEdit: (rate: ParkingRate) => void;
  onDelete: (id: string, name: string) => void;
}

export function ParkingRateTable({
  rates,
  isLoading,
  error,
  getVehicleTypeName,
  onEdit,
  onDelete,
}: ParkingRateTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete rate "${name}"?`)) {
      await onDelete(id, name);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading parking rates...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      {rates.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p>No parking rates found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hourly Rates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daily Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rates.map((rate) => (
              <tr key={rate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {rate.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {rate.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>1st hour: {formatCurrency(rate.first_hour_cost)}</div>
                    <div className="text-xs text-gray-500">
                      Next: {formatCurrency(rate.subsequent_hour_cost)}/hour
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(rate.daily_max_cost)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(rate.lost_ticket_cost)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(rate)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          rate.id,
                          rate.name || rate.description || "Rate"
                        )
                      }
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
