# Sistem Pakan Ikan Otomatis

## Deskripsi

Sistem Pakan Ikan Otomatis adalah sebuah sistem yang dirancang untuk memberikan pakan ikan secara otomatis.
dengan mengatur waktu dan berat pakan yang akan di berikan kepada ikan. Sistem ini menggunakan mikrokontroler
ESP32 sebagai otak dari sistem ini. Sistem ini juga dilengkapi dengan fitur-fitur yang memudahkan pengguna.

source code ini berisi program web dan api yang digunakan untuk mengontrol sistem pakan ikan otomatis.

## teknologi dan Fitur
- language : [Typescript](https://www.typescriptlang.org/)
- framework : [Next js](https://nextjs.org/docs) with `/app` directory
- api : [Hono](https://hono.dev/) (api directory)
- database : [Neon](https://neon.tech/docs/introduction) db (postgres)
- orm : [drizzle](https://drizzle.dev/docs)
- styling : [Tailwind CSS](https://tailwindcss.com/) / [shadcn-ui](https://ui.shadcn.com/)
- validation : [zod](https://zod.dev/)
- Loading UI
- Server and Client Components
- Data fetching, caching, and mutations
- fully typesafe 
- [x] Menjadwalkan waktu pemberian pakan
- [x] Menjadwalkan berat pakan
- [x] user friendly interface 
- [x] menampilkan history pemberian pakan dan berat pakan

## todo 
- [ ] deploy 
- [x] ~~api update waktu dan berat pakan~~
- [x] ~~api get history pemberian pakan~~
- [x] ~~ui input jadwal pemberian pakan~~
- [x] ~~ui list waktu dan berat pakan~~
- [x] ~~ui list history pemberian pakan~~
- [ ] testing api update waktu dan berat pakan 

## Cara Penggunaan
1. Clone repository ini
2. Buka terminal dan arahkan ke folder repository ini
3. Install semua dependencies dengan cara mengetikkan perintah berikut
    ```
    pnpm install
    ```
4. Jalankan


