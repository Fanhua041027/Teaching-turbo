import { useState } from "react";
import { generateMockFile, downloadFile } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

export default function StudentResources() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <i className="fa-solid fa-book text-[#3E92CC] mr-3"></i>
            教学资源中心
          </h1>
        </div>

        {selectedCategory ? (
          <div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mb-4 flex items-center text-[#3E92CC] hover:text-[#2E86AB]"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              返回资源分类
            </button>
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
            <h3 className="text-lg font-semibold mb-4">资源分类</h3>
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
      </div>
    </div>
  );
}