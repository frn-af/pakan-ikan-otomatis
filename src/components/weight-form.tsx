import { Row } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { updateData } from "@/action/action";
import { tolocaleISOString } from "./datetime/time-picker-utils";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const formSchema = z.object({
  id: z.number().optional(),
  dateTime: z.date(),
  weight: z.coerce.number().min(1),
})

interface WeightFormProps {
  row: Row<Schedule>
}

type FormSchemaType = z.infer<typeof formSchema>

const WeightForm = ({ row }: WeightFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: row.original.weight,
    },
  })

  const onSubmit = async (data: FormSchemaType) => {
    if (!data.weight) {
      toast({
        variant: "destructive",
        title: "Penambahan Jadwal Gagal",
        description: (
          <div>
            berat pakan tidak boleh kosong.
          </div>
        ),
      });
      return;
    }

    const updateSchedule = await updateData({
      id: row.original.id,
      datetime: row.original.datetime,
      weight: data.weight,
    })
    if (updateSchedule instanceof Error || !updateSchedule) {
      return toast({
        title: "Perubahan Berat Pakan Gagal",
        description: "Terjadi kesalahan saat mengubah berat pakan, silahkan coba lagi.",
        variant: "destructive",
      });
    }
    toast({
      title: "Perubahan Berat Pakan Berhasil",
      description: (
        <div>
          Berat pakan berhasil diubah menjadi: <strong>{data.weight} gram</strong>.
        </div>
      ),
    });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="md:flex items-center justify-center space-x-4">
                <FormControl>
                  <Input className="border-0 text-center" type="number" placeholder="Berat pakan (gram)" {...field}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                  />
                </FormControl>
                {isEditing && (
                  <div>
                    <Button className="" type="submit">Simpan</Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

export default WeightForm;
