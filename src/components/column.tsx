"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { EditForm } from "./edit-form";
import DeleteData from "./delete-data";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const column: ColumnDef<Schedule>[] = [
  {
    header: "Waktu Pemberian Pakan",
    accessorKey: "datetime",
    cell: ({ row }) => {
      const date = new Date(row.getValue("datetime"));
      return <div>{format(date, "PPP HH:mm:ss", { locale: id })} WIB</div>;
    }
  },
  {
    header: "Berat Pakan (gram)",
    accessorKey: "weight",
  },
  {
    id: "action",
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          <EditForm row={row} />
          <DeleteData row={row} />
        </div>
      )
    },
  }
]
