import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import "react-native-url-polyfill/auto"

const supabaseUrl = 'https://hpozsyrisajwbgdnlydv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb3pzeXJpc2Fqd2JnZG5seWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDg2OTgsImV4cCI6MjA2NjE4NDY5OH0.ZsuFAVNw7tqAZPH4KKat8SupMDcm-Cv1IXb8uWqNDec'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
