import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://wmwkgtixjpjjlivtjvgx.supabase.co

const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd2tndGl4anBqamxpdnRqdmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MzU1NzUsImV4cCI6MjA2NTQxMTU3NX0.fT1387KB903YvkOxQQkHhOwasdY69UWGyU2QhKKZEAE

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
