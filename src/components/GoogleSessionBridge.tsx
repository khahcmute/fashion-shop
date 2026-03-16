"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "@/features/auth/authSlice";

export default function GoogleSessionBridge() {
  const { status, data: session } = useSession();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const syncedRef = useRef(false);

  useEffect(() => {
    async function syncGoogleSession() {
      if (status !== "authenticated" || !session?.user?.email) return;
      if (isAuthenticated) return;
      if (syncedRef.current) return;

      syncedRef.current = true;

      const res = await fetch("/api/auth/google-bridge", {
        method: "POST",
      });

      if (res.ok) {
        await dispatch(fetchMe());
      } else {
        syncedRef.current = false;
      }
    }

    syncGoogleSession();
  }, [status, session, isAuthenticated, dispatch]);

  return null;
}
