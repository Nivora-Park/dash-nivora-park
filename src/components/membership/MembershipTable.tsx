import React from "react";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Trash2,
  User,
} from "lucide-react";

interface Membership {
  id: string;
  membership_product_id: string;
  code: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  start_time: string;
  end_time: string;
  status: "active" | "inactive" | "expired";
}

interface MembershipTableProps {
  memberships: Membership[];
  isLoading: boolean;
  error: string | null;
  getMembershipProductName: (productId: string) => string;
  getStatusColor: (status: string) => string;
  getMembershipStatus: (startTime: string, endTime: string) => string;
  onEdit: (membership: Membership) => void;
  onDelete: (id: string, name: string) => void;
}

export function MembershipTable({
  memberships,
  isLoading,
  error,
  getMembershipProductName,
  getStatusColor,
  getMembershipStatus,
  onEdit,
  onDelete,
}: MembershipTableProps) {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("id-ID");
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete membership "${name}"?`)
    ) {
      await onDelete(id, name);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Membership List
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading memberships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Membership List
          </h3>
        </div>
        <div className="p-6 text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Membership List</h3>
      </div>

      {memberships.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p>No memberships found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
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
              {memberships.map((membership) => {
                const status = getMembershipStatus(
                  membership.start_time,
                  membership.end_time
                );
                const statusColor = getStatusColor(status);

                return (
                  <tr key={membership.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {membership.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {membership.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getMembershipProductName(
                          membership.membership_product_id
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {membership.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-1" />
                            {membership.email}
                          </div>
                        )}
                        {membership.phone && (
                          <div className="flex items-center text-gray-600 mt-1">
                            <Phone className="h-4 w-4 mr-1" />
                            {membership.phone}
                          </div>
                        )}
                        {membership.address && (
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {membership.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <div>
                          <div>
                            Start: {formatDateTime(membership.start_time)}
                          </div>
                          <div>End: {formatDateTime(membership.end_time)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(membership)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(membership.id, membership.name)
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
        </div>
      )}
    </div>
  );
}
