import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import studentRoutes from './routes/studentsRoute.js';
import quizRoutes from './routes/quizRoute.js';
import sabjectRoute from './routes/sabjectRoute.js';
import attendanceRoute from './routes/attendanceRoute.js';
import authRouter from './routes/authRoute.js';
import accountStudentRoute from './routes/accountStudentRoute.js';
import teacherRoute from "./routes/teacherRoute.js";
import practicalNotesRoutes from "./routes/practicalNotesRoutes.js";
import practicalQuizRoutes from "./routes/practicalQuizRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ أول شيء: فعل الـ CORS على كل الطلبات
app.use(cors({
  origin: "https://e-school-client.vercel.app",
  credentials: true
}));

// ✅ دعم الـ preflight لكل المسارات
app.options("*", cors({
  origin: "https://e-school-client.vercel.app",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// ✅ مسارات الـ API
app.use('/api/students', studentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/sabject', sabjectRoute);
app.use('/api/attendance', attendanceRoute);
app.use("/api/auth", authRouter);
app.use("/api/students/account", accountStudentRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/practical-notes", practicalNotesRoutes);
app.use("/api/practical-quiz", practicalQuizRoutes);

// ✅ نقطة فحص
app.get("/", (req, res) => {
  res.send("✅ السيرفر يعمل بنجاح");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});