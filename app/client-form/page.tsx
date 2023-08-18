"use client";

import { useForm } from "react-hook-form";
import {
  Input,
  date,
  email,
  minLength,
  nullish,
  object,
  string,
} from "valibot";

import { cn } from "@/lib/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input as InputField } from "../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

const schema = object({
  firstName: string("firstName is required", [
    minLength(3, "Needs to be at least 3 characters"),
  ]),
  lastName: string("lastName is required", [
    minLength(3, "Needs to be at least 3 characters"),
  ]),
  email: string("email is required", [
    minLength(3, "Needs to be at least 3 characters"),
    email("The email address is badly formatted."),
  ]),
  mobileNumber: string("mobileNumber is required"),
  birthDate: nullish(date("birthDate is required")),
});

type FormData = Input<typeof schema>;

export default function ClientForm() {
  const form = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      birthDate: null,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = form;
  const onSubmit = (data: FormData) => {
    window?.top?.postMessage(
      {
        type: "client-form-submit",
        payload: data,
      },
      "*"
    );
  };
  console.log(errors);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center">Client Form</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 max-w-lg mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <InputField placeholder="Enter your first name" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <InputField placeholder="Enter your last name" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <InputField placeholder="Enter your email" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <InputField
                    type="tel"
                    placeholder="Enter your mobile number"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <FormLabel>Date of birth</FormLabel>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      // disabled={(date) =>
                      //   date > new Date() || date < new Date("2025-01-01")
                      // }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>

          {/* <input type="submit" /> */}
        </form>
      </Form>
    </main>
  );
}
