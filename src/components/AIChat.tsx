import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { db } from "@/lib/database";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  conversationId?: string;
};

export default function AIChat({ 
  apiKey, 
  conversationId,
  onNewConversation
}: { 
  apiKey: string;
  conversationId?: string;
  onNewConversation?: (id: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 如果是新对话且没有conversationId，则创建新对话
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const newConversation = await db.createConversation("current-user", input.substring(0, 30));
      currentConversationId = newConversation.id;
      if (onNewConversation) onNewConversation(newConversation.id);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      conversationId: currentConversationId
    };
    
    await db.createMessage(currentConversationId!, input, "user");

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 调用DeepSeek API (流式)
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer sk-5efb88e60a034999ba3a1cafa13e5c82`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "你是一个AI教学助手，帮助老师和学生解决教学相关问题。",
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: input,
            },
          ],
          temperature: 0.7,
          stream: true, // 启用流式响应
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      // 创建临时AI消息
      const tempMessageId = Date.now().toString();
      const tempMessage: Message = {
        id: tempMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        conversationId: currentConversationId
      };
      setMessages((prev) => [...prev, tempMessage]);

      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取响应流");

      let fullContent = "";
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data:') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.substring(5));
              if (data.choices?.[0]?.delta?.content) {
                fullContent += data.choices[0].delta.content;
                // 更新消息内容
                setMessages(prev => prev.map(msg => 
                  msg.id === tempMessageId 
                    ? { ...msg, content: fullContent } 
                    : msg
                ));
              }
            } catch (e) {
              console.error("解析流数据失败:", e);
            }
          }
        }
      }

      // 流结束后保存完整消息
      await db.createMessage(currentConversationId!, fullContent, "assistant");
      
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      toast.error(`请求失败: ${error instanceof Error ? error.message : String(error)}`);
      
      // 添加一条错误提示消息
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "抱歉，我暂时无法回答这个问题。请稍后再试或检查网络连接。",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="p-4 bg-gradient-to-r from-[#0A2463] to-[#3E92CC] text-white">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fa-solid fa-robot mr-2"></i>
          DeepSeek教学助手
        </h3>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <i className="fa-solid fa-comments text-5xl mb-4 text-[#3E92CC]"></i>
            <p className="text-lg font-medium mb-1">AI学习助手</p>
            <p className="text-sm max-w-md text-center">
              我是您的AI学习助手，可以解答课程问题、帮助完成作业、提供学习建议
            </p>
          </motion.div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3E92CC] text-white flex items-center justify-center">
                  <i className="fa-solid fa-robot text-sm"></i>
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl p-4 shadow-sm",
                  message.role === "user"
                    ? "bg-[#3E92CC] text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                )}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className="text-xs opacity-70 mt-2 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0A2463] text-white flex items-center justify-center">
                  <i className="fa-solid fa-user text-sm"></i>
                </div>
              )}
            </motion.div>
          ))
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start items-start gap-2"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3E92CC] text-white flex items-center justify-center">
              <i className="fa-solid fa-robot text-sm"></i>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none p-3 max-w-[80%] shadow-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-[#3E92CC] animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[#3E92CC] animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-[#3E92CC] animate-pulse delay-150"></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="输入您的问题..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3E92CC] focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-[#0A2463] to-[#3E92CC] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          由DeepSeek AI提供支持
        </p>
      </div>
    </div>
  );
}
