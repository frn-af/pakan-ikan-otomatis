import { column } from "@/components/column";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { history, schedule } from "../../constants/seed";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-20">
      <div className="capitalize text-4xl font-bold">
        Sistem pemberian pakan otomatis
      </div>
      <div className="grid grid-cols-1 py-4 gap-4 md:grid-cols-2 w-full">
        <Card className="flex flex-col p-4">
          <CardHeader className="text-xl">Jadwal Pemberian Pakan</CardHeader>
          <CardContent className="w-full">
            <DataTable columns={column} data={schedule} />
          </CardContent>
        </Card>
        <Card className="flex flex-col p-4">
          <CardHeader className="text-xl">History Pemberian Pakan</CardHeader>
          <CardContent className="w-full">
            <DataTable columns={column} data={history} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
