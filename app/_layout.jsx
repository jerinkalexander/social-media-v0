"use client"

import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import ScreenContainer from "../components/ScreenContainer"
import { supabase } from "../lib/supabase"

export default function RootLayout() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) {
    return null // Add loading screen here
  }

  return (
        <ScreenContainer>

    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </ScreenContainer>
  )
}
