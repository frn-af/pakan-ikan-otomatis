import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-20">
      <div className="capitalize text-4xl font-bold">
        Sistem pemberian pakan otomatis
      </div>
      <Card className="flex flex-col items-center justify-center">
        <div className="text-center">
          Sistem Pakan Ikan Otomatis adalah sebuah sistem yang dirancang untuk
          memberikan pakan ikan secara otomatis. dengan mengatur waktu dan berat
          pakan yang akan di berikan kepada ikan. Sistem ini menggunakan
          mikrokontroler ESP32 sebagai otak dari sistem ini. Sistem ini juga
          dilengkapi dengan fitur- fitur yang memudahkan pengguna.
        </div>


      </Card>
    </main>
  );
}
