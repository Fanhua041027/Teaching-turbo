import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TeacherHome() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center mb-6">
          <i className="fa-solid fa-chalkboard-user text-2xl text-[#3E92CC] mr-3"></i>
          <h1 className="text-2xl font-bold">教学工作台</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { title: "待批改作业", value: "12", icon: "fa-file-edit", color: "bg-yellow-100 text-yellow-800" },
            { title: "进行中课程", value: "5", icon: "fa-book-open", color: "bg-blue-100 text-blue-800" },
            { title: "学生总数", value: "48", icon: "fa-users", color: "bg-green-100 text-green-800" }
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
          <h3 className="text-lg font-semibold mb-4">常用功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "批改作业", icon: "fa-check-double", path: "/teacher/assignments" },
              { title: "课程管理", icon: "fa-book", path: "/teacher/courses" },
              { title: "学情分析", icon: "fa-chart-bar", path: "/teacher/dashboard" },
              { title: "发布通知", icon: "fa-bullhorn", path: "/teacher/announcements" }
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