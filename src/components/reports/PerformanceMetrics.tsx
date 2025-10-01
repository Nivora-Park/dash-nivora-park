import React from "react";
import { CheckCircle, Clock, Users } from "lucide-react";

interface PerformanceMetric {
  title: string;
  value: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

interface PerformanceMetricsProps {
  metrics?: PerformanceMetric[];
  loading?: boolean;
}

export function PerformanceMetrics({ metrics, loading = false }: PerformanceMetricsProps) {
  const defaultMetrics: PerformanceMetric[] = [
    {
      title: "Uptime Sistem",
      value: "99.8%",
      percentage: 99.8,
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      color: "bg-green-500",
    },
    {
      title: "Rata-rata Response",
      value: "120ms",
      percentage: 85,
      icon: <Clock className="w-5 h-5 text-white" />,
      color: "bg-blue-500",
    },
    {
      title: "Pengguna Aktif",
      value: "1,247",
      percentage: 92,
      icon: <Users className="w-5 h-5 text-white" />,
      color: "bg-purple-500",
    },
  ];

  const displayMetrics = metrics || defaultMetrics;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-lg p-4 animate-pulse h-24"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div
                className={`w-8 h-8 ${metric.color} rounded-lg flex items-center justify-center`}
              >
                {metric.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{metric.title}</h4>
                <p className="text-sm text-gray-600">{metric.value}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${metric.color.replace(
                  "bg-",
                  "bg-"
                )} h-2 rounded-full`}
                style={{ width: `${metric.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
