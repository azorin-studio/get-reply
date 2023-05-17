'use client'

import { useEffect } from "react";

export default async function useRefresh () {
  useEffect(() => {
    const interval = setTimeout(() => window.location.reload(), 5000);
    return () => {
      clearTimeout(interval);
    };
  }, [])
}