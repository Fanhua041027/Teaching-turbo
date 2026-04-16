import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

// 在实际项目中，这些数据会通过API从后端获取
// 例如：const response = await fetch('/api/learning-path');
// const pathData = await response.json();

type Resource = {
  id: string;
  title: string;
  type: "video" | "article" | "exercise" | "document";
  url: string;
  completed: boolean;
  duration?: number;
  pages?: number;
  lastAccessed?: Date;
  timeSpent?: number;
};

type KnowledgeNode = {
  id: string;
  name: string;
  level: "basic" | "intermediate" | "advanced";
  connections: string[];
  description?: string;
  masteryLevel?: number;
};

type Milestone = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  resources: Resource[];
  knowledgeNodes: KnowledgeNode[];
  estimatedHours?: number;
};

const mockPath: Milestone[] = [
  {
    id: "1",
    title: "Python基础",
    description: "掌握Python基本语法和数据结构",
    status: "completed",
    progress: 100,
    estimatedHours: 10,
    knowledgeNodes: [
      {
        id: "py-basic",
        name: "Python语法",
        level: "basic",
        connections: ["py-data", "py-func"],
        description: "变量、运算符、控制结构等基础语法",
        masteryLevel: 90
      },
      {
        id: "py-data",
        name: "数据类型",
        level: "basic",
        connections: ["py-basic", "py-func"],
        description: "列表、字典、元组等数据结构",
        masteryLevel: 85
      }
    ],
    resources: [
      {
        id: "1-1",
        title: "Python入门视频",
        type: "video",
        url: "https://example.com/videos/python-intro",
        completed: true,
        duration: 45,
        timeSpent: 50,
        lastAccessed: new Date("2025-06-15")
      },
      {
        id: "1-2",
        title: "Python基础文档",
        type: "document",
        url: "https://example.com/docs/python-basics",
        completed: true,
        pages: 12,
        timeSpent: 30,
        lastAccessed: new Date("2025-06-18")
      }
    ]
  },
  // ... 其他里程碑数据保持不变
];

// 学习时间统计mock数据
const weeklyStudyData = [
  { day: '周一', hours: 2.5 },
  { day: '周二', hours: 3.2 },
  { day: '周三', hours: 1.8 },
  { day: '周四', hours: 2.7 },
  { day: '周五', hours: 2.0 },
  { day: '周六', hours: 4.5 },
  { day: '周日', hours: 1.0 }
];

const COLORS = ['#3E92CC', '#0A2463', '#2E86AB', '#1B9AAA', '#1864ab'];

