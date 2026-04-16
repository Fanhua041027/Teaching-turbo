import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import AIChat from "@/components/AIChat";

type Assignment = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: "pending" | "submitted" | "graded" | "late";
  score?: number;
  feedback?: string;
  answer?: string;
};

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Python基础练习",
    course: "Python编程入门",
    deadline: "2025-07-15",
    status: "graded",
    score: 85,
    feedback: "作业完成得很好，算法实现正确"
  },
  {
    id: "2",
    title: "机器学习项目",
    course: "机器学习基础",
    deadline: "2025-07-20",
    status: "submitted",
    answer: "我的项目解决方案..."
  },
  {
    id: "3",
    title: "Web开发作业",
    course: "前端开发",
    deadline: "2025-07-10",
    status: "late"
  }
];

const performanceData = [
  { name: "Python", score: 85 },
  { name: "算法", score: 78 },
  { name: "Web开发", score: 92 }
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "graded">("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [showAIChat, setShowAIChat] = useState(false);

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return assignment.status === "pending";
    if (activeTab === "graded") return assignment.status === "graded";
    return true;
  });

  const handleSubmitAnswer = (id: string) => {
    if (!answerInput.trim()) {
      toast.error("请先输入作业答案");
      return;
    }

    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status: "submitted", answer: answerInput } : a
    ));
    setAnswerInput("");
    setSelectedAssignment(null);
    toast.success("作业已提交");
  };

  const handleViewFeedback = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">作业中心</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md ${activeTab === "all" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              全部作业
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-md ${activeTab === "pending" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              待完成
            </button>
            <button
              onClick={() => setActiveTab("graded")}
              className={`px-4 py-2 rounded-md ${activeTab === "graded" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              已批改
            </button>
            <button
              onClick={toggleAIChat}
              className={`px-4 py-2 rounded-md ${showAIChat ? "bg-[#0A2463] text-white" : "bg-[#3E92CC] text-white"}`}
            >
              <i className="fa-solid fa-robot mr-2"></i>
              {showAIChat ? "隐藏AI助手" : "AI作业助手"}
            </button>
          </div>
        </div>

        {showAIChat && (
          <div className="mb-6 h-[400px]">
            <AIChat apiKey="mock-key-for-demo" />
          </div>
        )}

        {/* 学习表现图表 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">各科表现</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#3E92CC" name="分数" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 作业列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作业名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    课程
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    截止时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分数
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assignment, index) => (
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
                      {assignment.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          assignment.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : assignment.status === "late"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {assignment.status === "graded"
                          ? "已批改"
                          : assignment.status === "submitted"
                          ? "已提交"
                          : assignment.status === "late"
                          ? "已逾期"
                          : "待完成"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.score || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {assignment.status === "pending" && (
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="text-[#3E92CC] hover:text-[#2E86AB]"
                          >
                            <i className="fa-solid fa-paper-plane"></i>
                          </button>
                        )}
                        {assignment.status === "graded" && (
                          <button 
                            onClick={() => handleViewFeedback(assignment)}
                            className="text-[#3E92CC] hover:text-[#2E86AB]"
                          >
                            <i className="fa-solid fa-comment-dots"></i>
                          </button>
                        )}
                        <button className="text-[#3E92CC] hover:text-[#2E86AB]">
                          <i className="fa-solid fa-download"></i>
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

      {/* 作业提交/反馈弹窗 */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedAssignment.status === "graded" 
                  ? "作业反馈 - " + selectedAssignment.title 
                  : "提交作业 - " + selectedAssignment.title}
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-4">
              {selectedAssignment.status === "graded" ? (
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">你的分数: {selectedAssignment.score}</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-700">{selectedAssignment.feedback}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">你的答案:</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-700">{selectedAssignment.answer}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输入你的答案:
                    </label>
                    <textarea
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                      rows={8}
                      placeholder="在这里输入你的作业答案..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSubmitAnswer(selectedAssignment.id)}
                      className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
                    >
                      提交作业
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
