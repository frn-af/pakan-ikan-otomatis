import { column } from "@/components/column";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateTimePickerForm } from "@/components/datetime/date-time-picker-form";
import { Separator } from "@/components/ui/separator";
import { getSchedule } from "@/action/action";
import { schedule } from "../../constants/seed";


export default async function Home() {
  const scheduleData = await getSchedule();
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="capitalize text-4xl font-bold">
        Sistem pemberian pakan otomatis
      </h1>
      <Separator className="mt-4" />
      <div className="space-y-2 md:flex w-full md:space-x-2 md:space-y-0 mt-2">
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
              <DataTable pageSize={7} columns={column} data={schedule} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
