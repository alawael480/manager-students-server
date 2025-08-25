import { supabase } from "../services/supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';
const student_id = uuidv4();

// استدعاء طلاب
export const getStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// اضافة طلاب
export const addStudent = async (req, res) => {
  try {
    const { 
      name,
      student_id,
      section,
      specialization, 
      phone,
      nameSchool,
      guardianNum 
    } = req.body;

    const { data, error } = await supabase
      .from("students")
      .insert([{ 
        name, 
        section, 
        specialization, 
        phone,
        nameSchool,
        guardianNum
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// update
export const updateStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    name,
    specialization,
    section,
    nameSchool,
    guardianNum,
    phone
  } = req.body;

  const { data, error } = await supabase
    .from('students')
    .update({
      name,
      specialization,
      section,
      nameSchool,
      guardianNum,
      phone
    })
    .eq('student_id', student_id)
    .select();

  if (error) {
    console.error("Supabase update error:", error);
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({
    message: '✅ تم تحديث بيانات الطالب بنجاح',
    data
  });
};




// حذف الطلاب 

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "✅ تم حذف الطالب بنجاح" });
  } catch (err) {
    console.error("❌ خطأ في الحذف:", err.message);
    res.status(500).json({ error: "حدث خطأ أثناء الحذف" });
  }
};