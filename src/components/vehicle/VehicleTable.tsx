import React from "react";
import {
  Car,
  Bike,
  MapPin,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface VehicleRow {
  id: string;
  plateNumber: string;
  vehicleType: "car" | "motorcycle" | string;
  entryTime: string | null;
  duration: string;
  location: string;
  status: "parked" | "left" | "overdue";
  amount: number;
  terminal: string;
}

interface VehicleTableProps {
  vehicles: VehicleRow[];
  totalVehicles: number;
}

export function VehicleTable({ vehicles, totalVehicles }: VehicleTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "parked":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Parkir
          </span>
        );
      case "left":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Keluar
          </span>
        );
      case "overdue":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Overdue
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getVehicleIcon = (type: string) => {
    return type === "car" ? (
      <Car className="w-4 h-4" />
    ) : (
      <Bike className="w-4 h-4" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "parked":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "left":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Kendaraan
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Lokasi
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Masuk
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Durasi
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Biaya
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Terminal
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900"></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    {getVehicleIcon(vehicle.vehicleType)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {vehicle.plateNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {vehicle.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(vehicle.status)}
                    {getStatusBadge(vehicle.status)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {vehicle.location || "-"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {vehicle.entryTime || "-"}
                </td>
                <td className="py-4 px-4 text-gray-600">{vehicle.duration}</td>
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">
                    {vehicle.amount > 0
                      ? `Rp ${vehicle.amount.toLocaleString()}`
                      : "-"}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{vehicle.terminal}</td>
                <td className="py-4 px-4">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Menampilkan {vehicles.length} dari {totalVehicles} kendaraan
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            Sebelumnya
          </button>
          <span className="px-3 py-1 text-sm font-medium text-gray-900 bg-blue-100 rounded">
            1
          </span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            Selanjutnya
          </button>
        </div>
      </div>
    </>
  );
}
