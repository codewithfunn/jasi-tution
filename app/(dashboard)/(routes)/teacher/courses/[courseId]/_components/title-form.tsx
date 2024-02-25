"use client";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current)=>!current);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    
    try {
        await axios.patch(`/api/courses/${courseId}`, value);
        toast.success("Course title updated successfully");
        toggleEdit();
        router.refresh();
    }catch (error) {
        console.log(error);
        toast.error("Something went wrong. Please try again later");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 ">
      <div className="font-medium flex items-center justify-between">
        Course Title
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h4  w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {
        !isEditing &&(
            <p className="text-sm mt-2">
                {initialData.title}
            </p>
        )
      }
      {
        isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-8"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                    disabled={isSubmitting}
                                    placeholder="e.g. 'Advanced Web Development'"
                                    {...field}
                                    />
                                </FormControl>
                                </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button 
                                disabled={isSubmitting || !isValid}
                                type="submit"
                            >
                                Save 
                            </Button>
                        </div>
                </form>
            </Form>
        )
      }
    </div>
  );
};
