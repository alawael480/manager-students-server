// server/controllers/teacherController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase, verifyUserToken } from "../services/supabaseClient.js";

const COOKIE_NAME = "authToken";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
    path: "/",
  };

// تسجيل دخول المدرّس (بدون تحقق مسبق)
export async function loginTeacher(req, res) {
  const { email, password } = req.body;
  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !teacher) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  const match = await bcrypt.compare(password, teacher.password_hash);
  if (!match) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  const token = jwt.sign(
    { id: teacher.id, email: teacher.email, name: teacher.name },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  // ✅ هنا أرجع الـ ID مع الرد
  return res.json({
    message: "تم تسجيل الدخول بنجاح",
    id: teacher.id,
    name: teacher.name
  });
}

// جلب بروفايل المدرّس (مع التحقق داخل الدالة)
export async function getTeacherProfile(req, res) {
  try {
    // 1) استخرج التوكن من الكوكيز
    const token = req.cookies[COOKIE_NAME];
    if (!token) throw new Error("غير مصرح");

    // 2) تحقق من التوكن
    const user = await verifyUserToken(token);

    // 3) أعد جلب بيانات أحدث من قاعدة البيانات
    const { data: teacher, error } = await supabase
      .from("teachers")
      .select("id, email, name")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return res.json(teacher);

  } catch (err) {
    // مسح الكوكيز إذا كان التوكن غير صالح
    res.clearCookie(COOKIE_NAME, { path: "/" });
    return res.status(401).json({ error: err.message });
  }
}

// تعديل الإيميل أو الباسورد (مع التحقق داخل الدالة)
// تعديل الإيميل أو الباسورد مع تغيير الـ ID
export async function updateTeacherProfile(req, res) {
  try {
    const { id: newId, name, email, password } = req.body;

    // جلب أول أستاذ من الجدول
    const { data: teacher, error: fetchError } = await supabase
      .from("teachers")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !teacher) {
      return res.status(404).json({ error: "لا يوجد أستاذ لتحديثه" });
    }

    // تشفير كلمة المرور إذا تم إرسالها
    let password_hash = null;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    // تجهيز البيانات للتحديث
    const updates = {
      id: newId, // ✅ تغيير الـ ID
      name,
      email,
      updated_at: new Date().toISOString(),
    };

    if (password_hash) {
      updates.password_hash = password_hash;
    }

    // تنفيذ التحديث في Supabase
    const { error: updateError } = await supabase
      .from("teachers")
      .update(updates)
      .eq("id", teacher.id);

    if (updateError) {
      return res.status(400).json({ error: "فشل التحديث", details: updateError.message });
    }

    return res.json({
      message: "✅ تم تحديث بيانات الأستاذ وتغيير الـ ID بنجاح",
      newId
    });
  } catch (err) {
    return res.status(500).json({ error: "خطأ في السيرفر", details: err.message });
  }
}

