import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

type UserFormProps = {
  user?: User;
  onSave: (user: User) => void;
  onCancel: () => void;
};

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<User>(
    user || {
      name: "",
      email: "",
      role: "",
      status: "active",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("请填写所有必填字段");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        {user ? "编辑用户" : "新增用户"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱 *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色 *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
              required
            >
              <option value="">选择角色</option>
              <option value="admin">管理员</option>
              <option value="teacher">教师</option>
              <option value="student">学生</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
            >
              <option value="active">激活</option>
              <option value="inactive">禁用</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
