// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ikmkqmajdtnxttyvpjgv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbWtxbWFqZHRueHR0eXZwamd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3OTc2MDQsImV4cCI6MjA2ODM3MzYwNH0.st1Joi7y7G1xy1A1WINfiruBQTCAEXIMM9R_JTE1uPA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});