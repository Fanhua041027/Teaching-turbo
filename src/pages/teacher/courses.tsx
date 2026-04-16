import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

type Course = {
  id: string;
  name: string;
  description: string;
  students: number;
  status: "draft" | "published" | "archived";
  startDate: string;
  endDate: string;
  coverImage?: string;
  materials?: {
    id: string;
    name: string;
    type: string;
    file: File | null;
    url?: string;
  }[];
  assignments?: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    materials: string[];
    published: boolean;
  }[];
};

type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  submissions: number;
  graded: number;
  aiGraded?: boolean;
};

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Python编程入门",
    description: "学习Python基础语法和编程思想",
    students: 25,
    status: "published",
    startDate: "2025-07-01",
    endDate: "2025-08-30",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Python%20programming%20course&sign=7a6ae4ead0d29fc5f9961039d9bf3f99",
    materials: [],
    assignments: []
  },
  {
    id: "2",
    name: "机器学习基础",
    description: "掌握机器学习基本算法和应用",
    students: 18,
    status: "published",
    startDate: "2025-08-01",
    endDate: "2025-09-30",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Machine%20learning%20course&sign=ee1a9c417fadd7eb74648f04ff984c37",
    materials: [],
    assignments: []
  },
  {
    id: "3",
    name: "Web开发进阶",
    description: "深入学习现代Web开发技术",
    students: 0,
    status: "draft",
    startDate: "2025-09-01",
    endDate: "2025-10-31",
    coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Web%20development%20course&sign=e8b73c5f3047e8cd0a342acf86f639ab",
    materials: [],
    assignments: []
  }
];

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Python基础练习",
    dueDate: "2025-07-15",
    submissions: 22,
    graded: 18,
    aiGraded: true
  },
  {
    id: "2",
    title: "数据分析项目",
    dueDate: "2025-07-30",
    submissions: 15,
    graded: 10,
    aiGraded: false
  }
];

