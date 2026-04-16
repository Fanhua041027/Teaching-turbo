import { useState } from "react";
import { cn } from "@/lib/utils";

type Permission = {
  id: string;
  name: string;
  checked: boolean;
};

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type RolePermissionModalProps = {
  role: Role;
  onSave: (permissions: string[]) => void;
  onClose: () => void;
};

export default function RolePermissionModal({
  role,
  onSave,
  onClose,
}: RolePermissionModalProps) {
  const [permissions, setPermissions] = useState<Permission[]>(
    role.permissions.map((p) => ({ ...p }))
  );

  const handlePermissionChange = (id: string, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked } : p))
    );
  };

  const handleSave = () => {
    const selectedPermissions = permissions
      .filter((p) => p.checked)
      .map((p) => p.id);
    onSave(selectedPermissions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">分配权限 - {role.name}</h3>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`perm-${permission.id}`}
                  checked={permission.checked}
                  onChange={(e) =>
                    handlePermissionChange(permission.id, e.target.checked)
                  }
                  className="h-4 w-4 text-[#3E92CC] focus:ring-[#3E92CC] border-gray-300 rounded"
                />
                <label
                  htmlFor={`perm-${permission.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
