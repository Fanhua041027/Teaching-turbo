import { useState } from "react";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Course = {
  id: string;
  name: string;
  teacher: string;
  time: string;
  status: "active" | "inactive";
};

type Stats = {
  total: number;
  active: number;
  inactive: number;
};

const mockCourses: Course[] = [
  { id: "1", name: "AI基础入门", teacher: "张教授", time: "2025-09-01", status: "active" },
  { id: "2", name: "机器学习实战", teacher: "李教授", time: "2025-09-15", status: "active" },
  { id: "3", name: "深度学习进阶", teacher: "王教授", time: "2025-10-01", status: "inactive" },
];

const mockStats: Stats = {
  total: 3,
  active: 2,
  inactive: 1
};

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [stats] = useState<Stats>(mockStats);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
    toast.success("课程删除成功");
  };

  const handleSaveCourse = (course: Course) => {
    if (currentCourse) {
      // 更新课程
      setCourses(courses.map((c) => (c.id === currentCourse.id ? { ...course, id: currentCourse.id } : c)));
      toast.success("课程更新成功");
    } else {
      // 新增课程
      const newCourse = { ...course, id: Date.now().toString() };
      setCourses([...courses, newCourse]);
      toast.success("课程添加成功");
    }
    setShowForm(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const filteredCourses = courses.filter((course) => {
    if (filterStatus === "all") return true;
    return course.status === filterStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Breadcrumb />
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

        {/* 状态卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => setFilterStatus("all")}
            className={`bg-[#0A2463] text-white p-4 rounded-lg shadow cursor-pointer ${filterStatus === "all" ? "ring-2 ring-[#3E92CC]" : ""}`}
          >
            <h3 className="text-sm opacity-80">总课程数</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => setFilterStatus("active")}
            className={`bg-green-500 text-white p-4 rounded-lg shadow cursor-pointer ${filterStatus === "active" ? "ring-2 ring-[#3E92CC]" : ""}`}
          >
            <h3 className="text-sm opacity-80">进行中</h3>
            <p className="text-2xl font-bold">{stats.active}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => setFilterStatus("inactive")}
            className={`bg-orange-500 text-white p-4 rounded-lg shadow cursor-pointer ${filterStatus === "inactive" ? "ring-2 ring-[#3E92CC]" : ""}`}
          >
            <h3 className="text-sm opacity-80">未开始</h3>
            <p className="text-2xl font-bold">{stats.inactive}</p>
          </motion.div>
        </div>

        {/* 日期选择器 */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            开课时间筛选
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
          />
        </div>

        {/* 课程列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    课程名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    授课教师
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
                {filteredCourses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50", "hover:bg-gray-100")}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.teacher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          course.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        )}
                      >
                        {course.status === "active" ? "进行中" : "未开始"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
                    teacher: formData.get("teacher") as string,
                    time: formData.get("time") as string,
                    status: formData.get("status") as "active" | "inactive"
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
                        授课教师 *
                      </label>
                      <input
                        type="text"
                        name="teacher"
                        defaultValue={currentCourse?.teacher || ""}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        开课时间 *
                      </label>
                      <input
                        type="date"
                        name="time"
                        defaultValue={currentCourse?.time || ""}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        状态
                      </label>
                      <select
                        name="status"
                        defaultValue={currentCourse?.status || "active"}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                      >
                        <option value="active">进行中</option>
                        <option value="inactive">未开始</option>
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
      </div>
    </div>
  );
}