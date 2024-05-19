"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
            >
              <span className="sr-only">
                Open Menu
              </span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )


    }
  }
]
