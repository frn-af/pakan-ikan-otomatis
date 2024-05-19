import { column } from "@/components/column";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { history, schedule } from "../../constants/seed";
import { InputJadwal } from "@/components/input-jadwal";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="capitalize text-4xl font-bold">
        Sistem pemberian pakan otomatis
      </div>
      <div className="grid grid-cols-1 py-4 gap-4 md:grid-cols-2 w-full">
        <Card className="p-4">
          <CardHeader>
            <div className="flex justify-between">
              <h2 className="text-xl">Jadwal Pemberian Pakan</h2>
              <InputJadwal />
            </div>
          </CardHeader>
          <CardContent className="w-full">
            <DataTable columns={column} data={schedule} />
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardHeader>
            <h2 className="text-xl">History Pemberian Pakan</h2>
          </CardHeader>
          <CardContent className="w-full">
            <DataTable columns={column} data={history} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
