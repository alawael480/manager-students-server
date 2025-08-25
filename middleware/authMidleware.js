// server/middleware/authMiddleware.js

import jwt from "jsonwebtoken";

/**
 * Middleware للتحقق من توكن التوثيق المخزن في كوكيز باسم "authToken".
 * إذا كان التوكن صالحاً يُلحق بيانات المستخدم في req.user ويكمل الطلب،
 * وإلا يمسح الكوكي ويرد 401 أو 403.
 */
export async function verifyAuth(req, res, next) {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ error: "غير مصرح – الرجاء تسجيل الدخول" });
    }

    // فك توكن JWT والتحقق من صلاحيته
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // احفظ بيانات المستخدم (id, email, name، الخ) في req.user
    req.user = decoded;
    
    // إذا وصلت هنا يعني كل شيء تمام
    return next();
  } catch (err) {
    // إذا التوكن انتهت صلاحيته أو غير صالح، نمسحه ورد 403
    res.clearCookie("authToken", { path: "/" });
    return res.status(403).json({ error: "توكن غير صالح أو منتهي الصلاحية" });
  }
}