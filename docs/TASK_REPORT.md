# Laporan Pengujian Performa Sistem dengan RBAC

## Halaman 1: Sampul
- Logo Kampus (masukkan file logo di ./docs/assets)
- Judul: "Laporan Pengujian Performa Sistem dengan RBAC"
- Nama anggota & NIM

## Daftar Isi
1. Implementasi Sistem
2. RBAC
3. Dashboard & Pengujian
4. Stress Test
5. Optimasi SQL
6. Kesimpulan

## Bab 2 - Implementasi Sistem
- Diagram arsitektur (frontend-backend-database)
- Skema database & relasi RBAC (role, permission, model_has_roles, model_has_permissions, role_has_permissions)
- Petunjuk menjalankan aplikasi:
  - composer install
  - php artisan migrate
  - php artisan db:seed
  - npm install && npm run dev (frontend)

## Bab 3 - RBAC
- Daftar peran: admin, editor, viewer
- Mapping role => permissions (lihat `database/seeders/DatabaseSeeder.php`)
- Verifikasi: buat 3 akun (admin/editor/viewer), lakukan login, ambil screenshot akses halaman yang dilarang (403)

## Bab 4 - Stress Test
- Instruksi menggunakan Locust (lihat `docs/STRESS_TEST_INSTRUCTIONS.md`)
- Grafik & analisis hasil

## Bab 5 - Optimasi SQL
- Indeks yang ditambahkan: department, status, created_at, name
- Contoh query sebelum/sesudah optimasi (lihat `tools/sql/optimize_queries.sql`)
- Tabel perbandingan waktu eksekusi (masukkan hasil pengujian)

## Bab 6 - Persiapan Presentasi
- Pembagian tugas tiap anggota
- Q&A persiapan

---

Catatan: Lengkapi laporan dengan screenshot hasil `SELECT COUNT(*) FROM users;`, hasil Locust, dan hasil EXPLAIN ANALYZE dari query yang diuji.
