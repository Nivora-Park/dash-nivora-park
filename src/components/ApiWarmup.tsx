"use client";

import { useEffect } from "react";
import { apiService } from "@/services/api";

export function ApiWarmup() {
  useEffect(() => {
    let isCancelled = false;

    const warmup = async () => {
      if (typeof window === "undefined") return;
      try {
        // Panggil beberapa endpoint ringan sekaligus untuk memaksa inisialisasi koneksi/API mode
        await Promise.all([
          apiService.healthCheck(),
          apiService.getParkingVehicleTypes(),
          apiService.getLocations(),
        ]);
      } catch (_err) {
        // Abaikan error: tujuan hanya memicu inisialisasi dan/atau fallback proxy
        if (isCancelled) return;
      }
    };

    warmup();

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
} 