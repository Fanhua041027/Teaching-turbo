import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center mb-6">
          <i className="fa-solid fa-chart-line text-2xl text-[#3E92CC] mr-3"></i>
          <h1 className="text-2xl font-bold">管理控制台</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { title: "用户总数", value: "256", icon: "fa-users", color: "bg-blue-100 text-blue-800" },
            { title: "活跃课程", value: "18", icon: "fa-book", color: "bg-green-100 text-green-800" },
            { title: "系统状态", value: "正常", icon: "fa-server", color: "bg-purple-100 text-purple-800" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <span className={cn("p-2 rounded-full mr-3", item.color)}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </span>
                <div>
                  <h3 className="text-sm text-gray-500">{item.title}</h3>
                  <p className="text-xl font-semibold">{item.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">快速开始</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "添加用户", icon: "fa-user-plus", path: "/admin/users" },
              { title: "创建课程", icon: "fa-book-medical", path: "/admin/courses" },
              { title: "系统设置", icon: "fa-cog", path: "/admin/settings" },
              { title: "查看报表", icon: "fa-chart-pie", path: "/admin/dashboard" }
            ].map((item, index) => (
              <motion.a
                key={index}
                whileHover={{ scale: 1.05 }}
                href={item.path}
                className="p-3 bg-white border rounded-lg flex items-center hover:bg-gray-100"
              >
                <i className={`fa-solid ${item.icon} text-[#3E92CC] mr-3`}></i>
                <span>{item.title}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}