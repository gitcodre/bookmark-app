"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Session mei tokens ko daalna for fututre purpose that user wont get logged out on refresh 
// Google → /auth/callback → store session → /dashboard

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      await supabase.auth.getSession();
      router.push("/dashboard");
    };

    finishLogin();
  }, [router]);

  return <p>Logging in...</p>;
}
