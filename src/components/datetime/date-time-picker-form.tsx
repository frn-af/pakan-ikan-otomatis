"use client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { tolocaleISOString } from "./time-picker-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "@/components/ui/use-toast";
import { TimePicker } from "./time-picker";
import { newData, getSchedulesByDate } from "@/action/action";

const formSchema = z.object({
  dateTime: z.date(),
  weight: z.coerce.number().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function DateTimePickerForm() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

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


    const newSchedule = await newData({
      datetime: tolocaleISOString(data.dateTime),
      weight: data.weight,
    });
    if (newSchedule instanceof Error || !newSchedule) {
      toast({
        variant: "destructive",
        title: "Penambahan Jadwal Gagal",
        description: "Terjadi kesalahan saat menambahkan jadwal, silahkan coba lagi.",
      });
      return;
    }
    toast({
      title: "Penambahan Jadwal Berhasil",
      description: (
        <div>
          Pemberian Pakan akan dilakukan pada tanggal{" "}
          <strong>{format(data.dateTime, "PPP HH:mm", { locale: id })}</strong>
          {" "} dengan berat pakan: <strong>{data.weight} gram</strong>.
        </div>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        className="md:flex items-end gap-4 justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">DateTime</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "lg:w-[280px] justify-start text-left font-normal",
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
                  <div className="p-3 border-t border-border">
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
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Berat Pakan</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Berat pakan (gram)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-4 md:w-24" type="submit">Submit</Button>
      </form>
    </Form>
  );
}
