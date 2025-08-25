import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ تأكد من وجود SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في ملف البيئة");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export async function verifyUserToken(token) {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new Error("❌ التوكن غير صالح أو المستخدم غير موجود");
  }

  return data.user;
}