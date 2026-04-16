import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AIChat from "@/components/AIChat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { db } from "@/lib/database";
import { toast } from "sonner";

type Conversation = {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 加载用户的历史对话
    const loadConversations = async () => {
      const convs = await db.getConversationsByUser("current-user");
      setConversations(convs);
    };
    loadConversations();
  }, []);

  const handleNewConversation = async () => {
    try {
      const newConversation = await db.createConversation("current-user", "新对话");
      setConversations([...conversations, newConversation]);
      setSelectedConversation(newConversation.id);
      toast.success("已创建新对话");
    } catch (error) {
      toast.error("创建对话失败");
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };

  const handleDeleteConversation = async (id: string) => {
    await db.deleteConversation(id);
    setConversations(convs => convs.filter(c => c.id !== id));
    if (selectedConversation === id) {
      setSelectedConversation(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* 历史对话侧边栏 */}
      <div className="w-64 border-r border-gray-200 bg-white p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">历史对话</h2>
          <motion.button
            onClick={handleNewConversation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
          >
            <i className="fa-solid fa-plus"></i>
          </motion.button>
        </div>
        <div className="space-y-2">
          {conversations.map(conversation => (
            <motion.div
              key={conversation.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer ${selectedConversation === conversation.id ? 'bg-[#3E92CC]/10' : 'hover:bg-gray-100'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium truncate">{conversation.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(conversation.updatedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conversation.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 聊天主界面 */}
      <div className="flex-1">
        <AIChat 
          apiKey="mock-key-for-demo" 
          conversationId={selectedConversation || undefined}
          onNewConversation={(id) => {
            setSelectedConversation(id);
            // 重新加载对话列表
            db.getConversationsByUser("current-user").then(convs => {
              setConversations(convs);
            });
          }}
        />
      </div>
    </div>
  );
}