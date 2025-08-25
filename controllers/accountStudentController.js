// controllers/studentController.js
import { supabase } from "../services/supabaseClient.js";

export async function getStudentData(req, res) {
  const { student_id } = req.params;

  const { data, error } = await supabase
    .from("students")
    .select("*, attendance(*), notes(*), quizzes(*)")
    .eq("student_id", student_id)
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({ student: data });
}