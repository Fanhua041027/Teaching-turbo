import { useState } from "react";
import Breadcrumb from "@/components/admin/Breadcrumb";
import UserForm from "@/components/admin/UserForm";
import RolePermissionModal from "@/components/admin/RolePermissionModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

type Role = {
  id: string;
  name: string;
  permissions: {
    id: string;
    name: string;
    checked: boolean;
  }[];
};

const mockUsers: User[] = [
  { id: "1", name: "张三", email: "zhangsan@example.com", role: "admin", status: "active" },
  { id: "2", name: "李四", email: "lisi@example.com", role: "teacher", status: "active" },
  { id: "3", name: "王五", email: "wangwu@example.com", role: "student", status: "inactive" },
];

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "管理员",
    permissions: [
      { id: "user_manage", name: "用户管理", checked: true },
      { id: "course_manage", name: "课程管理", checked: true },
      { id: "system_setting", name: "系统设置", checked: true },
    ],
  },
  {
    id: "teacher",
    name: "教师",
    permissions: [
      { id: "course_manage", name: "课程管理", checked: true },
      { id: "student_manage", name: "学生管理", checked: true },
      { id: "homework_review", name: "作业批改", checked: true },
    ],
  },
  {
    id: "student",
    name: "学生",
    permissions: [
      { id: "course_view", name: "课程查看", checked: true },
      { id: "homework_submit", name: "作业提交", checked: true },
    ],
  },
];

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    toast.success("用户删除成功");
  };

  const handleSaveUser = (user: User) => {
    if (currentUser) {
      // 更新用户
      setUsers(users.map((u) => (u.id === currentUser.id ? { ...user, id: currentUser.id } : u)));
      toast.success("用户更新成功");
    } else {
      // 新增用户
      const newUser = { ...user, id: Date.now().toString() };
      setUsers([...users, newUser]);
      toast.success("用户添加成功");
    }
    setShowForm(false);
  };

  const handleAssignRole = (user: User) => {
    const role = mockRoles.find((r) => r.id === user.role);
    if (role) {
      setSelectedRole(JSON.parse(JSON.stringify(role)));
      setCurrentUser(user);
      setShowRoleModal(true);
    }
  };

  const handleSavePermissions = (permissionIds: string[]) => {
    toast.success("权限分配成功");
    setShowRoleModal(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 模拟导入逻辑
      setTimeout(() => {
        toast.success(`成功导入文件: ${file.name}`);
        e.target.value = ""; // 重置文件输入
      }, 1000);
    }
  };

  const handleExport = () => {
    toast.success("导出用户数据成功");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Breadcrumb />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">用户管理</h1>
          <div className="flex space-x-3">
            <label className="px-4 py-2 bg-white border border-[#3E92CC] text-[#3E92CC] rounded-md hover:bg-[#3E92CC]/10 cursor-pointer">
              <input type="file" className="hidden" onChange={handleImport} />
              <i className="fa-solid fa-upload mr-2"></i>
              导入
            </label>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-[#3E92CC] text-[#3E92CC] rounded-md hover:bg-[#3E92CC]/10"
            >
              <i className="fa-solid fa-download mr-2"></i>
              导出
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              新增用户
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <UserForm
              user={currentUser}
              onSave={handleSaveUser}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={cn(index % 2 === 0 ? "bg-white" : "bg-gray-50", "hover:bg-gray-100")}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mockRoles.find((r) => r.id === user.role)?.name || user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {user.status === "active" ? "激活" : "禁用"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleAssignRole(user)}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-user-shield"></i>
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-[#3E92CC] hover:text-[#2E86AB]"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showRoleModal && selectedRole && (
        <RolePermissionModal
          role={selectedRole}
          onSave={handleSavePermissions}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </div>
  );
}
