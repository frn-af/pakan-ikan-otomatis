"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { EditForm } from "./edit-form";

export const column: ColumnDef<Schedule>[] = [
  {
    header: "Waktu Pemberian Pakan",
    accessorKey: "datetime",
    cell: ({ row }) => {
      const date = new Date(row.getValue("datetime"));
      const formatedDate = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div>{formatedDate} WIB</div>;
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
        <EditForm row={row} />
      )
    },
  }
]
