import React from "react";
import { X, Car } from "lucide-react";
import { UploadButton } from "@/components/common/UploadButton";

interface VehicleTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleType: any;
  formData: any;
  updateFormField: (field: string, value: any) => void;
  onSubmit: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
  locations: any[];
  rates: any[];
}

export function VehicleTypeFormModal({
  isOpen,
  onClose,
  vehicleType,
  formData,
  updateFormField,
  onSubmit,
  loading,
  error,
  locations,
  rates,
}: VehicleTypeFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {vehicleType ? "Edit Tipe Kendaraan" : "Tambah Tipe Kendaraan"}
              </h2>
              <p className="text-sm text-gray-500">
                {vehicleType
                  ? "Perbarui informasi tipe kendaraan"
                  : "Tambahkan tipe kendaraan baru"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Tipe *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => updateFormField("code", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: MOTOR, MOBIL"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Tipe *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Motor Bebek, Mobil Sedan"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi tipe kendaraan..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi
              </label>
              <select
                value={formData.location_id}
                onChange={(e) => updateFormField("location_id", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Lokasi</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarif Parkir *
              </label>
              <select
                value={formData.rate_id || ""}
                onChange={(e) => updateFormField("rate_id", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Tarif</option>
                {rates.map((rate) => (
                  <option key={rate.id} value={rate.id}>
                    {rate.name || rate.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Roda *
              </label>
              <select
                value={formData.wheel_count}
                onChange={(e) =>
                  updateFormField("wheel_count", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={2}>2 Roda</option>
                <option value={3}>3 Roda</option>
                <option value={4}>4 Roda</option>
                <option value={6}>6 Roda</option>
                <option value={8}>8 Roda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tinggi (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  updateFormField("height", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berat (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  updateFormField("weight", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Logo
            </label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => updateFormField("logo_url", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
            <div className="mt-2 flex items-center gap-3">
              <UploadButton
                label="Upload Logo"
                allowedExt="jpg,jpeg,png,svg"
                onUploaded={({ url }) => updateFormField("logo_url", url)}
              />
              {formData.logo_url && (
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="h-10 w-10 object-contain border rounded"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{vehicleType ? "Perbarui" : "Simpan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
