"use client"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { TimePicker } from "./datetime/time-picker"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale";
import { toast } from "./ui/use-toast"
import { Row } from "@tanstack/react-table"
import { Schedule } from "../../constants/seed"
import { getSchedulesByDate, updateData } from "@/action/action"
import { tolocaleISOString } from "./datetime/time-picker-utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const formSchema = z.object({
  dateTime: z.date(),
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
    },
  })

  const onSubmit = async (data: FormSchemaType) => {
    if (!data.dateTime) {
      toast({
        variant: "destructive",
        title: "Penambahan Jadwal Gagal",
        description: (
          <div>
            Tanggal pakan tidak boleh kosong.
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
            Jadwal pemberian pakan pada{" "}
            <strong>{format(data.dateTime, "PPP HH:mm", { locale: id })}</strong> sudah ada.
            silahkan update jadwal yang sudah ada.
          </div>
        ),
      });
      return;
    }
    const updateSchedule = await updateData({
      id: row.original.id,
      datetime: tolocaleISOString(data.dateTime),
      weight: row.original.weight,
      status: row.original.status,
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
          Pemberian Pakan akan dilakukan pada{" "}
          <strong>{format(data.dateTime, "PPP HH:mm")}</strong>
        </div>
      ),
    });
  }
  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full font-normal",
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
                  </PopoverTrigger>
                </FormControl>
                <FormMessage />
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border flex justify-center">
                    <TimePicker
                      setDate={field.onChange}
                      date={field.value}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <div className={cn("p-3 border-t hidden  justify-center",
          form.formState.isDirty && "flex",
          form.formState.isSubmitted && "hidden"

        )}>
          <Button className="w-full md:w-24" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