const ResourceViewer = ({ resource }: { resource: Resource }) => {
  const [isViewing, setIsViewing] = useState(false);
  const [timeSpent, setTimeSpent] = useState(resource.timeSpent || 0);

  const renderResourceContent = () => {
    switch (resource.type) {
      case "video":
        return (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              controls
              className="w-full h-full"
              onPlay={() => setIsViewing(true)}
              onPause={() => setIsViewing(false)}
              onEnded={() => setIsViewing(false)}
            >
              <source src={resource.url} type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
          </div>
        );
      case "document":
        return (
          <div className="w-full h-full">
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.url)}&embedded=true`}
              className="w-full h-full min-h-[500px] border rounded-lg"
              frameBorder="0"
            />
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">资源类型: {resource.type}</p>
            <a href={resource.url} className="text-[#3E92CC] hover:underline">
              查看资源
            </a>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{resource.title}</h4>
        <div className="flex items-center space-x-2">
          {resource.type === "video" && (
            <span className="text-sm text-gray-500">
              {timeSpent}/{resource.duration}分钟
            </span>
          )}
          <button
            onClick={() => setIsViewing(!isViewing)}
            className="px-3 py-1 bg-[#3E92CC] text-white rounded-md text-sm"
          >
            {isViewing ? "关闭" : "查看"}
          </button>
        </div>
      </div>
      {isViewing && renderResourceContent()}
    </div>
  );
};

const KnowledgeGraph = ({ nodes }: { nodes: KnowledgeNode[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 600;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // 清除现有内容
    svg.selectAll("*").remove();

    // 创建模拟数据
    const simulation = d3.forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink().id((d: any) => d.id));

    // 绘制连接线
    const links = nodes.flatMap(node => 
      node.connections.map(target => ({ source: node.id, target }))
    );

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1);

    // 绘制节点
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => {
        if (d.level === "basic") return 15;
        if (d.level === "intermediate") return 20;
        return 25;
      })
      .attr("fill", d => {
        if (d.level === "basic") return "#3E92CC";
        if (d.level === "intermediate") return "#0A2463";
        return "#2E86AB";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d) => setSelectedNode(d))
      .call(d3.drag() as any);

    // 添加节点标签
    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("dy", -20)
      .attr("text-anchor", "middle")
      .text(d => d.name)
      .attr("fill", "#333")
      .attr("font-size", "12px");

    // 更新模拟
    simulation.nodes(nodes as any).on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 h-[500px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
      {selectedNode && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium">{selectedNode.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{selectedNode.description}</p>
          <div className="mt-2">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">掌握程度:</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-[#3E92CC]" 
                  style={{ width: `${selectedNode.masteryLevel || 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium ml-2">
                {selectedNode.masteryLevel || 0}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressTracker = ({ milestone }: { milestone: Milestone }) => {
  const calculateTimeStats = () => {
    const totalTime = milestone.resources.reduce(
      (sum, r) => sum + (r.timeSpent || 0), 0
    );
    const estimatedTime = milestone.estimatedHours || 0;
    const progressPercentage = estimatedTime > 0 
      ? Math.min(100, (totalTime / (estimatedTime * 60)) * 100)
      : 0;

    return { totalTime, estimatedTime, progressPercentage };
  };

  const { totalTime, estimatedTime, progressPercentage } = calculateTimeStats();

  // 资源完成情况数据
  const resourceData = [
    { name: '已完成', value: milestone.resources.filter(r => r.completed).length },
    { name: '未完成', value: milestone.resources.filter(r => !r.completed).length }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">学习进度</h4>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3E92CC"
                strokeWidth="3"
                strokeDasharray={`${milestone.progress}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              {milestone.progress}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              完成度: {milestone.progress}%
            </p>
            <p className="text-sm text-gray-600">
              已学习: {totalTime}分钟 / 预计: {estimatedTime}小时
            </p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">时间投入</h4>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-[#0A2463]" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          已投入 {progressPercentage.toFixed(1)}% 的预计时间
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">资源完成情况</h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {resourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const KnowledgeMasteryChart = ({ nodes }: { nodes: KnowledgeNode[] }) => {
  const radarData = nodes.map(node => ({
    subject: node.name,
    A: node.masteryLevel || 0,
    fullMark: 100
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-medium mb-2">知识点掌握度</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="掌握度"
              dataKey="A"
              stroke="#3E92CC"
              fill="#3E92CC"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StudyTimeChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-medium mb-2">每周学习时间分布</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyStudyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#3E92CC" name="学习时间(小时)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function LearningPath() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [path, setPath] = useState<Milestone[]>(mockPath);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [activeTab, setActiveTab] = useState<"resources" | "knowledge" | "stats">("resources");

  const handleResourceComplete = (milestoneId: string, resourceId: string) => {
    setPath(path.map(m => {
      if (m.id !== milestoneId) return m;
      
      const updatedResources = m.resources.map(r => 
        r.id === resourceId ? { 
          ...r, 
          completed: !r.completed,
          lastAccessed: new Date(),
          timeSpent: (r.timeSpent || 0) + (r.duration || 10)
        } : r
      );
      
      const completedCount = updatedResources.filter(r => r.completed).length;
      const progress = Math.round((completedCount / m.resources.length) * 100);
      const status = progress === 100 ? "completed" : 
                    progress > 0 ? "in-progress" : "pending";
      
      return {
        ...m,
        resources: updatedResources,
        progress,
        status
      };
    }));
    
    toast.success("学习资源状态已更新");
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* 左侧学习路径概览 */}
      <div className="w-64 border-r border-gray-200 bg-white p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">学习路径</h2>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="p-2 text-[#3E92CC] hover:bg-[#3E92CC]/10 rounded-full"
          >
            <i className={`fa-solid fa-${showRecommendations ? 'check' : 'lightbulb'}`}></i>
          </button>
        </div>
        
        {showRecommendations && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-[#3E92CC]/10 p-3 rounded-lg mb-4"
          >
            <h4 className="text-sm font-medium mb-2">学习建议</h4>
            <ul className="text-xs space-y-1">
              <li>• 每天学习1-2小时效果最佳</li>
              <li>• 先完成基础知识点再学习进阶内容</li>
              <li>• 定期复习已学内容</li>
            </ul>
          </motion.div>
        )}
        <div className="space-y-4">
          {path.map(milestone => (
            <motion.div
              key={milestone.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMilestone(milestone)}
              className={`p-3 border rounded-lg cursor-pointer ${
                selectedMilestone?.id === milestone.id 
                  ? 'border-[#3E92CC] bg-[#3E92CC]/10' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{milestone.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  milestone.status === "completed" ? "bg-green-100 text-green-800" :
                  milestone.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {milestone.status === "completed" ? "已完成" : 
                   milestone.status === "in-progress" ? "进行中" : "未开始"}
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      milestone.status === "completed" ? "bg-green-500" :
                      milestone.status === "in-progress" ? "bg-blue-500" :
                      "bg-gray-300"
                    }`} 
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {milestone.progress}% 完成
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 右侧里程碑详情 */}
      <div className="flex-1 overflow-auto p-6">
        {selectedMilestone ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedMilestone.title}</h2>
                <p className="text-gray-600 mt-2">{selectedMilestone.description}</p>
              </div>
              <ProgressTracker milestone={selectedMilestone} />
            </div>

            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`pb-2 px-1 border-b-2 ${
                    activeTab === "resources"
                      ? "border-[#3E92CC] text-[#3E92CC]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  学习资源
                </button>
                <button
                  onClick={() => setActiveTab("knowledge")}
                  className={`pb-2 px-1 border-b-2 ${
                    activeTab === "knowledge"
                      ? "border-[#3E92CC] text-[#3E92CC]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  知识图谱
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`pb-2 px-1 border-b-2 ${
                    activeTab === "stats"
                      ? "border-[#3E92CC] text-[#3E92CC]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  学习统计
                </button>
              </div>
            </div>

            {activeTab === "resources" ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">学习资源</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedMilestone.resources.map(resource => (
                    <div key={resource.id} className="border rounded-lg p-4">
                      <ResourceViewer resource={resource} />
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          上次访问: {resource.lastAccessed?.toLocaleDateString() || "未访问"}
                        </span>
                        <button
                          onClick={() => handleResourceComplete(selectedMilestone.id, resource.id)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            resource.completed 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {resource.completed ? "已完成" : "标记完成"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "knowledge" ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">知识图谱</h3>
                <KnowledgeGraph nodes={selectedMilestone.knowledgeNodes} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <KnowledgeMasteryChart nodes={selectedMilestone.knowledgeNodes} />
                  <StudyTimeChart />
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <i className="fa-solid fa-map text-5xl mb-4"></i>
              <p>选择学习里程碑查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}