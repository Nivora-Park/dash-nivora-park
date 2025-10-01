# TODO: Implementasi Pagination di Transaction Monitoring

## Tugas Utama
- Implementasikan pagination di frontend untuk TransactionTable agar menampilkan maksimal 10 transaksi per halaman.

## Langkah-langkah Implementasi
- [x] Tambahkan state pagination (currentPage, pageSize=10) di TransactionTable.tsx
- [x] Hitung totalPages berdasarkan filteredTransactions.length / pageSize
- [x] Slice filteredTransactions untuk menampilkan hanya data halaman saat ini
- [x] Update tabel untuk menampilkan data yang dipaginasi
- [x] Buat tombol pagination (Previous, Next, nomor halaman) menjadi fungsional
- [x] Update teks "Menampilkan X dari Y transaksi" untuk mencerminkan halaman saat ini

## Testing
- [ ] Verifikasi pagination bekerja: klik Previous/Next, pindah halaman
- [ ] Pastikan performa baik dengan data banyak (tidak loading ulang)
- [ ] Cek filter masih bekerja dengan pagination

## File yang Terpengaruh
- src/components/TransactionTable.tsx
