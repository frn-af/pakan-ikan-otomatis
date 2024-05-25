import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, PenLine } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import { TimePicker } from "./datetime/time-picker"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale";
import { Card } from "./ui/card"
import { toast } from "./ui/use-toast"
import { Row } from "@tanstack/react-table"
import { Schedule } from "../../constants/seed"
import { getSchedulesByDate, updateData } from "@/action/action"
import { tolocaleISOString } from "./datetime/time-picker-utils"

const formSchema = z.object({
  id: z.number().optional(),
  dateTime: z.date(),
  weight: z.coerce.number().min(1),
})

interface EditFormProps {
  row: Row<Schedule>
}

type FormSchemaType = z.infer<typeof formSchema>

export function EditForm({ row }: EditFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: new Date(row.original.datetime),
      weight: row.original.weight,
    },
  })

  const onSubmit = async (data: FormSchemaType) => {
    if (!data.dateTime || !data.weight) {
      toast({
        variant: "destructive",
        title: "Penambahan Jadwal Gagal",
        description: (
          <div>
            Tanggal dan berat pakan tidak boleh kosong.
          </div>
        ),
      });
      return;
    }
    if (new Date().getTime() > data.dateTime.getTime()) {
      toast({
        variant: "destructive",
        title: "Penambahan Jadwal Gagal",
        description: (
          <div>
            Jadwal pemberian pakan tidak boleh kurang dari hari ini.
          </div>
        ),
      });
      return;
    }
    const checkData = await getSchedulesByDate(data.dateTime);
    if (checkData.length > 0) {
      toast({
        variant: "destructive",
        title: "Penambahan Jadwal Gagal",
        description: (
          <div>
            Jadwal pemberian pakan pada tanggal{" "}
            <strong>{format(data.dateTime, "PPP HH:mm", { locale: id })}</strong> sudah ada.
            silahkan update jadwal yang sudah ada.
          </div>
        ),
      });
      return;
    }
    const updateSchedule = await updateData({
      id: row.original.id,
      datetime: tolocaleISOString(data.dateTime), // tolocaleISOString(data.dateTime
      weight: data.weight,
    })
    if (updateSchedule instanceof Error || !updateSchedule) {
      return toast({
        title: "Penambahan Jadwal Gagal",
        description: "Terjadi kesalahan saat mengubah jadwal, silahkan coba lagi.",
        variant: "destructive",
      });
    }
    toast({
      title: "Perubahan Jadwal Berhasil",
      description: (
        <div>
          Pemberian Pakan akan dilakukan pada tanggal{" "}
          <strong>{format(data.dateTime, "PPP HH:mm")}</strong>
          {" "} dengan berat pakan: <strong>{data.weight} gram</strong>.
        </div>
      ),
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-10 h-10 p-0">
          <span className="sr-only">Edit</span>
          <PenLine className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Penjadwalan Pemberian Pakan</DialogTitle>
          <DialogDescription>
            Ubah waktu dan berat pakan yang akan diberikan.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form
              className="items-center"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel >DateTime</FormLabel>
                    <FormControl>
                      <Button
                        disabled
                        variant="outline"
                        className={cn(
                          "text-center font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm", { locale: id })
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                    <Card className="flex flex-col items-center justify-center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </Card>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berat Pakan</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Berat pakan (gram)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>

                  <Button className="w-full mt-4 md:w-24" type="submit">Submit</Button>
                </DialogClose >
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
