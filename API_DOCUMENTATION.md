# API Documentation

## Base URL
https://api-nivora.nahsbyte.my.id

## Swagger Documentation
https://api-nivora.nahsbyte.my.id/swagger/index.html#/

## API Version
```
v1
```

## Response Format
Semua endpoint mengembalikan response dengan format yang konsisten:
```json
{
  "code": 200,
  "message": "OK",
  "host": "127.0.1.1",
  "latency": 0,
  "data": {}
}
```

## Endpoints

### 1. Health Check
- **GET** `/health`
- **Description**: Mengecek status kesehatan API
- **Response**: Status OK jika API berjalan

### 2. Location Management

#### Locations
- **GET** `/api/v1/location`
- **Description**: Mendapatkan daftar lokasi dengan filtering dan pagination
- **Parameters**: 
  - `id` (optional): ID (UUID)
  - `merchant_id` (optional): Merchant ID (UUID)
  - `code` (optional): Kode lokasi
  - `name` (optional): Nama lokasi
  - `description` (optional): Deskripsi
  - `address` (optional): Alamat
  - `email` (optional): Email
  - `phone` (optional): Telepon
  - `contract_start_from` (optional): Tanggal mulai kontrak (YYYY-MM-DD)
  - `contract_start_to` (optional): Tanggal akhir kontrak (YYYY-MM-DD)
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/location`
- **Description**: Membuat lokasi baru
- **Body**: Data lokasi

- **GET** `/api/v1/location/{id}`
- **Description**: Mendapatkan lokasi berdasarkan ID

- **PUT** `/api/v1/location/{id}`
- **Description**: Update lokasi
- **Body**: Data lokasi yang diupdate

- **DELETE** `/api/v1/location/{id}`
- **Description**: Hapus lokasi

### 3. Parking Transaction Management

#### Parking Transactions
- **GET** `/api/v1/parking-transaction`
- **Description**: Mendapatkan daftar transaksi parkir dengan filtering dan pagination
- **Parameters**:
  - `id` (optional): ID (UUID)
  - `code` (optional): Kode transaksi
  - `description` (optional): Deskripsi
  - `duration_minutes` (optional): Durasi dalam menit
  - `canceled_at_from` (optional): Tanggal pembatalan dari (YYYY-MM-DD)
  - `canceled_at_to` (optional): Tanggal pembatalan sampai (YYYY-MM-DD)
  - `canceled_by` (optional): Dibatal oleh
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/parking-transaction`
- **Description**: Membuat transaksi parkir baru
- **Body**: Data transaksi parkir

- **GET** `/api/v1/parking-transaction/{id}`
- **Description**: Mendapatkan transaksi berdasarkan ID

- **PUT** `/api/v1/parking-transaction/{id}`
- **Description**: Update transaksi parkir
- **Body**: Data transaksi yang diupdate

- **DELETE** `/api/v1/parking-transaction/{id}`
- **Description**: Hapus transaksi parkir

### 4. Parking Terminal Management

#### Parking Terminals
- **GET** `/api/v1/parking-terminal`
- **Description**: Mendapatkan daftar terminal parkir
- **Parameters**:
  - `location_id` (optional): ID lokasi
  - `code` (optional): Kode terminal
  - `name` (optional): Nama terminal
  - `ip_address` (optional): IP Address
  - `port` (optional): Port
  - `status` (optional): Status terminal
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/parking-terminal`
- **Description**: Membuat terminal baru
- **Body**: Data terminal

- **GET** `/api/v1/parking-terminal/{id}`
- **Description**: Mendapatkan terminal berdasarkan ID

- **PUT** `/api/v1/parking-terminal/{id}`
- **Description**: Update terminal
- **Body**: Data terminal yang diupdate

- **DELETE** `/api/v1/parking-terminal/{id}`
- **Description**: Hapus terminal

### 5. Parking Vehicle Type Management

#### Parking Vehicle Types
- **GET** `/api/v1/parking-vehicle-type`
- **Description**: Mendapatkan daftar tipe kendaraan
- **Parameters**:
  - `location_id` (optional): ID lokasi
  - `code` (optional): Kode tipe kendaraan
  - `name` (optional): Nama tipe kendaraan
  - `height` (optional): Tinggi kendaraan
  - `weight` (optional): Berat kendaraan
  - `wheel_count` (optional): Jumlah roda
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/parking-vehicle-type`
- **Description**: Membuat tipe kendaraan baru
- **Body**: Data tipe kendaraan

