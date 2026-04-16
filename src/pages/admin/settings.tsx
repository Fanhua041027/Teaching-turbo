import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

type SystemSetting = {
  id: string;
  name: string;
  value: string;
  type: "text" | "number" | "boolean" | "select";
  options?: string[];
};

type PermissionSetting = {
  id: string;
  name: string;
  description: string;
  roles: {
    admin: boolean;
    teacher: boolean;
    student: boolean;
  };
};

type UserActivity = {
  date: string;
  activeUsers: number;
  newUsers: number;
};

const mockSettings: SystemSetting[] = [
  {
    id: "1",
    name: "系统名称",
    value: "AI教学平台",
    type: "text"
  },
  {
    id: "2",
    name: "注册开放",
    value: "true",
    type: "boolean"
  },
  {
    id: "3",
    name: "默认角色",
    value: "student",
    type: "select",
    options: ["student", "teacher", "admin"]
  },
  {
    id: "4",
    name: "最大文件上传(MB)",
    value: "50",
    type: "number"
  },
  {
    id: "5",
    name: "网站主题色",
    value: "#3E92CC",
    type: "text"
  },
  {
    id: "6",
    name: "启用AI批改",
    value: "true",
    type: "boolean"
  }
];

const mockPermissions: PermissionSetting[] = [
  {
    id: "p1",
    name: "用户管理",
    description: "创建、编辑和删除用户账户",
    roles: {
      admin: true,
      teacher: false,
      student: false
    }
  },
  {
    id: "p2",
    name: "课程管理",
    description: "创建和编辑课程内容",
    roles: {
      admin: true,
      teacher: true,
      student: false
    }
  },
  {
    id: "p3",
    name: "作业批改",
    description: "批改学生作业和提供反馈",
    roles: {
      admin: false,
      teacher: true,
      student: false
    }
  },
  {
    id: "p4",
    name: "学习数据查看",
    description: "查看学习进度和成绩",
    roles: {
      admin: true,
      teacher: true,
      student: true
    }
  }
];

const mockActivityData: UserActivity[] = [
  { date: "2025-07-01", activeUsers: 120, newUsers: 15 },
  { date: "2025-07-02", activeUsers: 135, newUsers: 18 },
  { date: "2025-07-03", activeUsers: 150, newUsers: 22 },
  { date: "2025-07-04", activeUsers: 145, newUsers: 20 },
  { date: "2025-07-05", activeUsers: 160, newUsers: 25 },
  { date: "2025-07-06", activeUsers: 175, newUsers: 30 },
  { date: "2025-07-07", activeUsers: 180, newUsers: 28 }
];

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>(mockSettings);
  const [permissions, setPermissions] = useState<PermissionSetting[]>(mockPermissions);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
  const [showActivityStats, setShowActivityStats] = useState(true);
  const [activeTab, setActiveTab] = useState<"settings" | "permissions">("settings");

  const handleEditSetting = (setting: SystemSetting) => {
    setEditingSetting(setting);
  };

  const handleSaveSetting = (newValue: string) => {
    if (!editingSetting) return;
    
    setSettings(settings.map(s => 
      s.id === editingSetting.id ? { ...s, value: newValue } : s
    ));
    setEditingSetting(null);
    toast.success("设置已更新");
  };

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, value: s.value === "true" ? "false" : "true" } : s
    ));
    toast.success("设置已更新");
  };

  const handlePermissionChange = (id: string, role: keyof PermissionSetting['roles'], value: boolean) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, roles: { ...p.roles, [role]: value } } : p
    ));
    toast.success("权限已更新");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">系统设置</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-md ${activeTab === "settings" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              系统参数
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-4 py-2 rounded-md ${activeTab === "permissions" ? "bg-[#3E92CC] text-white" : "bg-gray-100"}`}
            >
              权限配置
            </button>
            <button
              onClick={() => setShowActivityStats(!showActivityStats)}
              className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
            >
              {showActivityStats ? "隐藏统计" : "显示统计"}
            </button>
          </div>
        </div>

        {/* 用户活跃度图表 */}
        {showActivityStats && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-4 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">用户活跃度</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={mockActivityData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stackId="1"
                  stroke="#3E92CC"
                  fill="#3E92CC"
                  name="活跃用户"
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  stackId="2"
                  stroke="#0A2463"
                  fill="#0A2463"
                  name="新增用户"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === "settings" ? (
          /* 系统设置列表 */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      设置项
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      当前值
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {settings.map((setting, index) => (
                    <motion.tr
                      key={setting.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {setting.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {setting.type === "boolean" ? (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              setting.value === "true"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {setting.value === "true" ? "是" : "否"}
                          </span>
                        ) : (
                          setting.value
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          {setting.type === "boolean" ? (
                            <button
                              onClick={() => toggleSetting(setting.id)}
                              className="text-[#3E92CC] hover:text-[#2E86AB]"
                            >
                              <i className="fa-solid fa-toggle-on"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditSetting(setting)}
                              className="text-[#3E92CC] hover:text-[#2E86AB]"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* 权限配置列表 */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      权限名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      管理员
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      教师
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      学生
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => (
                    <motion.tr
                      key={permission.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {permission.description}
                      </td>
                      {(['admin', 'teacher', 'student'] as const).map(role => (
                        <td key={role} className="px-6 py-4 whitespace-nowrap text-sm">
                          <input
                            type="checkbox"
                            checked={permission.roles[role]}
                            onChange={(e) => handlePermissionChange(permission.id, role, e.target.checked)}
                            className="h-4 w-4 text-[#3E92CC] focus:ring-[#3E92CC] border-gray-300 rounded"
                          />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 设置编辑弹窗 */}
      {editingSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">编辑设置 - {editingSetting.name}</h3>
            </div>
            <div className="p-4">
              {editingSetting.type === "text" && (
                <input
                  type="text"
                  value={editingSetting.value}
                  onChange={(e) => setEditingSetting({...editingSetting, value: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                />
              )}
              {editingSetting.type === "number" && (
                <input
                  type="number"
                  value={editingSetting.value}
                  onChange={(e) => setEditingSetting({...editingSetting, value: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                />
              )}
              {editingSetting.type === "select" && editingSetting.options && (
                <select
                  value={editingSetting.value}
                  onChange={(e) => setEditingSetting({...editingSetting, value: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
                >
                  {editingSetting.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingSetting(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => handleSaveSetting(editingSetting.value)}
                  className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
                >
                  保存
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
