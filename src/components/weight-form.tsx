"use client"
import { Row } from "@tanstack/react-table";
import { Schedule } from "../../constants/seed";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { updateData } from "@/action/action";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  weight: z.coerce.number().min(1),
})

interface WeightFormProps {
  row: Row<Schedule>
}

type FormSchemaType = z.infer<typeof formSchema>

const WeightForm = ({ row }: WeightFormProps) => {

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
      status: row.original.status,
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className={cn("hidden w-full mt-4 md:w-24",
            form.formState.isDirty && "inline",
            form.formState.isSubmitted && "hidden"

          )} type="submit">Save</Button>
        </form>
      </Form >
    </>
  );
}

export default WeightForm;
