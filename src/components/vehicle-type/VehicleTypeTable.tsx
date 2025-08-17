import React from "react";
import { Car, MapPin, Edit, Trash2, Settings } from "lucide-react";

interface VehicleType {
  id: string;
  location_id?: string;
  rate_id?: string;
  code: string;
  name: string;
  description: string;
  wheel_count: number;
  height: number;
  weight: number;
  logo_url: string;
}

interface VehicleTypeTableProps {
  vehicleTypes: VehicleType[];
  isLoading: boolean;
  error: string | null;
  getLocationName: (locationId: string) => string;
  getRateDescription: (rateId: string) => string;
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: (id: string, name: string) => void;
}

export function VehicleTypeTable({
  vehicleTypes,
  isLoading,
  error,
  getLocationName,
  getRateDescription,
  onEdit,
  onDelete,
}: VehicleTypeTableProps) {
  const handleDelete = (vehicleType: VehicleType) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus tipe kendaraan "${vehicleType.name}"?`
      )
    ) {
      onDelete(vehicleType.id, vehicleType.name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (vehicleTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Tidak ada tipe kendaraan
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Mulai dengan menambahkan tipe kendaraan baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipe Kendaraan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lokasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Spesifikasi
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vehicleTypes.map((vehicleType) => (
            <tr key={vehicleType.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {vehicleType.logo_url ? (
                      <img
                        src={vehicleType.logo_url}
                        alt={`${vehicleType.name} logo`}
                        className="h-10 w-10 rounded-lg object-contain border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {vehicleType.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {vehicleType.code}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  {vehicleType.location_id
                    ? getLocationName(vehicleType.location_id)
                    : "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Settings className="h-4 w-4 text-gray-400 mr-1" />
                      {vehicleType.wheel_count} roda
                    </span>
                    {vehicleType.rate_id && (
                      <span className="flex items-center text-gray-600">
                        Tarif: {getRateDescription(vehicleType.rate_id)}
                      </span>
                    )}
                    {vehicleType.height > 0 && (
                      <span className="text-gray-500">
                        {vehicleType.height}cm
                      </span>
                    )}
                    {vehicleType.weight > 0 && (
                      <span className="text-gray-500">
                        {vehicleType.weight}kg
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {vehicleType.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(vehicleType)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Edit tipe kendaraan"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicleType)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Hapus tipe kendaraan"
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
  );
}
