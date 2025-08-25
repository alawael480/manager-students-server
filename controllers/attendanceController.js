import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabaseClient.js';

// GET /api/attendance → كل سجلات التفقد
export const getAllAttendance = async (req, res) => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .order('attendance_date', { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ data });
};

// GET /api/attendance/student/:student_id → سجلات طالب واحد
export const getAttendanceByStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', student_id);
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ data });
};

// GET /api/attendance/date/:date → سجلات يوم محدد
export const getAttendanceByDate = async (req, res) => {
  const { date } = req.params;
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('attendance_date', date);
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ data });
};

// POST /api/attendance → إضافة سجل
export const createAttendance = async (req, res) => {
  const payload = { id: uuidv4(), ...req.body };
  const { data, error } = await supabase
    .from('attendance')
    .insert([payload])
    .select();
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json({ data: data[0] });
};

// PUT /api/attendance/:id → تعديل سجل
export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase
    .from('attendance')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ data });
};

// DELETE /api/attendance/:id → حذف سجل
export const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);
  if (error) return res.status(500).json({ message: error.message });
  res.status(200).json({ data });
};
