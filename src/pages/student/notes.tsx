import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

const mockNotes: Note[] = [
  {
    id: "1",
    title: "React Hooks 使用指南",
    content: "## React Hooks\n\nHooks是React 16.8新增的特性，让你在不编写class的情况下使用state和其他React特性。\n\n### 常用Hooks\n- useState\n- useEffect\n- useContext\n- useReducer\n\n```js\n// 示例代码\nconst [count, setCount] = useState(0);\n```",
    tags: ["React", "前端"],
    createdAt: "2025-06-01",
    updatedAt: "2025-06-05"
  },
  {
    id: "2",
    title: "Python数据处理技巧",
    content: "## Pandas数据处理\n\nPandas是Python中强大的数据分析工具。\n\n### 常用操作\n- 数据读取\n- 数据清洗\n- 数据聚合\n\n```python\nimport pandas as pd\n\ndf = pd.read_csv('data.csv')\n```",
    tags: ["Python", "数据分析"],
    createdAt: "2025-05-15",
    updatedAt: "2025-05-20"
  }
];

const mockTags = ["React", "前端", "Python", "数据分析", "机器学习"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "新笔记",
      content: "## 新笔记\n\n从这里开始记录...",
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setIsEditing(true);
    toast.success("已创建新笔记");
  };

  const handleSaveNote = () => {
    if (!selectedNote) return;
    setNotes(notes.map(n => n.id === selectedNote.id ? selectedNote : n));
    setIsEditing(false);
    toast.success("笔记已保存");
  };

  const handleAddTag = () => {
    if (!newTag || !selectedNote) return;
    if (!selectedNote.tags.includes(newTag)) {
      setSelectedNote({
        ...selectedNote,
        tags: [...selectedNote.tags, newTag]
      });
      setNewTag("");
      toast.success("标签已添加");
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (!selectedNote) return;
    setSelectedNote({
      ...selectedNote,
      tags: selectedNote.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* 左侧笔记列表 */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">学习笔记</h2>
            <button
              onClick={handleCreateNote}
              className="p-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="搜索笔记..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-[#3E92CC] focus:border-[#3E92CC]"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2 top-3 text-gray-400"></i>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {mockTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-1 text-xs rounded-full ${selectedTag === tag 
                  ? 'bg-[#3E92CC] text-white' 
                  : 'bg-gray-100 text-gray-700'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredNotes.map(note => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedNote(note)}
              className={`p-4 border-b border-gray-200 cursor-pointer ${selectedNote?.id === note.id ? 'bg-[#3E92CC]/10' : 'hover:bg-gray-50'}`}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {note.content.substring(0, 60)}...
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 右侧笔记内容 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                    className="text-xl font-semibold border-b border-gray-300 focus:border-[#3E92CC] outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNote.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 rounded-full flex items-center">
                      {tag}
                      {isEditing && (
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      )}
                    </span>
                  ))}
                  {isEditing && (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="添加标签"
                        className="text-xs px-2 py-0.5 border border-gray-300 rounded-l-md outline-none"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-2 py-0.5 text-xs bg-[#3E92CC] text-white rounded-r-md"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#3E92CC] text-white rounded-md hover:bg-[#2E86AB]"
                  >
                    编辑
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {isEditing ? (
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                  className="w-full h-full p-4 border border-gray-300 rounded-md font-mono focus:ring-[#3E92CC] focus:border-[#3E92CC] outline-none"
                  style={{ minHeight: "300px" }}
                />
              ) : (
                <div className="prose max-w-none">
                  {selectedNote.content ? (
                    <ReactMarkdown
                      children={String(selectedNote.content)}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              language={match[1]}
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    />
                  ) : (
                    <div className="text-gray-500 italic">暂无内容</div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <i className="fa-solid fa-note-sticky text-5xl mb-4"></i>
              <p>选择或创建笔记开始学习</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}