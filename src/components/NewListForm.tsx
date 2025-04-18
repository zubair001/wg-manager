import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listFormSchema } from "@/schemas/list.schema";
import { z } from "zod";
import { TEXT } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createList } from "@/services/lists.service";
import { toast } from "sonner";
import { ListType, ListVisibility } from "@/interfaces/types";

type ListFormValues = z.infer<typeof listFormSchema>;

type Props = {
  onSuccess?: () => void;
};

export default function NewListForm({ onSuccess }: Props) {
  const form = useForm<ListFormValues>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      title: "",
      type: ListType.TODO,
      visibility: ListVisibility.PRIVATE,
      is_template: false,
    },
  });

  const { user } = useAuth();

  const onSubmit = async (values: ListFormValues) => {
    if (!user) {
      toast.error("You're not logged in");
      return;
    }

    const { error } = await createList({
      ...values,
      type: values.type === "todo" ? ListType.TODO : ListType.GROCERY,
      visibility:
        values.visibility === "flat"
          ? ListVisibility.FLAT
          : ListVisibility.PRIVATE,
      owner_id: user.id,
    });

    if (error) {
      toast.error("Failed to create list");
    } else {
      toast.success("List created successfully");
      form.reset();
      onSuccess?.();
    }
  };

  return (
    <div className="p-6 backdrop-blur-sm bg-white/60 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-[auto,1fr] items-center gap-4">
                  <FormLabel className="text-right w-32">
                    {TEXT.form.titlePlaceholder}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={TEXT.form.titlePlaceholder}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-[auto,1fr] items-center gap-4">
                  <FormLabel className="text-right w-32">
                    {TEXT.form.typeLabel}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-md border">
                        <SelectItem value="todo">
                          {TEXT.listTypes.todo}
                        </SelectItem>
                        <SelectItem value="grocery">
                          {TEXT.listTypes.grocery}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-[auto,1fr] items-center gap-4">
                  <FormLabel className="text-right w-32">Visibility</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-md border">
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="flat">Share with Flat</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}
