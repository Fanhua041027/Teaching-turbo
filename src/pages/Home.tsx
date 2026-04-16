import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0A2463] text-white overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      {showLogin ? (
        <LoginForm />
      ) : (
        <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AI教学实训平台</h1>
            <p className="text-lg md:text-xl opacity-90">
              基于开源AI大模型的智能教学解决方案，为教育机构提供全方位的教学管理、课程交付与学习体验优化。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {[
              { title: "管理员入口", path: "/admin", color: "bg-[#3E92CC]" },
              { title: "教师工作台", path: "/teacher", color: "bg-[#2E86AB]" },
              { title: "学生门户", path: "/student", color: "bg-[#1B9AAA]" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${item.color} rounded-xl shadow-lg p-8 cursor-pointer`}
                onClick={() => setShowLogin(true)}
              >
                <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                <p className="opacity-90">
                  {index === 0 && "管理系统配置与用户管理"}
                  {index === 1 && "课程管理与学情分析"}
                  {index === 2 && "沉浸式学习与代码实践"}
                </p>
              </motion.div>
            ))}
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
