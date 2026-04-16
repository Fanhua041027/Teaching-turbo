import { toast } from "sonner";

/**
 * 新增数据库类型定义
 * 包含AI教学平台所有核心数据模型
 */

// 用户状态枚举
type UserStatus = "active" | "inactive" | "suspended";

// 用户角色枚举
type UserRole = "admin" | "teacher" | "student";

// 课程状态枚举
type CourseStatus = "draft" | "published" | "archived" | "closed";

// 课程难度枚举
type CourseLevel = "beginner" | "intermediate" | "advanced";

// 作业提交类型枚举
type SubmissionType = "text" | "file" | "both";

// 资源类型枚举
type ResourceType = "video" | "pdf" | "ppt" | "doc" | "zip" | "audio" | "link";

// 对话上下文枚举
type ConversationContext = "general" | "course" | "assignment";

// 消息角色枚举
type MessageRole = "user" | "assistant" | "system";

// 通知类型枚举
type NotificationType = "info" | "warning" | "alert";

/**
 * 用户实体
 */
interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 角色实体
 */
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 课程实体
 */
interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  coverImage: string;
  status: CourseStatus;
  level: CourseLevel;
  category: string;
  startDate: Date;
  endDate: Date;
  maxStudents?: number;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 章节实体
 */
interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  content: string;
  order: number;
  isFree: boolean;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 知识点实体
 */
