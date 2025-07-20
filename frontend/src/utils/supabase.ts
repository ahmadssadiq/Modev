import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ljtujpxhwuxarcsxzsds.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHVqcHhod3V4YXJjc3h6c2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTYyOTUsImV4cCI6MjA2ODUzMjI5NX0.NK6niIXgVJxceZgh5FrlwR6USdYY5Jqnu5pM-FNlN5Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 