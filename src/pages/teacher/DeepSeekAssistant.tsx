import { useState } from "react";
import { generateMockFile, downloadFile } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AIChat from "@/components/AIChat";

type Resource = {
  id: string;
  title: string;
  type: string;
  icon: string;
  description: string;
  fileType: string;
  size: string;
  downloadUrl: string;
};

const mockResources: Record<string, Resource[]> = {
  "Python教学课件": [
    {
      id: "py1",
      title: "Python基础语法",
      type: "课件",
      icon: "fa-file-powerpoint",
      description: "包含Python基础语法、数据类型和控制结构",
      fileType: "PDF",
      size: "2.4MB",
      downloadUrl: "#"
    },
    {
      id: "py2",
      title: "Python函数与模块",
      type: "课件",
      icon: "fa-file-powerpoint",
      description: "函数定义、参数传递和模块使用",
      fileType: "PDF",
      size: "1.8MB",
      downloadUrl: "#"
    }
  ],
  "机器学习案例": [
    {
      id: "ml1",
      title: "手写数字识别",
      type: "案例",
      icon: "fa-diagram-project",
      description: "使用KNN算法实现MNIST手写数字识别",
      fileType: "ZIP",
      size: "15MB",
      downloadUrl: "#"
    },
    {
      id: "ml2",
      title: "房价预测",
      type: "案例",
      icon: "fa-diagram-project",
      description: "线性回归在波士顿房价数据集上的应用",
      fileType: "ZIP",
      size: "8MB",
      downloadUrl: "#"
    }
  ],
  "Web开发模板": [
    {
      id: "web1",
      title: "React项目模板",
      type: "模板",
      icon: "fa-code",
      description: "基于React和Tailwind的现代Web应用模板",
      fileType: "ZIP",
      size: "5MB",
      downloadUrl: "#"
    },
    {
      id: "web2",
      title: "Flask REST API",
      type: "模板",
      icon: "fa-code",
      description: "使用Flask构建RESTful API的完整模板",
      fileType: "ZIP",
      size: "3MB",
      downloadUrl: "#"
    }
  ],
  "AI教学视频": [
    {
      id: "video1",
      title: "神经网络原理",
      type: "视频",
      icon: "fa-video",
      description: "深入讲解神经网络的工作原理和数学基础",
      fileType: "MP4",
      size: "256MB",
      downloadUrl: "#"
    },
    {
      id: "video2",
      title: "Pandas数据处理",
      type: "视频",
      icon: "fa-video",
      description: "使用Pandas进行数据清洗和分析的实战演示",
      fileType: "MP4",
      size: "180MB",
      downloadUrl: "#"
    }
  ],
  "课堂练习集": [
    {
      id: "ex1",
      title: "Python基础练习",
      type: "练习",
      icon: "fa-pen-to-square",
      description: "50道Python基础语法练习题",
      fileType: "PDF",
      size: "1.2MB",
      downloadUrl: "#"
    },
    {
      id: "ex2",
      title: "算法练习题",
      type: "练习",
      icon: "fa-pen-to-square",
      description: "常见算法和数据结构的编程练习",
      fileType: "PDF",
      size: "2MB",
      downloadUrl: "#"
    }
  ],
  "考试题库": [
    {
      id: "exam1",
      title: "Python期末考试",
      type: "试题",
      icon: "fa-clipboard-question",
      description: "2025年Python编程期末考试题库",
      fileType: "PDF",
      size: "3MB",
      downloadUrl: "#"
    },
    {
      id: "exam2",
      title: "机器学习期中考试",
      type: "试题",
      icon: "fa-clipboard-question",
      description: "机器学习课程期中考试样题",
      fileType: "PDF",
      size: "2.5MB",
      downloadUrl: "#"
    }
  ]
};