interface KnowledgePoint {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  prerequisitePoints?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 资源实体
 */
interface Resource {
  id: string;
  courseId: string;
  chapterId?: string;
  title: string;
  type: ResourceType;
  url: string;
  size: number;
  duration?: number;
  downloads: number;
  isPreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 作业实体
 */
interface Assignment {
  id: string;
  courseId: string;
  chapterId?: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  submissionType: SubmissionType;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 作业提交实体
 */
interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  fileUrl?: string;
  score?: number;
  feedback?: string;
  isGraded: boolean;
  aiGraded: boolean;
  similarityScore?: number;
  submittedAt: Date;
  gradedAt?: Date;
}

/**
 * 学习路径实体
 */
interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  status: "active" | "completed" | "paused";
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 笔记实体
 */
interface Note {
  id: string;
  userId: string;
  courseId?: string;
  chapterId?: string;
  title: string;
  content: string;
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 对话实体
 */
interface Conversation {
  id: string;
  userId: string;
  title: string;
  context: ConversationContext;
  contextId?: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 消息实体
 */
interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  tokens: number;
  timestamp: Date;
}

/**
 * Java Spring Boot API 配置
 * 实际项目中应将这些配置放在环境变量中
 */
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // 直接使用固定URL
  AUTH_HEADER: 'Authorization',
  DEFAULT_TIMEOUT: 30000,
};

/**
 * 统一API请求方法
 * @param endpoint API端点
 * @param method HTTP方法
 * @param body 请求体
 * @param headers 额外请求头
 */
async function apiRequest(endpoint: string, method: string = 'GET', body?: any, headers?: Record<string, string>) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 从localStorage获取JWT token
  const token = localStorage.getItem('token');
  if (token) {
    requestHeaders[API_CONFIG.AUTH_HEADER] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}



interface SystemNotification {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "alert";
  targetRoles: string[]; // 目标角色
  isActive: boolean;
  startAt: Date;
  endAt?: Date;
  createdAt: Date;
}

interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// 实际Java后端API规范示例：
// Java Spring Boot控制器示例:
/*
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public List<User> getUsers() { ... }
    
    @PostMapping
    public User createUser(@RequestBody User user) { ... }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) { ... }
    
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) { ... }
}
*/

// 前端调用示例:
/*
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
const data = await response.json();
*/


class Database {
  private static instance: Database;
  private users: User[] = [];
  private roles: Role[] = [];
  private courses: Course[] = [];
  private chapters: Chapter[] = [];
  private resources: Resource[] = [];
  private assignments: Assignment[] = [];
  private submissions: Submission[] = [];
  private downloadRecords: Array<{
    id: string;
    resourceId: string;
    userId: string;
    downloadedAt: Date;
  }> = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private initializeMockData() {
    // 初始化角色
    this.roles = [
      {
        id: "1",
        name: "admin",
        permissions: ["user_manage", "course_manage", "system_setting"]
      },
      {
        id: "2",
        name: "teacher",
        permissions: ["course_manage", "assignment_manage", "grade_manage"]
      },
      {
        id: "3",
        name: "student",
        permissions: ["course_view", "assignment_submit", "resource_download"]
      }
    ];

    // 初始化用户
    this.users = [
      {
        id: "1",
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        username: "teacher1",
        email: "teacher1@example.com",
        password: "teacher123",
        role: "teacher",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        username: "student1",
        email: "student1@example.com",
        password: "student123",
        role: "student",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        username: "student2",
        email: "student2@example.com",
        password: "student123",
        role: "student",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ];
    
    // 添加默认账号提示
    console.log("默认管理员账号: admin/admin123");
    console.log("默认教师账号: teacher1/teacher123");
    console.log("学生测试账号1: student1/student123");
    console.log("学生测试账号2: student2/student123");
    console.log("请首次登录后修改密码");

    // 初始化课程
    this.courses = [
      {
        id: "1",
        title: "Python编程入门",
        description: "学习Python基础语法和编程思想",
        teacherId: "2",
        coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Python%20programming&sign=2f76fcba39204f75092c139c2fb0e551",
        status: "published",
        startDate: new Date("2025-07-01"),
        endDate: new Date("2025-08-30"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // 初始化章节
    this.chapters = [
      {
        id: "1",
        courseId: "1",
        title: "Python基础语法",
        content: "Python基础语法介绍...",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // 初始化资源
    this.resources = [
      {
        id: "1",
        courseId: "1",
        chapterId: "1",
        title: "Python基础语法课件",
        type: "pdf",
        url: "python-basic.pdf",
        size: 2.4,
        downloads: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // 初始化作业
    this.assignments = [
      {
        id: "1",
        courseId: "1",
        title: "Python基础练习",
        description: "完成基础语法练习题",
        dueDate: new Date("2025-07-15"),
        maxScore: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // 用户操作
  async getUserById(id: string): Promise<User | undefined> {
    try {
      return await apiRequest(`/users/${id}`);
    } catch (error) {
      console.error('获取用户失败:', error);
      toast.error(`获取用户失败: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Java后端API调用示例 (Spring Boot):
    /*
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('获取用户失败');
      return await response.json();
    } catch (error) {
      console.error('API调用错误:', error);
      return undefined;
    }
    */
    return this.users.find(user => user.email === email);
  }


  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      return await apiRequest('/users', 'POST', user);
    } catch (error) {
      console.error('创建用户失败:', error);
      throw new Error(`创建用户失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 课程操作
  async getCourseById(id: string): Promise<Course | undefined> {
    return this.courses.find(course => course.id === id);
  }

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return this.courses.filter(course => course.teacherId === teacherId);
  }

  async createCourse(course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  // 资源操作
  async getResourcesByCourse(courseId: string): Promise<Resource[]> {
    return this.resources.filter(resource => resource.courseId === courseId);
  }

  async downloadResource(resourceId: string, userId: string): Promise<Resource | undefined> {
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource) {
      resource.downloads += 1;
      this.downloadRecords.push({
        id: Date.now().toString(),
        resourceId,
        userId,
        downloadedAt: new Date()
      });
      return resource;
    }
    return undefined;
  }

  // 作业操作
  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    return this.assignments.filter(assignment => assignment.courseId === courseId);
  }

  async submitAssignment(
    assignmentId: string, 
    studentId: string, 
    content: string
  ): Promise<Submission> {
    const newSubmission: Submission = {
      id: Date.now().toString(),
      assignmentId,
      studentId,
      content,
      submittedAt: new Date()
    };
    this.submissions.push(newSubmission);
    return newSubmission;
  }

  // 对话相关操作
  async createConversation(userId: string, title: string): Promise<Conversation> {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return this.conversations.filter(c => c.userId === userId);
  }

  async createMessage(conversationId: string, content: string, role: "user" | "assistant"): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      content,
      role,
      timestamp: new Date()
    };
    this.messages.push(newMessage);
    
    // 更新会话更新时间
    this.conversations = this.conversations.map(c => 
      c.id === conversationId ? { ...c, updatedAt: new Date() } : c
    );
    
    return newMessage;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return this.messages.filter(m => m.conversationId === conversationId);
  }

  async deleteConversation(conversationId: string): Promise<void> {
    this.conversations = this.conversations.filter(c => c.id !== conversationId);
    this.messages = this.messages.filter(m => m.conversationId !== conversationId);
  }
}



export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export const db = Database.getInstance();