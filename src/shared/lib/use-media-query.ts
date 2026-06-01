"use client"

import { useSyncExternalStore } from "react"

const subscribe = (callback: () => void, query: string) => {
  const media = window.matchMedia(query)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

const getSnapshot = (query: string): boolean => {
  if (typeof window === "undefined") return false
  return window.matchMedia(query).matches
}

export const useMediaQuery = (query: string): boolean => {
  const matches = useSyncExternalStore(
    (callback) => subscribe(callback, query),
    () => getSnapshot(query),
    () => false,
  )
  return matches
}

export const useIsMobile = () => useMediaQuery("(max-width: 768px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")
