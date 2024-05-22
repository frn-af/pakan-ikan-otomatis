import { Suspense } from "react";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

interface DataTableProps<TData, Tvalue> {
  columns: ColumnDef<TData, Tvalue>[];
  from: string;
}

export default async function TableSection<TData, Tvalue>({
  from,
  columns,
}: DataTableProps<TData, Tvalue>) {

  const response = await fetch(from);
  const data = await response.json();

  return (
    <section>
      <Card className="p-4">
        <CardHeader>
          <div className="flex justify-between">
            <h2 className="text-xl font-medium">Jadwal Pemberian Pakan</h2>
          </div>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent className="w-full">
          <Suspense key={data.id} fallback={<div>Loading...</div>}>
            <DataTable columns={columns} data={data} />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  )
}
