import React from "react";
import { Car, User, CreditCard, Tag, Edit, Trash2 } from "lucide-react";

interface MembershipVehicle {
  id: string;
  membership_id: string;
  vehicle_type_id: string;
  license_plate: string;
  brand: string;
  model: string;
  color: string;
}

interface MembershipVehicleTableProps {
  vehicles: MembershipVehicle[];
  isLoading: boolean;
  error: string | null;
  getMembershipName: (membershipId: string) => string;
  getVehicleTypeName: (vehicleTypeId: string) => string;
  onEdit: (vehicle: MembershipVehicle) => void;
  onDelete: (id: string, licensePlate: string) => void;
}

export function MembershipVehicleTable({
  vehicles,
  isLoading,
  error,
  getMembershipName,
  getVehicleTypeName,
  onEdit,
  onDelete,
}: MembershipVehicleTableProps) {
  const handleDelete = async (id: string, licensePlate: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete vehicle "${licensePlate}"?`
      )
    ) {
      await onDelete(id, licensePlate);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Vehicle List</h3>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Vehicle List</h3>
        </div>
        <div className="p-6 text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Vehicle List</h3>
      </div>

      {vehicles.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p>No vehicles found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Car className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.license_plate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.brand} {vehicle.model}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {getMembershipName(vehicle.membership_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Tag className="h-4 w-4 mr-2 text-gray-400" />
                      {getVehicleTypeName(vehicle.vehicle_type_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Color: {vehicle.color}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(vehicle.id, vehicle.license_plate)
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
        </div>
      )}
    </div>
  );
}
