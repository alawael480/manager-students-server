import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient.js';

// 1) إرجاع كل الملاحظات
export const getAllQuiz = async (req, res) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('quiz_date', { ascending: false });

  if (error) {
    console.error("Supabase select all error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({
    message: '✅ تم جلب جميع الملاحظات بنجاح',
    data
  });
};

// 2) إرجاع الملاحظات لطالب محدد (مصوّغة كمصفوفة)
export const getQuizByStudent = async (req, res) => {
  const { student_id } = req.params;

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('student_id', student_id)
    .order('quiz_date', { ascending: false });

  if (error) {
    console.error("Supabase select by student error:", error);
    return res.status(500).json({ message: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: '❌ لا توجد ملاحظات لهذا الطالب' });
  }

  return res.status(200).json({
    message: '✅ تم جلب الملاحظات بنجاح',
    data    // أرجع كل الملاحظات، ليست data[0]
  });
};

// 3) إضافة ملاحظة جديدة
export const createQuiz = async (req, res) => {
  const {
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade
  } = req.body;

  const payload = {
    id: uuidv4(),
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade
  };

  const { data, error } = await supabase
    .from('quizzes')
    .insert([payload])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(201).json({
    message: '✅ تم إضافة الملاحظة بنجاح',
    data: data[0]
  });
};

// 4) تعديل ملاحظة (أو ملاحظات) حسب student_id
export const updateQuizByStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade
  } = req.body;

  const { data, error } = await supabase
    .from('quizzes')
    .update({
      quiz_title,
      quiz_name,
      quiz_date,
      quiz_grade
    })
    .eq('student_id', student_id)
    .select();

  if (error) {
    console.error("Supabase update error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({
    message: '✅ تم تحديث الملاحظات بنجاح',
    data
  });
};

// 5) حذف/مسح ملاحظة حسب student_id
// حذف كل الكويزات الخاصة بطالب
export const deleteQuizByStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase
    .from('quizzes')
    .delete()
    .eq('student_id', student_id);

  if (error) {
    console.error("Supabase delete error:", error);
    return res.status(500).json({ message: error.message });
  }
  return res.status(200).json({
    message: '🗑 تم مسح ملاحظات الطالب بنجاح',
    data
  });
};

// حذف كويز واحد بالـ id
export const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('quizzes')
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
