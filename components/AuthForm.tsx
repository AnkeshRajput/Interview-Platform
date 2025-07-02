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
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
const authFormSchema = (type:FormType)=>{
  return z.object({
    name: type==='sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),

  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type==='sign-up'){
        const {name ,email,password}= values;

        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)

        const result = await signUp({
          uid:userCredentials.user.uid,
          name:name!,
          email,
          password,
        })

        if(!result?.success){
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/signin")
        console.log('SIGN UP',values);
      }else{
        const {email,password} = values;
        const userCredentials = await signInWithEmailAndPassword(auth,email,password);

        const idToken = await userCredentials.user.getIdToken();

        if(!idToken){
          toast.error("Failed to sign in. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        })
        toast.success("sign in successfully");
        router.push("/")
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
            <h2 className="text-primary-100">PrepWise</h2>
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

             
              <div className="flex  justify-center "><Button className="btn  w-full bg-primary-200 hover:bg-orange-300 hover:scale-105" type="submit">
                {isSignIn ? "Sign In" : "Create an Account"}
              </Button></div>
              
            </form>
          </Form>
          <p className="font-bold text-user-primary ml-1 flex items-center justify-center">
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
