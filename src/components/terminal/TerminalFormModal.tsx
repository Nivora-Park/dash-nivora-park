import React from "react";
import { XCircle } from "lucide-react";
import { UploadButton } from "@/components/common/UploadButton";

interface TerminalFormData {
  location_id: string;
  code: string;
  name: string;
  description: string;
  ip_terminal: string;
  ip_printer: string;
  printer_type: string;
  ip_camera: string;
  logo_url: string;
}

interface FormErrors {
  location_id?: string;
  code?: string;
  name?: string;
  ip_terminal?: string;
  ip_printer?: string;
  printer_type?: string;
  ip_camera?: string;
}

interface TerminalFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: TerminalFormData;
  formErrors: FormErrors;
  onClose: () => void;
  onSubmit: () => void;
  onUpdateField: (field: keyof TerminalFormData, value: string) => void;
}

export function TerminalFormModal({
  isOpen,
  isEdit,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onUpdateField,
}: TerminalFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Terminal" : "Tambah Terminal Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Terminal *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => onUpdateField("code", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="TERM-001"
              />
              {formErrors.code && (
                <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Terminal *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onUpdateField("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Terminal A1"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onUpdateField("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deskripsi terminal..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Terminal *
              </label>
              <input
                type="text"
                value={formData.ip_terminal}
                onChange={(e) => onUpdateField("ip_terminal", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="192.168.1.100"
              />
              {formErrors.ip_terminal && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.ip_terminal}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Printer *
              </label>
              <input
                type="text"
                value={formData.ip_printer}
                onChange={(e) => onUpdateField("ip_printer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="192.168.1.101"
              />
              {formErrors.ip_printer && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.ip_printer}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Printer *
              </label>
              <input
                type="text"
                value={formData.printer_type}
                onChange={(e) => onUpdateField("printer_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thermal, Inkjet, dll"
              />
              {formErrors.printer_type && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.printer_type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Camera *
              </label>
              <input
                type="text"
                value={formData.ip_camera}
                onChange={(e) => onUpdateField("ip_camera", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="192.168.1.102"
              />
              {formErrors.ip_camera && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.ip_camera}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Logo URL + Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Logo
          </label>
          <input
            type="url"
            value={formData.logo_url}
            onChange={(e) => onUpdateField("logo_url", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
          <div className="mt-2 flex items-center gap-3">
            <UploadButton
              label="Upload Logo"
              allowedExt="jpg,jpeg,png,svg"
              onUploaded={({ url }) => onUpdateField("logo_url", url)}
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

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEdit ? "Update" : "Simpan"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
