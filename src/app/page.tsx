import { column } from "@/components/column";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { history, schedule } from "../../constants/seed";
import { DateTimePickerForm } from "@/components/datetime/date-time-picker-form";
import { Separator } from "@/components/ui/separator";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="capitalize text-4xl font-bold">
        Sistem pemberian pakan otomatis
      </div>
      <div className="space-y-2 md:flex w-full md:space-x-2 mt-4">
        <div className="w-full space-y-2">
          <Card className="p-4 w-full">
            <CardHeader>
              <div className="flex justify-between">
                <h2 className="text-xl font-medium">Tambah Jadwal Pemberian Pakan</h2>
              </div>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
              <DateTimePickerForm />
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <div className="flex justify-between">
                <h2 className="text-xl font-medium">Jadwal Pemberian Pakan</h2>
              </div>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="w-full">
              <DataTable columns={column} data={schedule} />
            </CardContent>
          </Card>
        </div>
        <Card className="p-4 w-full">
          <CardHeader>
            <h2 className="text-xl font-medium">History Pemberian Pakan</h2>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="w-full">
            <DataTable columns={column} data={history} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
