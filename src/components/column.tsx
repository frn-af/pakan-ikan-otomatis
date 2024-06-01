"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { EditForm } from "./edit-form";
import DeleteData from "./delete-data";
import WeightForm from "./weight-form";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export const column: ColumnDef<Schedule>[] = [
  {
    header: "Waktu Pemberian Pakan",
    accessorKey: "datetime",
    cell: ({ row }) => {
      return <div key={row.original.id}>
        <EditForm row={row} />
      </div>;
    }
  },
  {
    header: "Berat Pakan (gram)",
    accessorKey: "weight",
    cell: ({ row }) => {
      return <div key={row.original.id}>
        <WeightForm row={row} />
      </div>;
    }
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div key={row.original.id}>
          {status && (
            <Button variant="outline" className={cn(
              "w-32",
              status === "done" ? "border-green-500 text-green-500 hover:text-green-500" :
                status === "waiting" ? "border-yellow-500 text-yellow-500 hover:text-yellow-500"
                  : "border-red-500 text-red-500 hover:text-red-500",
            )}>
              {status === "done" ? "Selesai" : status === "waiting" ? "Menunggu" : "Error"}
            </Button>
          )}
        </div>
      );
    },
  },
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          <DeleteData row={row} />
        </div>
      )
    },
  }
]
