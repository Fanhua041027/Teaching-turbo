import { useState } from "react";
import { BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AIChat from "@/components/AIChat";

type Assignment = {
  id: string;
  student: string;
  score: number;
  status: "pending" | "graded" | "plagiarized";
  code?: string;
  similarity?: number;
  feedback?: string;
};

type Stats = {
  average: number;
  distribution: { name: string; value: number }[];
};

const mockAssignments: Assignment[] = [
  { id: "1", student: "张三", score: 85, status: "graded", code: "print('Hello World')", similarity: 15, feedback: "代码结构良好，符合要求" },
  { id: "2", student: "李四", score: 0, status: "pending", code: "def add(a,b):\n  return a+b", similarity: 0 },
  { id: "3", student: "王五", score: 72, status: "plagiarized", code: "for i in range(10):\n  print(i)", similarity: 89, feedback: "代码与其他人高度相似" },
];

const mockStats: Stats = {
  average: 78.5,
  distribution: [
    { name: "优秀(90+)", value: 3 },
    { name: "良好(80-89)", value: 5 },
    { name: "中等(70-79)", value: 7 },
    { name: "及格(60-69)", value: 4 },
    { name: "不及格(<60)", value: 2 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [stats] = useState<Stats>(mockStats);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState("");

  const handleGradeAssignment = (id: string) => {
    setIsGrading(true);
    // 模拟AI批改过程
    setTimeout(() => {
      setAssignments(assignments.map(a => 
        a.id === id ? { 
          ...a, 
          status: "graded", 
          score: Math.floor(Math.random() * 40) + 60,
          feedback: feedbackInput || "AI自动批改完成"
        } : a
      ));
      setFeedbackInput("");
      setIsGrading(false);
      toast.success("作业批改完成");
    }, 2000);
  };

  const handleCheckPlagiarism = (id: string) => {
    setIsChecking(true);
    // 模拟查重过程
    setTimeout(() => {
      setAssignments(assignments.map(a => 
        a.id === id ? { 
          ...a, 
          similarity: Math.floor(Math.random() * 100),
          status: a.similarity && a.similarity > 50 ? "plagiarized" : a.status
        } : a
      ));
      setIsChecking(false);
      toast.success("查重检测完成");
    }, 1500);
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    if (assignment.feedback) {
      setFeedbackInput(assignment.feedback);
    }
  };

  const handleCloseViewer = () => {
    setSelectedAssignment(null);
    setFeedbackInput("");
  };

  const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">作业管理</h1>
          <button
            onClick={toggleAIChat}
            className={`px-4 py-2 rounded-md ${showAIChat ? "bg-[#0A2463] text-white" : "bg-[#3E92CC] text-white"}`}
          >
            <i className="fa-solid fa-robot mr-2"></i>
            {showAIChat ? "隐藏AI助手" : "显示AI助手"}
          </button>
        </div>

        {showAIChat && (
          <div className="mb-6">
            <AIChat apiKey="sk-5efb88e60a034999ba3a1cafa13e5c82" />
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-[#0A2463] text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">总作业数</h3>
            <p className="text-2xl font-bold">{assignments.length}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-green-500 text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">平均分</h3>
            <p className="text-2xl font-bold">{stats.average.toFixed(1)}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-blue-500 text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">待批改</h3>
            <p className="text-2xl font-bold">{assignments.filter(a => a.status === "pending").length}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-red-500 text-white p-4 rounded-lg shadow"
          >
            <h3 className="text-sm opacity-80">疑似抄袭</h3>
            <p className="text-2xl font-bold">{assignments.filter(a => a.status === "plagiarized").length}</p>
          </motion.div>
        </div>

        {/* 统计图表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">成绩分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3E92CC" name="人数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">成绩比例</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 作业列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学生
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    查重率
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
                    className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50", "hover:bg-gray-100")}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.score > 0 ? assignment.score : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          assignment.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {assignment.status === "graded" ? "已批改" : assignment.status === "pending" ? "待批改" : "抄袭"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.similarity ? (
                        <span
                          className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            assignment.similarity < 30
                              ? "bg-green-100 text-green-800"
                              : assignment.similarity < 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {assignment.similarity}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleViewAssignment(assignment)}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleGradeAssignment(assignment.id)}
                          disabled={isGrading}
                          className="text-[#3E92CC] hover:text-[#2E86AB] disabled:opacity-50"
                        >
                          {isGrading ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-check"></i>
                          )}
                        </button>
                        <button
                          onClick={() => handleCheckPlagiarism(assignment.id)}
                          disabled={isChecking}
                          className="text-[#3E92CC] hover:text-[#2E86AB] disabled:opacity-50"
                        >
                          {isChecking ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-magnifying-glass"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 作业查看弹窗 */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {selectedAssignment.student}的作业
                  {selectedAssignment.similarity && (
                    <span className="ml-4 text-sm font-normal">
                      查重率: <span className={cn(
                        selectedAssignment.similarity < 30
                          ? "text-green-600"
                          : selectedAssignment.similarity < 70
                          ? "text-yellow-600"
                          : "text-red-600"
                      )}>{selectedAssignment.similarity}%</span>
                    </span>
                  )}
                </h3>
                <button
                  onClick={handleCloseViewer}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="p-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
                  <pre>{selectedAssignment.code}</pre>
                </div>
                
                {selectedAssignment.status === "graded" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      反馈:
                    </label>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-700">{selectedAssignment.feedback}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedAssignment.status === "graded" ? "修改反馈" : "添加反馈"}
                  </label>
                  <textarea
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                    rows={4}
                    placeholder="输入作业反馈..."
                  />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-600">分数: </span>
                    <span className="font-medium">
                      {selectedAssignment.score > 0 ? selectedAssignment.score : "未评分"}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleGradeAssignment(selectedAssignment.id)}
                      disabled={isGrading}
                      className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB] disabled:opacity-50"
                    >
                      {isGrading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          批改中...
                        </>
                      ) : (
                        "AI批改"
                      )}
                    </button>
                    <button
                      onClick={() => handleCheckPlagiarism(selectedAssignment.id)}
                      disabled={isChecking}
                      className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB] disabled:opacity-50"
                    >
                      {isChecking ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          查重中...
                        </>
                      ) : (
                        "查重检测"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
