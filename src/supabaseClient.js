import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dhdbsccvryffbfwziqjf.supabase.co'  // replace with your URL
const supabaseAnonKey = 'sb_publishable_17cMKBHZz4njjUp-JhN4TA_ZvDAY4K-'                   // replace with your key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)