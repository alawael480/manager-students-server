// controllers/authController.js
import { supabase } from "../services/supabaseClient.js";

export async function login(req, res) {
  const { student_id } = req.body;

  const { data, error } = await supabase
    .from("students")
    .select("student_id, name, specialization")
    .eq("student_id", student_id)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: "المعرف غير صحيح" });
  }

  // نخزن المعرف محلياً في الواجهة؛ هنا نرجع فقط بيانات الطالب
  return res.json({ message: "تم تسجيل الدخول", student: data });
}