# 🇮🇳 NSS Web Platform

A robust web application for National Service Scheme (NSS) built using **React**, **Node.js**, and **Firebase**, empowering **Admins and Heads** to efficiently manage volunteers, events, attendance, media, and conduct sentiment analysis.

---

## 🚀 Features

### 🧑‍💼 Role-Based Access
- **Admin**
  - Can view reports (attendance, volunteers, sentiment analysis).
  - Manage NSS heads.
- **Head**
  - Full control over volunteers and events.
  - Add/Remove volunteers.
  - Mark and manage attendance.
  - Upload and manage gallery images.
  - Analyze feedback using sentiment analysis.
  - View detailed reports.

---

## 🛠️ Modules

| Module                | Description                                                  |
|----------------------|--------------------------------------------------------------|
| 📸 Gallery Management | Upload, view, and manage event photos.                       |
| ✅ Attendance         | Mark daily/event-based attendance for volunteers.            |
| 👥 Role Management    | Assign and manage roles: Admin, Head, Volunteer.             |
| ➕ Add Volunteers     | Add new volunteers with profile info and contact details.    |
| 🔄 Manage Volunteers  | Edit/update volunteer data and assign tasks.                 |
| 📅 Event Management   | Create, edit, and track events.                              |
| 📊 Sentiment Analysis | Analyze volunteer feedback using basic NLP techniques.       |
| 📈 Reports            | View attendance, volunteer stats, and sentiment summaries.   |

---

## 🧩 Tech Stack

| Layer     | Technologies                        |
|-----------|-------------------------------------|
| Frontend  | React.js, Tailwind CSS              |
| Backend   | Node.js, Express.js                 |
| Database  | Firebase Realtime Database / Firestore |
| Auth      | Firebase Authentication             |
| NLP       | Python (for Sentiment Analysis APIs)|
| Storage   | Firebase Storage                    |

---

## 🔐 Roles & Permissions

| Feature              | Admin | Head |
|----------------------|:-----:|:----:|
| View Reports         | ✅    | ✅   |
| Manage Heads         | ✅    | ❌   |
| Manage Volunteers    | ❌    | ✅   |
| Attendance           | ❌    | ✅   |
| Event Management     | ❌    | ✅   |
| Sentiment Analysis   | ❌    | ✅   |
| Gallery Management   | ❌    | ✅   |


👥 Authors
Yogesh Ingale — Lead Developer (React + Firebase + Node.js)
