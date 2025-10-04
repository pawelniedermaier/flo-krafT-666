import type { Issue } from "@/lib/types"

/**
 * Initial seed data for issues/tasks
 */
export const initialIssues: Issue[] = [
  {
    id: "TSK-001",
    title: "Implement user authentication system",
    description: "Build secure login/logout functionality with JWT tokens",
    status: "in-progress",
    priority: "P0",
    assigneeId: "USR-001",
    sprintId: "SPR-002",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "TSK-002",
    title: "Design cyberpunk UI components",
    description: "Create Matrix-themed buttons, cards, and form elements",
    status: "done",
    priority: "P1",
    assigneeId: "USR-002",
    sprintId: "SPR-001",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "TSK-003",
    title: "Setup database schema",
    description: "Configure PostgreSQL tables for users, projects, and tasks",
    status: "todo",
    priority: "P0",
    assigneeId: "USR-003",
    sprintId: "SPR-002",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "TSK-004",
    title: "Implement drag and drop kanban",
    description: "Add react-beautiful-dnd for task management",
    status: "in-review",
    priority: "P1",
    assigneeId: "USR-001",
    sprintId: "SPR-002",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "TSK-005",
    title: "Add real-time notifications",
    description: "WebSocket integration for live updates",
    status: "todo",
    priority: "P2",
    assigneeId: "USR-002",
    sprintId: "SPR-002",
    createdAt: new Date("2024-01-22"),
  },
]