- **GET** `/api/v1/parking-vehicle-type/{id}`
- **Description**: Mendapatkan tipe kendaraan berdasarkan ID

- **PUT** `/api/v1/parking-vehicle-type/{id}`
- **Description**: Update tipe kendaraan
- **Body**: Data tipe kendaraan yang diupdate

- **DELETE** `/api/v1/parking-vehicle-type/{id}`
- **Description**: Hapus tipe kendaraan

### 6. Parking Payment Type Management

#### Parking Payment Types
- **GET** `/api/v1/parking-payment-type`
- **Description**: Mendapatkan daftar tipe pembayaran
- **Parameters**:
  - `location_id` (optional): ID lokasi
  - `code` (optional): Kode tipe pembayaran
  - `name` (optional): Nama tipe pembayaran
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/parking-payment-type`
- **Description**: Membuat tipe pembayaran baru
- **Body**: Data tipe pembayaran

- **GET** `/api/v1/parking-payment-type/{id}`
- **Description**: Mendapatkan tipe pembayaran berdasarkan ID

- **PUT** `/api/v1/parking-payment-type/{id}`
- **Description**: Update tipe pembayaran
- **Body**: Data tipe pembayaran yang diupdate

- **DELETE** `/api/v1/parking-payment-type/{id}`
- **Description**: Hapus tipe pembayaran

### 7. Parking Transaction Payment Management

#### Parking Transaction Payments
- **GET** `/api/v1/parking-transaction-payment`
- **Description**: Mendapatkan daftar pembayaran transaksi
- **Parameters**:
  - `transaction_id` (optional): ID transaksi
  - `terminal_id` (optional): ID terminal
  - `vehicle_type_id` (optional): ID tipe kendaraan
  - `payment_type_id` (optional): ID tipe pembayaran
  - `identifier` (optional): Identifier
  - `reference` (optional): Reference
  - `provider` (optional): Provider
  - `base_amount` (optional): Jumlah dasar
  - `total_amount` (optional): Total jumlah
  - `paid_amount` (optional): Jumlah yang dibayar
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/parking-transaction-payment`
- **Description**: Membuat pembayaran transaksi baru
- **Body**: Data pembayaran transaksi

- **GET** `/api/v1/parking-transaction-payment/{id}`
- **Description**: Mendapatkan pembayaran transaksi berdasarkan ID

- **PUT** `/api/v1/parking-transaction-payment/{id}`
- **Description**: Update pembayaran transaksi
- **Body**: Data pembayaran transaksi yang diupdate

- **DELETE** `/api/v1/parking-transaction-payment/{id}`
- **Description**: Hapus pembayaran transaksi

### 8. Parking Transaction Terminal Management

#### Parking Transaction Terminals
- **GET** `/api/v1/parking-transaction-terminal`
- **Description**: Mendapatkan daftar terminal transaksi
- **Parameters**:
  - `transaction_id` (optional): ID transaksi
  - `terminal_id` (optional): ID terminal
  - `vehicle_type_id` (optional): ID tipe kendaraan
  - `plate_number` (optional): Nomor plat
  - `page` (optional): Nomor halaman
  - `page_size` (optional): Ukuran halaman

- **POST** `/api/v1/parking-transaction-terminal`
- **Description**: Membuat terminal transaksi baru
- **Body**: Data terminal transaksi

- **GET** `/api/v1/parking-transaction-terminal/{id}`
- **Description**: Mendapatkan terminal transaksi berdasarkan ID

