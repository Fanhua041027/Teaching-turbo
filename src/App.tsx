import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersManagement from "@/pages/admin/users";
import CoursesManagement from "@/pages/admin/courses";
import TeacherLayout from "@/components/teacher/TeacherLayout";
import AssignmentsManagement from "@/pages/teacher/assignments";
import Dashboard from "@/pages/teacher/dashboard";
import DeepSeekAssistant from "@/pages/teacher/DeepSeekAssistant";
import StudentLayout from "@/components/student/StudentLayout";
import Sandbox from "@/pages/student/sandbox";
import NotesPage from "@/pages/student/notes";
import LearningPath from "@/pages/student/path";
import { createContext, useState } from "react";
import { Empty } from "@/components/Empty";
import AdminDashboard from "@/pages/admin/dashboard";
import TeacherHome from "@/pages/teacher/home";
import StudentHome from "@/pages/student/home";
import SystemSettings from "@/pages/admin/settings";
import StudentResources from "@/pages/student/resources";
import AIChatPage from "@/pages/student/ai-assistant";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<UsersManagement />} />
          <Route path="courses" element={<CoursesManagement />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="assignments" element={<AssignmentsManagement />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Empty />} />
          <Route path="announcements" element={<Empty />} />
          <Route path="deepseek-assistant" element={<DeepSeekAssistant />} />
          <Route index element={<TeacherHome />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="path" element={<LearningPath />} />
          <Route path="assignments" element={<Empty />} />
          <Route path="ai-assistant" element={<AIChatPage />} />
          <Route path="resources" element={<StudentResources />} />
          <Route index element={<StudentHome />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}
