import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

// تسجيل دخول المدرّس (بدون توكن أو حماية)
export async function loginTeacher(req, res) {
  const { email, password } = req.body;

  try {
    const query = `
      SELECT * FROM teachers 
      WHERE email = $1
    `;
    const { rows } = await pool.query(query, [email]);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    const match = await bcrypt.compare(password, teacher.password_hash);
    if (!match) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }

    return res.json({
      message: "تم تسجيل الدخول بنجاح",
      id: teacher.id,
      name: teacher.name
    });
  } catch (error) {
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

// جلب بروفايل المدرّس (بدون تحقق من التوكن)
export async function getTeacherProfile(req, res) {
  const { id } = req.params;

  try {
    const query = `
      SELECT id, email, name FROM teachers 
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    return res.json(teacher);
  } catch (err) {
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

// تعديل الإيميل أو الباسورد مع تغيير الـ ID (بدون تحقق)
export async function updateTeacherProfile(req, res) {
  try {
    const { id: newId, name, email, password } = req.body;

    const query = `
      SELECT id FROM teachers 
      LIMIT 1
    `;
    const { rows } = await pool.query(query);
    const teacher = rows[0];

    if (!teacher) {
      return res.status(404).json({ error: "لا يوجد أستاذ لتحديثه" });
    }

    let password_hash = null;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    let updateQuery = `
      UPDATE teachers 
      SET id = $1, name = $2, email = $3, updated_at = $4
    `;
    let values = [newId, name, email, new Date().toISOString()];
    let paramIndex = 5;

    if (password_hash) {
      updateQuery += `, password_hash = $${paramIndex}`;
      values.push(password_hash);
      paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex}`;
    values.push(teacher.id);

    const { rowCount } = await pool.query(updateQuery, values);

    if (rowCount === 0) {
      return res.status(400).json({ error: "فشل التحديث" });
    }

    return res.json({
      message: "✅ تم تحديث بيانات الأستاذ وتغيير الـ ID بنجاح",
      newId
    });
  } catch (err) {
    return res.status(500).json({ error: "خطأ في السيرفر", details: err.message });
  }
}