- **PUT** `/api/v1/parking-transaction-terminal/{id}`
- **Description**: Update terminal transaksi
- **Body**: Data terminal transaksi yang diupdate

- **DELETE** `/api/v1/parking-transaction-terminal/{id}`
- **Description**: Hapus terminal transaksi

## Data Models

### Location Model
```typescript
interface Location {
  id: string;
  merchant_id: string;
  code: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  contract_start: string;
  contract_end: string;
  logo_url: string;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

### Parking Transaction Model
```typescript
interface ParkingTransaction {
  id: string;
  code: string;
  description: string;
  duration_minutes: number;
  canceled_at?: string;
  canceled_by?: string;
  canceled_remark?: string;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

### Parking Terminal Model
```typescript
interface ParkingTerminal {
  id: string;
  location_id: string;
  code: string;
  name: string;
  description: string;
  ip_address: string;
  port: number;
  status: string;
  last_online: string;
  logo_url: string;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

### Parking Vehicle Type Model
```typescript
interface ParkingVehicleType {
  id: string;
  location_id: string;
  code: string;
  name: string;
  description: string;
  height: number;
  weight: number;
  wheel_count: number;
  logo_url: string;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

### Parking Payment Type Model
```typescript
interface ParkingPaymentType {
  id: string;
  location_id: string;
  code: string;
  name: string;
  description: string;
  logo_url: string;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

### Parking Transaction Payment Model
```typescript
interface ParkingTransactionPayment {
  id: string;
  transaction_id: string;
  terminal_id: string;
  vehicle_type_id: string;
  payment_type_id: string;
  identifier: string;
  reference: string;
  provider: string;
  description: string;
  base_amount: number;
  discount_amount: number;
  tax_amount: number;
  service_amount: number;
  penalty_amount: number;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

### Parking Transaction Terminal Model
```typescript
interface ParkingTransactionTerminal {
  id: string;
  transaction_id: string;
  terminal_id: string;
  vehicle_type_id: string;
  plate_number: string;
  image_url: string;
  created_at: string;
  created_by: string;
  created_remark: string;
  updated_at: string;
  updated_by: string;
  updated_remark: string;
  deleted_at?: string;
  deleted_by?: string;
  deleted_remark?: string;
  synced_at?: string;
  synced_by?: string;
  synced_remark?: string;
}
```

## Error Handling

### Error Response Format
```json
{
  "code": 404,
  "message": "Route Not Found",
  "host": "127.0.1.1",
  "latency": 0,
  "data": {}
}
```

### Common Error Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## CORS Headers
API mendukung CORS dengan header berikut:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE, UPDATE`
- `Access-Control-Allow-Headers: Origin, Content-Type, api_key, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization`

## Integration Notes

### Frontend Integration
Aplikasi dashboard sudah diintegrasikan dengan API ini melalui:
- `src/config/api.ts` - Konfigurasi endpoint
- `src/types/api.ts` - Interface TypeScript
- `src/services/api.ts` - Service untuk HTTP requests
- `src/hooks/useApi.ts` - Custom hooks untuk state management

### Real-time Monitoring
- Health check otomatis setiap 30 detik
- Status koneksi ditampilkan di header dashboard
- Error handling untuk koneksi yang gagal

### Data Flow
1. Frontend memanggil API melalui service layer
2. Response diproses dan disimpan dalam state
3. UI diupdate berdasarkan data dari API
4. Error handling untuk menampilkan pesan error ke user

### Query Parameters
Semua endpoint mendukung query parameters untuk filtering dan pagination:
- `page`: Nomor halaman (integer)
- `page_size`: Ukuran halaman (integer)
- `created_at_from`: Tanggal dibuat dari (YYYY-MM-DD)
- `created_at_to`: Tanggal dibuat sampai (YYYY-MM-DD)
- `updated_at_from`: Tanggal update dari (YYYY-MM-DD)
- `updated_at_to`: Tanggal update sampai (YYYY-MM-DD)
- Dan parameter spesifik untuk setiap endpoint 