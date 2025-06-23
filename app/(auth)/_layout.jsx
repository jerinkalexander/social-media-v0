"use client"

import { Redirect, Stack } from "expo-router"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AuthLayout() {
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
    return null
  }

  if (session) {
    return <Redirect href="/(tabs)/feed" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
