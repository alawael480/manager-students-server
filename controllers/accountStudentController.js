// controllers/studentController.js
import { pool } from "../config/db.js";

export async function getStudentData(req, res) {
  const { student_id } = req.params;

  try {
    const query = `
      SELECT 
        s.*,
        COALESCE(json_agg(DISTINCT a) FILTER (WHERE a.attendance_id IS NOT NULL), '[]') AS attendance,
        COALESCE(json_agg(DISTINCT n) FILTER (WHERE n.note_id IS NOT NULL), '[]') AS notes,
        COALESCE(json_agg(DISTINCT q) FILTER (WHERE q.quiz_id IS NOT NULL), '[]') AS quizzes
      FROM students s
      LEFT JOIN attendance a ON a.student_id = s.student_id
      LEFT JOIN notes n ON n.student_id = s.student_id
      LEFT JOIN quizzes q ON q.student_id = s.student_id
      WHERE s.student_id = $1
      GROUP BY s.student_id
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [student_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

    return res.status(200).json({ student: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}