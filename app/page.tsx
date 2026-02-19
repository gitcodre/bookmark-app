"use client";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {

  // This thing does all stuff login with google google verifies then supabase creates token,refresh toke,exp time,user detail all in session object and pass it to the client after this rediecTo step will work 
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://bookmark-app-three-black.vercel.app/auth/callback",
      },
    });
  };

  return (
    <div className="bg-linear-to-br from-zinc-950 via-zinc-900 to-emerald-950/30 h-screen flex items-center justify-center ">
      <div className="flex flex-col gap-y-3">
        <h1 className="text-3xl">Hello, Welcome User !! Please SignIn to Continue !</h1>
        <button
          onClick={loginWithGoogle}
          className="text-white px-6 py-3 rounded border hover:scale-95 duration-200 cursor-pointer w-fit mx-auto animate-pulse"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
