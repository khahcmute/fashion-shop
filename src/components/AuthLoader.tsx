"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchMe } from "@/features/auth/authSlice";

export default function AuthLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return null;
}
