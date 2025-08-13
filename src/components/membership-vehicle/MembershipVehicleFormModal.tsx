import React from "react";
import { Car, User, CreditCard, Tag } from "lucide-react";

interface MembershipVehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
  formData: any;
  updateFormField: (field: string, value: any) => void;
  onSubmit: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
  memberships: any[];
  vehicleTypes: any[];
}

export function MembershipVehicleFormModal({
  isOpen,
  onClose,
  vehicle,
  formData,
  updateFormField,
  onSubmit,
  loading,
  error,
  memberships,
  vehicleTypes,
}: MembershipVehicleFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Car className="h-5 w-5" />
            {vehicle ? "Edit Membership Vehicle" : "Add New Membership Vehicle"}
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membership *
                </label>
                <select
                  value={formData.membership_id}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateFormField("membership_id", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select membership</option>
                  {memberships.map((membership) => (
                    <option key={membership.id} value={membership.id}>
                      {membership.name} ({membership.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <select
                  value={formData.vehicle_type_id}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateFormField("vehicle_type_id", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Plate *
              </label>
              <input
                type="text"
                value={formData.license_plate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormField("license_plate", e.target.value)
                }
                placeholder="e.g., B 1234 ABC"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormField("brand", e.target.value)
                  }
                  placeholder="e.g., Toyota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFormField("model", e.target.value)
                  }
                  placeholder="e.g., Avanza"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormField("color", e.target.value)
                }
                placeholder="e.g., Silver"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : vehicle ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
