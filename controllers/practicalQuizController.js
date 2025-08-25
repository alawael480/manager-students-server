import { supabase } from "../services/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

// إضافة مذاكرة عملية
export const createPracticalQuiz = async (req, res) => {
  const {
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade,
  } = req.body;

  const payload = {
    id: uuidv4(),
    student_id,
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade,
    type: "practical"
  };

  const { data, error } = await supabase
    .from("quizzes")
    .insert([payload])
    .select();

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json({
    message: "✅ تم إضافة المذاكرة العملية بنجاح",
    data: data[0]
  });
};

// عرض كل المذاكرات العملية
export const getPracticalQuiz = async (req, res) => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("type", "practical")
    .order("quiz_date", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({
    message: "✅ تم جلب المذاكرات العملية بنجاح",
    data
  });
};

// تعديل مذاكرة عملية
export const updatePracticalQuiz = async (req, res) => {
  const { id } = req.params;
  const {
    quiz_title,
    quiz_name,
    quiz_date,
    quiz_grade,
  } = req.body;

  const { data, error } = await supabase
    .from("quizzes")
    .update({
      quiz_title,
      quiz_name,
      quiz_date,
      quiz_grade,
    })
    .eq("id", id)
    .eq("type", "practical")
    .select();

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({
    message: "✏️ تم تعديل المذاكرة العملية بنجاح",
    data: data[0]
  });
};

// حذف مذاكرة عملية
export const deletePracticalQuiz = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", id)
    .eq("type", "practical");

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({
    message: "🗑️ تم حذف المذاكرة العملية بنجاح"
  });
};
export const getPracticalQuizzes = async (req, res) => {
  try {
    // جلب أسماء المواد العملية فقط
    const { data, error } = await supabase
      .from("quizzes")
      .select("quiz_name")
      .eq("type", "practical");

    if (error) throw error;

    // إزالة التكرار
    const uniqueSubjects = [...new Set(data.map(item => item.quiz_name).filter(Boolean))];

    res.json({ subjects: uniqueSubjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في جلب المواد العملية" });
  }
};
