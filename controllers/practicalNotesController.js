import { supabase } from "../services/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

// إضافة مذاكرة عملية
export const createPracticalNote = async (req, res) => {
  const {
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
  } = req.body;

  const payload = {
    id: uuidv4(),
    student_id,
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
    type: "practical"
  };

  const { data, error } = await supabase
    .from("notes")
    .insert([payload])
    .select();

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json({
    message: "✅ تم إضافة المذاكرة العملية بنجاح",
    data: data[0]
  });
};

// عرض كل المذاكرات العملية
export const getPracticalNotes = async (req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("type", "practical")
    .order("sabject_date", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({
    message: "✅ تم جلب المذاكرات العملية بنجاح",
    data
  });
};

// تعديل مذاكرة عملية
export const updatePracticalNote = async (req, res) => {
  const { id } = req.params;
  const {
    sabject_title,
    sabject_name,
    sabject_date,
    sabject_grade,
  } = req.body;

  const { data, error } = await supabase
    .from("notes")
    .update({
      sabject_title,
      sabject_name,
      sabject_date,
      sabject_grade,
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
export const deletePracticalNote = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("type", "practical");

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({
    message: "🗑️ تم حذف المذاكرة العملية بنجاح"
  });
};


// جلب المواد العملية الفريدة من جدول notes
export const getPracticalSubjects = async (req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("sabject_name")
    .eq("type", "practical");

  if (error) return res.status(500).json({ message: error.message });

  // استخراج المواد الفريدة فقط
  const uniqueSubjects = [...new Set(data.map((item) => item.sabject_name).filter(Boolean))];

  res.status(200).json({
    message: "✅ تم جلب المواد العملية المدخلة بنجاح",
    subjects: uniqueSubjects
  });
};