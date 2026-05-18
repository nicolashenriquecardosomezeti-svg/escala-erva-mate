import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akoeyhcblbkdyswkpkek.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrb2V5aGNibGJrZHlzd2twa2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzAxNjgsImV4cCI6MjA5NDcwNjE2OH0.Uy4_LxmnvAZzJdXAcvMS5C_bVozlfJ31n6BH0x4U6iE'

export const supabase = createClient(supabaseUrl, supabaseKey)