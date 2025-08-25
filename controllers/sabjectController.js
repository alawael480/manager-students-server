import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient.js';

// 1) إرجاع كل الملاحظات
export const getAllNotes = async (req, res) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('type', 'theory') // ✅ فلترة المواد النظرية فقط
    .order('sabject_date', { ascending: false });

  if (error) {
    console.error("Supabase select all error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({
    message: '✅ تم جلب جميع الملاحظات النظرية بنجاح',
    data
  });
};

// 2) إرجاع الملاحظات لطالب محدد (مصوّغة كمصفوفة)
export const getNoteByStudent = async (req, res) => {
  const { student_id } = req.params;

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('student_id', student_id)
    .eq('type', 'theory') // ✅ فلترة المواد النظرية
    .order('sabject_date', { ascending: false });

  if (error) {
    console.error("Supabase select by student error:", error);
    return res.status(500).json({ message: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: '❌ لا توجد ملاحظات نظرية لهذا الطالب' });
  }

  return res.status(200).json({
    message: '✅ تم جلب الملاحظات النظرية بنجاح',
    data
  });
};

// 3) إضافة ملاحظة جديدة
export const createNote = async (req, res) => {
  const {
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade
  } = req.body;

  const payload = {
    id: uuidv4(),
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
    type: 'theory' // ✅ تحديد النوع كنظرية
  };

  const { data, error } = await supabase
    .from('notes')
    .insert([payload])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(201).json({
    message: '✅ تم إضافة الملاحظة النظرية بنجاح',
    data: data[0]
  });
};

// 4) تعديل ملاحظة (أو ملاحظات) حسب student_id
export const updateNoteByStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade
  } = req.body;

  const { data, error } = await supabase
    .from('notes')
    .update({
      sabject_title,
      sabject_name,
      sabject_date,
      sabject_grade
    })
    .eq('student_id', student_id)
    .eq('type', 'theory') // ✅ تعديل المواد النظرية فقط
    .select();

  if (error) {
    console.error("Supabase update error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({
    message: '✅ تم تحديث الملاحظات النظرية بنجاح',
    data
  });
};

// 5) حذف/مسح ملاحظة حسب student_id
export const deleteNoteByStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase
    .from('notes')
    .delete()
    .eq('student_id', student_id)
    .eq('type', 'theory'); // ✅ حذف المواد النظرية فقط

  if (error) {
    console.error("Supabase delete error:", error);
    return res.status(500).json({ message: error.message });
  }
  return res.status(200).json({
    message: '🗑 تم مسح ملاحظات الطالب النظرية بنجاح',
    data
  });
};

// حذف كويز واحد بالـ id
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Supabase delete error:", error);
    return res.status(500).json({ message: error.message });
  }
  return res.status(200).json({
    message: '🗑 تم حذف الملاحظة نهائياً بنجاح',
    data
  });
}
