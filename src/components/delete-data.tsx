import { TrashIcon, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Row } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { deleteData } from "@/action/action";
import { toast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";

interface DeleteDataProps {
  row: Row<Schedule>
}

const DeleteData = async ({ row }: DeleteDataProps) => {

  const onClick = async () => {
    const id = row.original.id;
    const deleteSchedule = await deleteData(id);
    if (DeleteData instanceof Error || !deleteSchedule) {
      return toast({
        title: "Penghapusan Jadwal Gagal",
        description: "Terjadi kesalahan saat menghapus jadwal, silahkan coba lagi.",
        variant: "destructive",
      });
    }
    toast({
      title: "Penghapusan Jadwal Berhasil",
      description: "Jadwal berhasil dihapus.",
    });
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-10 h-10 p-0">
          <span className="sr-only">Edit</span>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-64 flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle className="w-full flex flex-col justify-center items-center">
            <TriangleAlert className="w-20 h-20 text-red-500" />
            <DialogDescription>
              Apakah anda yakin ingin menghapus jadwal ini?
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        <DialogFooter>
          <DialogClose asChild>
            <div className="flex space-x-2">
              <Button variant="destructive" className="w-28" onClick={onClick}>Ya</Button>
              <Button variant="outline" className="w-28">Tidak</Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteData;