export default function DeepSeekAssistant() {
  const [activeTab, setActiveTab] = useState<"chat" | "resources">("chat");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "课件",
    category: "Python教学课件"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newResource.name) {
      toast.error("请选择文件并填写资源名称");
      return;
    }

    setUploading(true);
    try {
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${selectedFile.name} 上传成功`);
      setSelectedFile(null);
      setNewResource({
        name: "",
        type: "课件",
        category: "Python教学课件"
      });
    } catch (error) {
      toast.error(`上传失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <i className="fa-solid fa-robot text-[#3E92CC] mr-3"></i>
            DeepSeek教学助手
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-md ${activeTab === "chat" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              <i className="fa-solid fa-comments mr-2"></i>
              智能对话
            </button>
            <button
              onClick={() => {
                setActiveTab("resources");
                setSelectedCategory(null);
              }}
              className={`px-4 py-2 rounded-md ${activeTab === "resources" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              <i className="fa-solid fa-book mr-2"></i>
              教学资源
            </button>
          </div>
        </div>

        {activeTab === "chat" ? (
          <div className="bg-white rounded-lg shadow-md p-4 h-[600px]">
            <AIChat apiKey="mock-key-for-deepseek" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {selectedCategory ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center text-[#3E92CC] hover:text-[#2E86AB]"
                  >
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    返回资源分类
                  </button>
                  <button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="px-3 py-1 bg-[#3E92CC] text-white rounded-md text-sm hover:bg-[#2E86AB]"
                  >
                    <i className="fa-solid fa-upload mr-1"></i>
                    上传资源
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">{selectedCategory}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockResources[selectedCategory].map((resource) => (
                    <motion.div
                      key={resource.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start">
                        <i className={`fa-solid ${resource.icon} text-2xl text-[#3E92CC] mr-3 mt-1`}></i>
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">{resource.description}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{resource.fileType} • {resource.size}</span>
                            <button 
                              onClick={async () => {
                                try {
                                  const mockFile = generateMockFile(resource.fileType, parseInt(resource.size));
                                  const success = await downloadFile(mockFile.url, `${resource.title}.${mockFile.filename.split('.')[1]}`);
                                  if (!success) {
                                    toast.error('下载失败，请重试');
                                  }
                                } catch (error) {
                                  toast.error('下载过程中发生错误');
                                }
                              }}
                              className="text-[#3E92CC] hover:text-[#2E86AB] flex items-center"
                            >
                              <i className="fa-solid fa-download mr-1"></i>
                              下载
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">教学资源库</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.keys(mockResources).map((category) => (
                    <motion.div
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCategory(category)}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <i className={`fa-solid ${mockResources[category][0].icon} text-2xl text-[#3E92CC] mr-3`}></i>
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-gray-500">
                            {mockResources[category].length}个资源
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* 上传资源弹窗 */}
            {(selectedFile || uploading) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                >
                  <h3 className="text-lg font-semibold mb-4">上传教学资源</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        资源名称 *
                      </label>
                      <input
                        type="text"
                        value={newResource.name}
                        onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="输入资源名称"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        资源类型 *
                      </label>
                      <select
                        value={newResource.type}
                        onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="课件">课件</option>
                        <option value="案例">案例</option>
                        <option value="模板">模板</option>
                        <option value="视频">视频</option>
                        <option value="练习">练习</option>
                        <option value="试题">试题</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        资源分类 *
                      </label>
                      <select
                        value={newResource.category}
                        onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {Object.keys(mockResources).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                      {selectedFile ? (
                        <div className="flex items-center justify-between">
                          <span className="truncate max-w-xs">{selectedFile.name}</span>
                          <button 
                            onClick={() => setSelectedFile(null)}
                            className="text-red-500 ml-2"
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center">
                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-[#3E92CC] mb-2"></i>
                            <p className="text-sm text-gray-600">点击或拖拽文件到此处</p>
                            <p className="text-xs text-gray-500 mt-1">支持PDF, PPT, DOC, MP4等格式</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setUploading(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile || !newResource.name}
                      className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB] disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          上传中...
                        </>
                      ) : (
                        "确认上传"
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
