import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "用户管理", path: "/admin/users", icon: "fa-users" },
  { name: "课程管理", path: "/admin/courses", icon: "fa-book" },
  { name: "系统设置", path: "/admin/settings", icon: "fa-cog" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* 左侧菜单栏 */}
      <div
        className={cn(
          "bg-[#0A2463] text-white transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#3E92CC]/30">
          {!collapsed && <h1 className="text-xl font-bold">管理后台</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#3E92CC] hover:text-white"
          >
            <i className={`fa-solid fa-${collapsed ? "indent" : "outdent"}`}></i>
          </button>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="flex items-center p-3 rounded-lg hover:bg-[#3E92CC]/30 transition-colors"
                >
                  <i className={`fa-solid ${item.icon} mr-3`}></i>
                  {!collapsed && <span>{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
