"use client";

import React, { useState } from "react";
import Image from "next/image";
import Input from "./Input";
import Button from "./Button";
import { HiOutlineMail, HiOutlineLockClosed  } from "react-icons/hi";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { signIn } from "next-auth/react";

import { useRouter } from "next/router";
import Link from 'next/link'

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Can't be empty" })
    .email("Invalid email"),
  password: z.string().min(8, { message: "Invalid password" }).max(50),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login(): React.ReactElement {
  const router = useRouter();

  const [error, setError] = useState<string>(
    router?.query?.error ? "Check your credentials." : "",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues): Promise<void> {
    const { email, password } = values;
    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  }

  return (
    <div className="bg-white pt-4 p-8 rounded-xl max-w-[90vw]">
      <h1 className="self-start font-bold text-[32px]">Login</h1>
      <p className="self-start text-dark-gray">
        Add your details below to get back into the app
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-10 flex flex-col"
          data-testid="login-component"
        >
          {error && (
            <span className="text-white bg-red/80 p-2 rounded-md self-center">
              {error}
            </span>
          )}
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
            label="Password"
            placeholder="Enter your password"
          >
            <HiOutlineLockClosed />
          </Input>
          <Button text="Login" onClick={form.handleSubmit(onSubmit)} />
          <p className="text-dark-gray text-xs text-center xl:text-md">
            Don't have an account?{" "}
            <Link className="text-primary cursor-pointer font-bold" href="/signup">
              Create account
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}