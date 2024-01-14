import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


let REACT_APP_SUPABASE_URL='https://yahwcmpedahqkoeyulpk.supabase.co'
let REACT_APP_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHdjbXBlZGFocWtvZXl1bHBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjkzNjgxOSwiZXhwIjoyMDEyNTEyODE5fQ.739IfVYf66FfjF9pXKxvbZZt77_9nU_QEnIPyOv5oAc'



const supabaseUrl = REACT_APP_SUPABASE_URL
const supabaseAnonKey = REACT_APP_SUPABASE_ANON_KEY


export const supabase = createClient(supabaseUrl, supabaseAnonKey)