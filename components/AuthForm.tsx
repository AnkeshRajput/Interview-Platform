"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Form } from "@/components/ui/form"; // ✅

import { toast } from "sonner";
import FormField from "./FormField";
const authFormSchema = (type:FormType)=>{
  return z.object({
    name: type==='sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),

  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema=authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type==='sign-up'){
        console.log('SIGN UP',values);
      }else{
        console.log('SIGN IN',values);
      }
    }catch(error){
      console.error(error);
      toast.error(`There was an error : ${error}`)
    }
  }
  const isSignIn = type === "sign-in";
  return (
    <>
    
      <div className="card-border lg:min-w-[556px] ">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center ">
            <Image src={"/logo.svg"} alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">Preview</h2>
          </div>
          <h3>Practice Job interview with AI</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

             
              <div className="flex  justify-center bggree"><Button className="btn" type="submit">
                {isSignIn ? "Sign In" : "Create an Account"}
              </Button></div>
              
            </form>
          </Form>
          <p className="font-bold text-user-primary ml-1">
            {isSignIn ? "No account yet?  " : "Already Have an account? "}
            <Link href={!isSignIn ? "/signin" : "/signup"}>
              {!isSignIn ? "signIn" : "signUp"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
