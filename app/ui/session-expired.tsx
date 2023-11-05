"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import useOrigin from "./origin";

export default function SessionExpired() {
  const origin = useOrigin();
  useEffect(() => {
    const timer = setTimeout(
      () => signOut({ redirect: true, callbackUrl: `${origin}` }),
      50,
    );
    return () => {
      clearInterval(timer);
    };
  }, [origin]);
  return <p>Your session is expired</p>;
}
