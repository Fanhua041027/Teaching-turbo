# Teaching Turbo —— 智能教学平台

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.x-brightgreen)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Teaching Turbo** 是一个前后端分离的智能教学平台，提供交互式可视化界面，集成开源 AI 大模型（如 ChatGLM）作为核心智能引擎。

## 技术架构

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│   Frontend          │     │   Backend           │     │   AI Engine     │
│  React + TypeScript │◄───►│  Spring Boot (Java) │◄───►│   ChatGLM /     │
│  Ant Design Pro     │     │  JPA + MySQL        │     │   DeepSeek      │
└─────────────────────┘     └─────────────────────┘     └─────────────────┘
```

## 核心功能

- **智能备课** — AI 辅助生成教案、课件和习题
- **课堂互动** — 实时问答、随堂测验、投票反馈
- **学情分析** — 数据可视化展示学生学习进度与薄弱点
- **资源管理** — 课件、资料、习题的统一存储与检索
- **自动化批改** — 支持客观题自动评分与主观题 AI 辅助评分

## 技术栈

### 前端
- **React 18** + **TypeScript** 构建
- Ant Design Pro 组件库
- Axios 网络请求
- React Router 前端路由

### 后端
- **Spring Boot** 框架
- Spring Data JPA + MySQL
- RESTful API 设计
- JWT 身份认证

### AI 集成
- ChatGLM API 接入
- 提示词工程（Prompt Engineering）
- 多轮对话上下文管理

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 后端

```bash
cd backend
mvn spring-boot:run
```

## 许可证

本项目仅供学习研究使用。