const studentPerformanceData = [
  { name: "优秀", students: 5 },
  { name: "良好", students: 10 },
  { name: "中等", students: 7 },
  { name: "及格", students: 3 },
  { name: "不及格", students: 0 }
];

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: "", type: "课件", file: null as File | null });
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    materials: [] as string[],
    published: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePublishCourse = (id: string) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, status: "published" } : c
    ));
    toast.success("课程已发布");
  };

  const handleArchiveCourse = (id: string) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, status: "archived" } : c
    ));
    toast.success("课程已归档");
  };

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setShowForm(true);
  };

  const handleSaveCourse = (course: Course) => {
    if (currentCourse) {
      setCourses(courses.map(c => 
        c.id === currentCourse.id ? { ...course, id: currentCourse.id } : c
      ));
      toast.success("课程更新成功");
    } else {
      const newCourse = { 
        ...course, 
        id: Date.now().toString(),
        coverImage: `https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%24%7BencodeURIComponent%28course.name%29%7D&sign=bedd31e433a0747b9b0da4543e3d0002`,
        materials: [],
        assignments: []
      };
      setCourses([...courses, newCourse]);
      toast.success("课程添加成功");
    }
    setShowForm(false);
  };

  const handleAddMaterial = () => {
    if (!currentCourse || !newMaterial.name || !newMaterial.file) return;
    
    const material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      type: newMaterial.type,
      file: newMaterial.file,
      url: URL.createObjectURL(newMaterial.file)
    };
    
    const updatedCourse = {
      ...currentCourse,
      materials: [...(currentCourse.materials || []), material]
    };
    
    setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    setNewMaterial({ name: "", type: "课件", file: null });
    toast.success("课件已添加");
  };

  const handleRemoveMaterial = (materialId: string) => {
    if (!currentCourse) return;
    
    const updatedCourse = {
      ...currentCourse,
      materials: (currentCourse.materials || []).filter(m => m.id !== materialId)
    };
    
    setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    toast.success("课件已删除");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewMaterial({...newMaterial, file: e.target.files[0]});
    }
  };

  const handleDownloadMaterial = (material: Course["materials"][0]) => {
    if (material.url) {
      const a = document.createElement('a');
      a.href = material.url;
      a.download = material.name;
      a.click();
      toast.success("开始下载课件");
    }
  };

  const handleCreateAssignment = () => {
    if (!currentCourse) return;
    
    const assignment = {
      id: Date.now().toString(),
      ...newAssignment
    };
    
    const updatedCourse = {
      ...currentCourse,
      assignments: [...(currentCourse.assignments || []), assignment]
    };
    
    setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    setNewAssignment({
      title: "",
      description: "",
      dueDate: "",
      materials: [],
      published: false
    });
    setShowAssignmentForm(false);
    toast.success("作业已创建");
  };

  const handlePublishAssignment = (assignmentId: string) => {
    if (!currentCourse) return;
    
    const updatedCourse = {
      ...currentCourse,
      assignments: (currentCourse.assignments || []).map(a => 
        a.id === assignmentId ? { ...a, published: true } : a
      )
    };
    
    setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
    toast.success("作业已发布");
  };

  const handleAiGradeAll = (assignmentId: string) => {
    setAssignments(assignments.map(a => 
      a.id === assignmentId ? { ...a, aiGraded: true } : a
    ));
    toast.success("AI批改已启用");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">课程管理</h1>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            新增课程
          </button>
        </div>

        {/* 课程统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-[#0A2463] text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">总课程数</h3>
            <p className="text-2xl font-bold">{courses.length}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-green-500 text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">进行中课程</h3>
            <p className="text-2xl font-bold">
              {courses.filter(c => c.status === "published").length}
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-blue-500 text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">总学生数</h3>
            <p className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.students, 0)}
            </p>
          </motion.div>
        </div>

        {/* 学生表现图表 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">学生成绩分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#3E92CC" name="学生人数" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 课程列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    课程名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学生人数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    开课时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{course.name}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.startDate} ~ {course.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          course.status === "published"
                            ? "bg-green-100 text-green-800"
                            : course.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {course.status === "published"
                          ? "已发布"
                          : course.status === "draft"
                          ? "草稿"
                          : "已归档"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setCurrentCourse(course);
                            setShowMaterials(true);
                          }}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-file-arrow-down"></i>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentCourse(course);
                            setShowAssignmentForm(true);
                          }}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-tasks"></i>
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        {course.status === "draft" && (
                          <button
                            onClick={() => handlePublishCourse(course.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <i className="fa-solid fa-upload"></i>
                          </button>
                        )}
                        {course.status === "published" && (
                          <button
                            onClick={() => handleArchiveCourse(course.id)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <i className="fa-solid fa-box-archive"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 作业列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">近期作业</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作业名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    截止时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交人数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    已批改
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    批改方式
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment, index) => (
                  <motion.tr
                    key={assignment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.submissions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.graded}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        assignment.aiGraded ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      )}>
                        {assignment.aiGraded ? "AI批改" : "手动批改"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => handleAiGradeAll(assignment.id)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <i className="fa-solid fa-robot"></i>
                        </button>
                        <button className="text-[#3E92CC] hover:text-[#2E86AB]">
                          <i className="fa-solid fa-check-double"></i>
                        </button>
                        <button className="text-[#3E92CC] hover:text-[#2E86AB]">
                          <i className="fa-solid fa-chart-line"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 课程表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentCourse ? "编辑课程" : "新增课程"}
              </h3>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const course = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  startDate: formData.get("startDate") as string,
                  endDate: formData.get("endDate") as string,
                  status: formData.get("status") as "draft" | "published" | "archived",
                  students: currentCourse?.students || 0
                };
                handleSaveCourse(course);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      课程名称 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={currentCourse?.name || ""}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      课程描述 *
                    </label>
                    <textarea
                      name="description"
                      defaultValue={currentCourse?.description || ""}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        开始时间 *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        defaultValue={currentCourse?.startDate || ""}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        结束时间 *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        defaultValue={currentCourse?.endDate || ""}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      状态
                    </label>
                    <select
                      name="status"
                      defaultValue={currentCourse?.status || "draft"}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                    >
                      <option value="draft">草稿</option>
                      <option value="published">已发布</option>
                      <option value="archived">已归档</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* 课件管理弹窗 */}
      {showMaterials && currentCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{currentCourse.name} - 课件管理</h3>
              <button
                onClick={() => setShowMaterials(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">上传新课件</h4>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="课件名称"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={newMaterial.type}
                    onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="课件">课件</option>
                    <option value="讲义">讲义</option>
                    <option value="参考资料">参考资料</option>
                  </select>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  >
                    {newMaterial.file ? newMaterial.file.name : "选择文件"}
                  </button>
                  <button
                    onClick={handleAddMaterial}
                    disabled={!newMaterial.name || !newMaterial.file}
                    className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB] disabled:opacity-50"
                  >
                    上传
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        课件名称
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(currentCourse.materials || []).map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {material.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {material.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleDownloadMaterial(material)}
                              className="text-[#3E92CC] hover:text-[#2E86AB]"
                            >
                              <i className="fa-solid fa-download"></i>
                            </button>
                            <button
                              onClick={() => handleRemoveMaterial(material.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 作业创建弹窗 */}
      {showAssignmentForm && currentCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">创建新作业 - {currentCourse.name}</h3>
              <button
                onClick={() => setShowAssignmentForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作业标题 *
                  </label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作业描述 *
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期 *
                  </label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    关联课件
                  </label>
                  <select
                    multiple
                    value={newAssignment.materials}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions, option => option.value);
                      setNewAssignment({...newAssignment, materials: options});
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC] h-auto"
                  >
                    {(currentCourse.materials || []).map(material => (
                      <option key={material.id} value={material.id}>{material.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="publishNow"
                    checked={newAssignment.published}
                    onChange={(e) => setNewAssignment({...newAssignment, published: e.target.checked})}
                    className="h-4 w-4 text-[#3E92CC] focus:ring-[#3E92CC] border-gray-300 rounded"
                  />
                  <label htmlFor="publishNow" className="ml-2 text-sm text-gray-700">
                    立即发布
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignmentForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateAssignment}
                  disabled={!newAssignment.title || !newAssignment.description || !newAssignment.dueDate}
                  className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB] disabled:opacity-50"
                >
                  创建作业
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
