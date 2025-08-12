# Troubleshooting Guide

## Hydration Error

### Masalah
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

### Penyebab
- Browser extension (seperti Grammarly) menambahkan atribut ke elemen HTML
- Perbedaan antara server-side rendering dan client-side rendering
- Penggunaan `Date.now()`, `Math.random()`, atau data yang berubah

### Solusi
1. **Sudah diperbaiki**: Menambahkan `suppressHydrationWarning={true}` pada elemen `<body>`
2. Pastikan semua komponen yang menggunakan data dinamis menggunakan `useEffect` dengan pengecekan `typeof window !== 'undefined'`
3. Gunakan `dynamic` import untuk komponen yang hanya perlu di client-side

## Failed to Fetch Error

### Masalah
```
Failed to fetch
TypeError: Failed to fetch
```

### Penyebab
- Server API tidak berjalan
- URL API salah
- Network connectivity issues
- CORS issues

### Solusi

#### 1. Periksa Server API
```bash
# Periksa apakah server berjalan
curl https://api-nivora.nahsbyte.my.id/health

# Atau buka di browser
https://api-nivora.nahsbyte.my.id/health
```

#### 2. Periksa Konfigurasi API
File: `src/config/api.ts`
```typescript
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-nivora.nahsbyte.my.id',
    // ...
};
```

#### 3. Set Environment Variables
Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_API_BASE_URL=https://api-nivora.nahsbyte.my.id
NEXT_PUBLIC_API_SWAGGER_URL=https://api-nivora.nahsbyte.my.id/swagger/index.html#/
```

#### 4. Restart Development Server
```bash
npm run dev
# atau
yarn dev
```

## Error Handling Improvements

### 1. API Service Error Handling
- Menambahkan error handling yang lebih spesifik
- Menampilkan pesan error yang informatif
- Menangani network errors

### 2. Client-Side Only Execution
- API calls hanya dijalankan di client-side
- Menghindari hydration issues
- Menggunakan `typeof window !== 'undefined'` check

### 3. Error Display Components
- Komponen `ErrorDisplay` untuk menampilkan error dengan baik
- Status API indicator
- Loading states yang jelas

## Debugging Steps

### 1. Periksa Console Browser
- Buka Developer Tools (F12)
- Lihat tab Console untuk error messages
- Periksa tab Network untuk API calls

### 2. Periksa Server Logs
- Lihat logs dari server API
- Periksa apakah endpoint `/health` merespons

### 3. Test API Endpoints
```bash
# Test health endpoint
curl -X GET https://api-nivora.nahsbyte.my.id/health

# Test parking terminals endpoint
curl -X GET https://api-nivora.nahsbyte.my.id/api/v1/parking-terminal
```

### 4. Periksa Network Connectivity
```bash
# Ping server
ping api-nivora.nahsbyte.my.id

# Test port connectivity
telnet api-nivora.nahsbyte.my.id 443
```

## Common Issues

### 1. CORS Issues
Jika ada CORS error, pastikan server API mengizinkan request dari domain aplikasi.

### 2. Port Issues
Pastikan port 59152 terbuka dan tidak diblokir firewall.

### 3. IP Address Changes
Jika IP server berubah, update environment variable `NEXT_PUBLIC_API_BASE_URL`.

### 4. Docker Issues
Jika menggunakan Docker, pastikan container API berjalan:
```bash
docker ps
docker logs <container-name>
```

## Monitoring

### 1. API Status Component
Komponen `ApiStatus` akan menampilkan status koneksi API secara real-time.

### 2. Health Check
Endpoint `/health` digunakan untuk monitoring status server.

### 3. Error Logging
Semua error API akan di-log ke console untuk debugging.

## Best Practices

### 1. Environment Variables
- Gunakan environment variables untuk konfigurasi
- Jangan hardcode URL API
- Gunakan fallback values

### 2. Error Handling
- Tangani semua error dengan graceful
- Tampilkan pesan error yang user-friendly
- Log error untuk debugging

### 3. Loading States
- Tampilkan loading indicator
- Disable buttons saat loading
- Berikan feedback visual

### 4. Client-Side Rendering
- Gunakan `'use client'` directive untuk komponen yang perlu interaktivitas
- Hindari server-side rendering untuk data dinamis
- Gunakan `useEffect` untuk API calls 