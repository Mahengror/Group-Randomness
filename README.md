Pembagi Kelompok Otomatis

Aplikasi web ringan berbasis Single Page Application (SPA) untuk mengacak dan membagi daftar nama dari file teks (.txt) menjadi beberapa kelompok secara adil dan otomatis. Didesain dengan antarmuka modern dan responsif.

Live Demo: https://mahengror.github.io/Group-Randomness/


Fitur Utama
1. Upload Instan: Mendukung pembacaan file (.txt) secara langsung di sisi klien (browser) tanpa perlu upload ke server.
2. Pengacakan Adil: Menggunakan algoritma Fisher-Yates Shuffle untuk memastikan nama-nama diacak dengan probabilitas yang sepenuhnya setara.
3. Distribusi Merata: Sistem akan mendistribusikan sisa nama yang tidak habis dibagi secara merata ke dalam kelompok-kelompok pertama.
4. Modern UI: Antarmuka yang bersih, elegan, dan responsif (mendukung perangkat mobile maupun desktop) menggunakan Tailwind CSS.
5. Privasi Terjamin: Semua pemrosesan data dilakukan secara lokal di perangkat pengguna. Tidak ada data nama yang dikumpulkan atau dikirim ke internet.

Teknologi yang Digunakan
1. HTML5 - Struktur utama halaman web.
2. Tailwind CSS (CDN) - Framework CSS untuk styling desain antarmuka (UI).
3. Vanilla JavaScript - Logika pemrograman DOM dan algoritma pengacakan kelompok.

Cara Penggunaan
1. Siapkan file teks (.txt). Tulis daftar nama-nama dengan format satu nama per baris.
2. Buka aplikasi web melalui link Live Demo di atas.
3. Klik area Upload File atau seret file (.txt) Anda ke dalam kotak yang disediakan.
4. Tinjau kembali daftar nama yang muncul di layar.
5. Masukkan jumlah kelompok yang ingin Anda buat di kolom input.
6. Klik tombol "Bagi Kelompok".
7. Selesai! Daftar kelompok akan muncul di bagian bawah beserta anggota-anggotanya.