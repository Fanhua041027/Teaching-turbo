import { useState } from "react";
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock数据
const radarData = [
  { subject: '编程能力', A: 85, B: 65, fullMark: 100 },
  { subject: '算法理解', A: 78, B: 72, fullMark: 100 },
  { subject: '项目实践', A: 92, B: 68, fullMark: 100 },
  { subject: '学习速度', A: 76, B: 80, fullMark: 100 },
  { subject: '问题解决', A: 88, B: 75, fullMark: 100 },
];

const activityData = [
  { day: '周一', '8-10': 10, '10-12': 25, '12-14': 5, '14-16': 30, '16-18': 15 },
  { day: '周二', '8-10': 15, '10-12': 35, '12-14': 10, '14-16': 25, '16-18': 20 },
  { day: '周三', '8-10': 5, '10-12': 20, '12-14': 15, '14-16': 40, '16-18': 10 },
  { day: '周四', '8-10': 20, '10-12': 30, '12-14': 5, '14-16': 15, '16-18': 25 },
  { day: '周五', '8-10': 10, '10-12': 20, '12-14': 10, '14-16': 30, '16-18': 15 },
];

const students = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
];

const colors = ['#3E92CC', '#0A2463', '#2E86AB', '#1B9AAA', '#1864ab'];

export default function Dashboard() {
  const [selectedStudents, setSelectedStudents] = useState(['1', '2']);
  const [showFilter, setShowFilter] = useState(true);

  const toggleStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      if (selectedStudents.length > 1) {
        setSelectedStudents(selectedStudents.filter(s => s !== id));
      }
    } else {
      if (selectedStudents.length < 2) {
        setSelectedStudents([...selectedStudents, id]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">学情看板</h1>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
          >
            <i className={`fa-solid fa-${showFilter ? 'filter-circle-xmark' : 'filter'} mr-2`}></i>
            {showFilter ? '隐藏筛选' : '显示筛选'}
          </button>
        </div>

        {/* 筛选面板 */}
        {showFilter && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-4 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">学生对比</h3>
            <div className="flex flex-wrap gap-3">
              {students.map(student => (
                <button
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`px-4 py-2 rounded-md ${selectedStudents.includes(student.id) 
                    ? 'bg-[#3E92CC] text-white' 
                    : 'bg-gray-100 text-gray-700'}`}
                >
                  {student.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 雷达图 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-4 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">能力维度分析</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {selectedStudents.map((studentId, index) => (
                <Radar
                  key={studentId}
                  name={students.find(s => s.id === studentId)?.name}
                  dataKey={index === 0 ? 'A' : 'B'}
                  stroke={index === 0 ? '#3E92CC' : '#0A2463'}
                  fill={index === 0 ? '#3E92CC' : '#0A2463'}
                  fillOpacity={0.6}
                />
              ))}
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 学习行为图表 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <h3 className="text-lg font-semibold mb-4">学习行为分析</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              {['8-10', '10-12', '12-14', '14-16', '16-18'].map((hour, index) => (
                <Bar 
                  key={hour}
                  dataKey={hour}
                  name={hour}
                  fill={colors[index % colors.length]}
                >
                  {activityData.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={colors[index % colors.length]}
                      fillOpacity={0.7}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
