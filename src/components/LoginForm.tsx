import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/database";

type LoginRole = "admin" | "teacher" | "student";
type FormMode = "login" | "register";

export default function LoginForm() {
  const [role, setRole] = useState<LoginRole>("student");
  const [mode, setMode] = useState<FormMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("请输入邮箱和密码");
      return;
    }
    setIsLoading(true);
    
    try {
      // 1. 验证用户是否存在
      const user = await db.getUserByEmail(email);
      if (!user) {
        toast.error("该邮箱未注册");
        setIsLoading(false);
        return;
      }

      // 2. 验证密码是否正确
      if (user.password !== password) {
        toast.error("密码不正确");
        setIsLoading(false);
        return;
      }

      // 3. 验证角色是否匹配
      if (user.role !== role) {
        toast.error(`请使用${user.role}身份登录`);
        setIsLoading(false);
        return;
      }

      // 验证通过，执行登录
      toast.success("登录成功");
      // 如果是默认账号，提示修改密码
      if ((email === "admin@example.com" && password === "admin123") || 
          (email === "teacher1@example.com" && password === "teacher123")) {
        toast.info("请尽快修改默认密码", { duration: 5000 });
      }
      // 根据角色跳转到对应路由
      switch(role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
      }
    } catch (error) {
      console.error("登录错误:", error);
      toast.error("登录失败，请稍后再试");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast.error("请填写所有必填字段");
      return;
    }
    
    if (role !== "student") {
      toast.error("请联系管理员注册教师或管理员账号");
      return;
    }

    setIsLoading(true);
    try {
      // 创建新用户
      const newUser = await db.createUser({
        username,
        email,
        password,
        role: "student",
        status: "active"
      });
      
      toast.success("注册成功");
      setMode("login");
    } catch (error) {
      toast.error(`注册失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    admin: {
      title: "管理员登录",
      icon: "fa-shield-halved",
      bgColor: "bg-[#0A2463]",
      textColor: "text-[#0A2463]"
    },
    teacher: {
      title: "教师登录",
      icon: "fa-chalkboard-user",
      bgColor: "bg-[#2E86AB]",
      textColor: "text-[#2E86AB]"
    },
    student: {
      title: mode === "login" ? "学生登录" : "学生注册",
      icon: "fa-graduation-cap",
      bgColor: "bg-[#3E92CC]",
      textColor: "text-[#3E92CC]"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* 角色选择标签 */}
        <div className="flex mb-6 rounded-lg overflow-hidden shadow-sm">
          {(["admin", "teacher", "student"] as LoginRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 py-3 px-4 text-center font-medium transition-colors",
                role === r 
                  ? `${roleConfig[r].bgColor} text-white`
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              <i className={`fa-solid ${roleConfig[r].icon} mr-2`}></i>
              {roleConfig[r].title}
            </button>
          ))}
        </div>

        {/* 登录/注册表单 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${roleConfig[role].bgColor} p-4 text-white`}>
            <h2 className="text-xl font-bold flex items-center">
              <i className={`fa-solid ${roleConfig[role].icon} mr-3`}></i>
              {roleConfig[role].title}
            </h2>
          </div>
          
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC] bg-white text-gray-800"
                  placeholder="输入您的邮箱"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC] bg-white text-gray-800"
                  placeholder="输入您的密码"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-[#3E92CC] focus:ring-[#3E92CC] border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    记住我
                  </label>
                </div>
                <a href="#" className="text-sm text-[#3E92CC] hover:underline">
                  忘记密码?
                </a>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 ${roleConfig[role].bgColor} text-white rounded-md hover:opacity-90 disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              {role === "student" && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC] bg-white text-gray-800"
                    placeholder="输入您的用户名"
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC] bg-white text-gray-800"
                  placeholder="输入您的邮箱"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC] bg-white text-gray-800"
                  placeholder="输入您的密码"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 ${roleConfig[role].bgColor} text-white rounded-md hover:opacity-90 disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      注册中...
                    </>
                  ) : (
                    "注册"
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="px-6 py-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? "没有账号?" : "已有账号?"}{" "}
              {role === "student" ? (
                <button 
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="font-medium text-[#3E92CC] hover:underline cursor-pointer"
                >
                  {mode === "login" ? "学生注册" : "学生登录"}
                </button>
              ) : (
                <span>
                  请联系 <a href="mailto:2983876829@qq.com" className="font-medium text-[#3E92CC] hover:underline">2983876829@qq.com</a> 注册
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
