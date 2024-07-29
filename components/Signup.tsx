"use client";

import React from 'react';
import { HiOutlineMail, HiOutlineLockClosed  } from "react-icons/hi";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { toast } from "sonner";
import { useRouter } from "next/router";

import Link from 'next/link'

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Can't be empty" })
      .email("Invalid email"),
    password: z.string().min(8, { message: "Invalid password" }).max(50),
    confirmPassword: z.string().min(8, { message: "Invalid password" }).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function Signup(): React.ReactElement {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues): Promise<void> {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        toast(data.message, {
          position: "bottom-center",
          style: {
            backgroundColor: "#FF3939",
            color: "white",
            textAlign: "center",
          },
        });

        return 
      }

      toast("User created successfuly.", {
        position: "bottom-center",
        style: {
          backgroundColor: "#333333",
          color: "white",
          textAlign: "center",
        },
        onDismiss: () => router.push("/"),
        onAutoClose: () => router.push("/"),
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }

  return (
    <div className="bg-primary text-white pt-4 p-8 rounded-xl max-w-[90vw]">
      <h1 className="font-bold text-[32px] text-center">Create account</h1>
      <p className="text-neutral-300 text-center">
        Let's get you started sharing your links!
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-10 flex flex-col"
        >
          <Input
            type="email"
            id="email"
            label="Email address"
            placeholder="e.g. alex@email.com"
          >
            <HiOutlineMail  />
          </Input>
          <Input
            type="password"
            id="password"
            label="Create password"
            placeholder="At least 8 characters"
          >
            <HiOutlineLockClosed />
          </Input>
          <Input
            type="password"
            id="confirmPassword"
            label="Confirm password"
            placeholder="At least 8 characters"
          >
            <HiOutlineLockClosed />
          </Input>

          <p className="text-xs text-dark-gray">
            Password must contain at least 8 characters
          </p>

          <Button text="Create new account"  />
          <p className="text-dark-gray text-xs text-center xl:text-md">
            Already have an account?{" "}
            <Link className="text-white underline cursor-pointer font-bold" href="/">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}