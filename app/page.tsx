"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// Removed react-beautiful-dnd due to React 18 compatibility issues
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Play,
  Square,
  CheckCircle,
  BarChart3,
  Kanban,
  List,
  Calendar,
  Sun,
  Moon,
  Users,
  Mail,
  Phone,
  MapPin,
  UserPlus,
} from "lucide-react"

// Types
interface User {
  id: string
  name: string
  email: string
  role: "boss" | "manager" | "developer" | "designer" | "qa"
  avatar?: string
  phone?: string
  location?: string
  birthDate?: Date
  joinedAt: Date
  isActive: boolean
  managerId?: string
}

interface Issue {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "in-review" | "done"
  priority: "P0" | "P1" | "P2" | "P3" | "P4" | "P5"
  assigneeId?: string
  sprintId?: string
  createdAt: Date
}

interface Sprint {
  id: string
  name: string
  status: "planned" | "active" | "completed"
  startDate?: Date
  endDate?: Date
  createdAt: Date
}

// Sample Data
const initialUsers: User[] = [
  {
    id: "USR-001",
    name: "Neo Anderson",
    email: "neo@flowcraft.com",
    role: "developer",
    avatar: "/professional-developer-avatar.png",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    birthDate: new Date("1995-09-13"), // Born September 13, 1995 (29 years old)
    joinedAt: new Date("2024-03-15"),
    isActive: true,
    managerId: "USR-003", // Managed by Morpheus
  },
  {
    id: "USR-002",
    name: "Trinity",
    email: "trinity@flowcraft.com",
    role: "designer",
    avatar: "/professional-designer-avatar.png",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    birthDate: new Date("1990-03-31"), // Born March 31, 1990 (34 years old)
    joinedAt: new Date("2024-01-10"),
    isActive: true,
    managerId: "USR-003", // Managed by Morpheus
  },
  {
    id: "USR-003",
    name: "Morpheus",
    email: "morpheus@flowcraft.com",
    role: "manager",
    avatar: "/professional-manager-avatar.jpg",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    birthDate: new Date("1978-07-04"), // Born July 4, 1978 (46 years old)
    joinedAt: new Date("2023-08-01"),
    isActive: true,
    managerId: "USR-005", // Managed by Oracle
  },
  {
    id: "USR-004",
    name: "Agent Smith",
    email: "smith@flowcraft.com",
    role: "qa",
    avatar: "/professional-qa-avatar.jpg",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    birthDate: new Date("1988-12-25"), // Born December 25, 1988 (36 years old)
    joinedAt: new Date("2024-02-20"),
    isActive: true,
    managerId: "USR-003", // Managed by Morpheus
  },
  {
    id: "USR-005",
    name: "Oracle",
    email: "oracle@flowcraft.com",
    role: "boss",
    avatar: "/professional-admin-avatar.png",
    phone: "+1 (555) 567-8901",
    location: "Los Angeles, CA",
    birthDate: new Date("1970-05-12"), // Born May 12, 1970 (54 years old)
    joinedAt: new Date("2023-06-01"),
    isActive: true,
    managerId: undefined, // CEO/Top level
  },
]

const initialIssues: Issue[] = [
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

const initialSprints: Sprint[] = [
  {
    id: "SPR-001",
    name: "Foundation Sprint",
    status: "completed",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-14"),
    createdAt: new Date("2023-12-28"),
  },
  {
    id: "SPR-002",
    name: "Core Features Sprint",
    status: "active",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-28"),
    createdAt: new Date("2024-01-10"),
  },
  { id: "SPR-003", name: "Enhancement Sprint", status: "planned", createdAt: new Date("2024-01-20") },
]

const roleColors = {
  boss: "bg-red-100 text-red-800 border-red-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  developer: "bg-green-100 text-green-800 border-green-200",
  designer: "bg-purple-100 text-purple-800 border-purple-200",
  qa: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function FlowCraft() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints)
  const [activeView, setActiveView] = useState<"issues" | "kanban" | "sprints" | "users" | "organization" | "tarot">("issues")
  const [tarotCard, setTarotCard] = useState<{ name: string; meaning: string; advice: string } | null>(null)
  const [destinyCard, setDestinyCard] = useState<{ name: string; subtitle: string; image: string; description: string } | null>(null)
  const [isDestinyModalOpen, setIsDestinyModalOpen] = useState(false)
  const [standardTheme, setStandardTheme] = useState<"light" | "dark">("light")
  const [cyberpunkTheme, setCyberpunkTheme] = useState<"cyberpunk" | "turbo-matrix">("cyberpunk")
  const [isStandardMode, setIsStandardMode] = useState(true) // true = standard themes, false = cyberpunk themes
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "developer" as User["role"],
    phone: "",
    location: "",
    managerId: "",
    spawnDate: "",
    userType: "user" as "top-management" | "user",
    avatar: "",
  })
  const [newIssue, setNewIssue] = useState<{
    title: string
    description: string
    priority: Issue["priority"]
    assigneeId: string
    sprintId: string | undefined
  }>({
    title: "",
    description: "",
    priority: "P3",
    assigneeId: "",
    sprintId: undefined,
  })
  const [newSprint, setNewSprint] = useState({ name: "", startDate: "", endDate: "" })
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false)

  // ADDING BULK ASSIGNMENT FUNCTIONALITY AND QUICK ASSIGN FEATURES
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [bulkAssigneeId, setBulkAssigneeId] = useState<string>("")

  // Generate next user ID
  const generateUserId = () => {
    const maxId = Math.max(...users.map((user) => Number.parseInt(user.id.split("-")[1])))
    return `USR-${String(maxId + 1).padStart(3, "0")}`
  }

  // Handle avatar file upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewUser({ ...newUser, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Create new user
  const createUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return

    const user: User = {
      id: generateUserId(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar || undefined,
      phone: newUser.phone,
      location: newUser.location,
      birthDate: newUser.spawnDate ? new Date(newUser.spawnDate) : undefined,
      joinedAt: new Date(),
      isActive: true,
      managerId: newUser.userType === "top-management" ? undefined : (newUser.managerId || undefined),
    }

    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "developer", phone: "", location: "", managerId: "", spawnDate: "", userType: "user", avatar: "" })
    setIsCreateUserOpen(false)
  }

  // Update user
  const updateUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setEditingUser(null)
  }

  // Toggle user active status
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  // Delete user
  const deleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    // Unassign issues from deleted user
    setIssues(issues.map((issue) => (issue.assigneeId === userId ? { ...issue, assigneeId: undefined } : issue)))
  }

  // Get user by ID
  const getUserById = (userId: string) => users.find((user) => user.id === userId)

  // Calculate age from birth date
  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Generate next issue ID
  const generateIssueId = () => {
    const maxId = Math.max(...issues.map((issue) => Number.parseInt(issue.id.split("-")[1])))
    return `TSK-${String(maxId + 1).padStart(3, "0")}`
  }

  // Generate next sprint ID
  const generateSprintId = () => {
    const maxId = Math.max(...sprints.map((sprint) => Number.parseInt(sprint.id.split("-")[1])))
    return `SPR-${String(maxId + 1).padStart(3, "0")}`
  }

  // Create new issue
  const createIssue = () => {
    if (!newIssue.title.trim()) return

    const issue: Issue = {
      id: generateIssueId(),
      title: newIssue.title,
      description: newIssue.description,
      status: "todo",
      priority: newIssue.priority,
      assigneeId: newIssue.assigneeId,
      sprintId: newIssue.sprintId,
      createdAt: new Date(),
    }

    setIssues([...issues, issue])
    setNewIssue({ title: "", description: "", priority: "P3", assigneeId: "", sprintId: undefined })
    setIsCreateIssueOpen(false)
  }

  // Create new sprint
  const createSprint = () => {
    if (!newSprint.name.trim()) return

    const sprint: Sprint = {
      id: generateSprintId(),
      name: newSprint.name,
      status: "planned",
      startDate: newSprint.startDate ? new Date(newSprint.startDate) : undefined,
      endDate: newSprint.endDate ? new Date(newSprint.endDate) : undefined,
      createdAt: new Date(),
    }

    setSprints([...sprints, sprint])
    setNewSprint({ name: "", startDate: "", endDate: "" })
    setIsCreateSprintOpen(false)
  }

  // Start sprint
  const startSprint = (sprintId: string) => {
    setSprints(
      sprints.map((sprint) => {
        if (sprint.id === sprintId) {
          return { ...sprint, status: "active" as const, startDate: new Date() }
        }
        if (sprint.status === "active") {
          return { ...sprint, status: "planned" as const }
        }
        return sprint
      }),
    )
  }

  // End sprint
  const endSprint = (sprintId: string) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === sprintId ? { ...sprint, status: "completed" as const, endDate: new Date() } : sprint,
      ),
    )

    // Move unfinished issues back to backlog
    setIssues(
      issues.map((issue) =>
        issue.sprintId === sprintId && issue.status !== "done" ? { ...issue, sprintId: undefined } : issue,
      ),
    )
  }

  // Delete issue
  const deleteIssue = (issueId: string) => {
    setIssues(issues.filter((issue) => issue.id !== issueId))
  }

  // Update issue
  const updateIssue = (updatedIssue: Issue) => {
    setIssues(issues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)))
    setEditingIssue(null)
  }

  // Assign issue to sprint
  const assignIssueToSprint = (issueId: string, sprintId: string | undefined) => {
    setIssues(issues.map((issue) => (issue.id === issueId ? { ...issue, sprintId } : issue)))
  }

  // Drag and drop handler using HTML5 Drag and Drop API
  const [draggedIssue, setDraggedIssue] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    setDraggedIssue(issueId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', issueId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetStatus: Issue["status"]) => {
    e.preventDefault()
    const issueId = e.dataTransfer.getData('text/html')
    
    if (issueId && draggedIssue === issueId) {
      setIssues(issues.map((issue) => 
        issue.id === issueId ? { ...issue, status: targetStatus } : issue
      ))
    }
    setDraggedIssue(null)
  }

  const handleDragEnd = () => {
    setDraggedIssue(null)
  }

  // ADDING BULK ASSIGNMENT FUNCTIONALITY AND QUICK ASSIGN FEATURES
  const bulkAssignIssues = () => {
    if (!bulkAssigneeId || selectedIssues.length === 0) return

    setIssues(
      issues.map((issue) =>
        selectedIssues.includes(issue.id)
          ? { ...issue, assigneeId: bulkAssigneeId === "none" ? undefined : bulkAssigneeId }
          : issue,
      ),
    )

    setSelectedIssues([])
    setBulkAssigneeId("")
  }

  const quickAssignIssue = (issueId: string, userId: string | undefined) => {
    setIssues(issues.map((issue) => (issue.id === issueId ? { ...issue, assigneeId: userId } : issue)))
  }

  const toggleIssueSelection = (issueId: string) => {
    setSelectedIssues((prev) => (prev.includes(issueId) ? prev.filter((id) => id !== issueId) : [...prev, issueId]))
  }

  const activeSprint = sprints.find((sprint) => sprint.status === "active")
  const activeSprintIssues = issues.filter((issue) => issue.sprintId === activeSprint?.id)
  const backlogIssues = issues.filter((issue) => !issue.sprintId)

  const getDirectReports = (managerId: string) => {
    return users.filter((user) => user.managerId === managerId && user.isActive)
  }

  const getManagerChain = (userId: string): User[] => {
    const user = getUserById(userId)
    if (!user || !user.managerId) return []

    const manager = getUserById(user.managerId)
    if (!manager) return []

    return [manager, ...getManagerChain(manager.id)]
  }

  // Build organization hierarchy tree
  interface OrgNode {
    user: User
    children: OrgNode[]
    level: number
  }

  const buildOrgTree = (): OrgNode[] => {
    // Find top-level users (no manager)
    const topLevel = users.filter((user) => !user.managerId && user.isActive)

    const buildNode = (user: User, level: number): OrgNode => {
      const directReports = getDirectReports(user.id)
      return {
        user,
        children: directReports.map((report) => buildNode(report, level + 1)),
        level,
      }
    }

    return topLevel.map((user) => buildNode(user, 0))
  }

  useEffect(() => {
    // Loading screen timer
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove("dark", "cyberpunk", "turbo-matrix")

    if (isStandardMode) {
      if (standardTheme === "dark") {
        document.documentElement.classList.add("dark")
      }
      // light theme is default, no class needed
    } else {
      document.documentElement.classList.add(cyberpunkTheme)
    }
  }, [standardTheme, cyberpunkTheme, isStandardMode])

  const toggleStandardTheme = () => {
    setStandardTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const toggleCyberpunkTheme = () => {
    setCyberpunkTheme((prev) => (prev === "cyberpunk" ? "turbo-matrix" : "cyberpunk"))
  }

  const switchThemeMode = () => {
    setIsStandardMode((prev) => !prev)
  }

  // Tarot card reading for the boss
  const tarotCards = [
    {
      name: "The Overwhelmed Developer",
      meaning: "Your team is drowning in technical debt and legacy code.",
      advice: "Hire more developers or lower your expectations. Preferably both."
    },
    {
      name: "The Infinite Sprint",
      meaning: "This sprint will never end. Time is a flat circle.",
      advice: "Accept that deadlines are merely suggestions whispered by optimists."
    },
    {
      name: "The Meeting Vortex",
      meaning: "All productivity shall be consumed by synchronous communication.",
      advice: "Schedule a meeting to discuss why there are too many meetings."
    },
    {
      name: "The Scope Creep",
      meaning: "What started as a button is now an entire microservice architecture.",
      advice: "Just one more feature. What could go wrong?"
    },
    {
      name: "The Burning Budget",
      meaning: "Money flows like water through a colander.",
      advice: "Have you considered blaming the economy?"
    },
    {
      name: "The Mystical Deadline",
      meaning: "The deadline approaches, yet nothing is ready.",
      advice: "Move it to the next quarter. Nobody will remember."
    },
    {
      name: "The Coffee Dependency",
      meaning: "Your team's blood is 80% caffeine.",
      advice: "Invest in a commercial espresso machine. It's cheaper than therapy."
    },
    {
      name: "The Technical Debt Collector",
      meaning: "The sins of past shortcuts have come due.",
      advice: "Rewrite everything from scratch. What's another 6 months?"
    },
    {
      name: "The Bus Factor",
      meaning: "Only one person knows how the system works. They're on vacation.",
      advice: "Pray they don't win the lottery."
    },
    {
      name: "The Stakeholder Paradox",
      meaning: "They want it fast, cheap, and perfect. Pick one.",
      advice: "Nod and smile. Then do whatever makes sense."
    },
    {
      name: "The Documentation Void",
      meaning: "No one knows how anything works. The code is the documentation.",
      advice: "The real documentation was the friends we made along the way."
    },
    {
      name: "The Production Incident",
      meaning: "Something is on fire. Possibly everything.",
      advice: "Have you tried turning it off and on again?"
    }
  ]

  const drawTarotCard = () => {
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)]
    setTarotCard(randomCard)
  }

  // Destiny Decision Cards
  const destinyCards = [
    {
      name: "I The Magician",
      subtitle: "Green Light (Go For It)",
      image: "/go.png",
      description: "You've received the \"green light\"! It's time to hit the ground running, as this is a perfect opportunity for you to prove the project makes sense yourself. Good luck, because from now on, everything depends solely on you."
    },
    {
      name: "XII The Hanged Man",
      subtitle: "The Justification (No Go)",
      image: "/stop.png",
      description: "Your project is \"suspended\" awaiting... better times. Prepare for acrobatics to justify why it didn't work. Most likely, you'll end up being blamed, but at least you'll gain a \"new perspective.\""
    },
    {
      name: "VIII Justice",
      subtitle: "The Process (Stop)",
      image: "/process.png",
      description: "Hold on a moment! Your decision requires \"further analysis\" and going through \"necessary procedures.\" Expect your idea to be trapped in bureaucratic limbo, where truth is relative and the process is eternal."
    }
  ]

  const drawDestinyCard = () => {
    const randomCard = destinyCards[Math.floor(Math.random() * destinyCards.length)]
    setDestinyCard(randomCard)
    setIsDestinyModalOpen(true)
  }

  // Organization Chart Component
  const OrgChart = ({ node }: { node: OrgNode }) => {
    const userIssues = issues.filter((issue) => issue.assigneeId === node.user.id)
    const completedIssues = userIssues.filter((issue) => issue.status === "done")

    return (
      <div className="flex flex-col items-center">
        {/* User Card */}
        <Card className="professional-card hover-lift w-80 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={node.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {node.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{node.user.name}</h3>
                  {!node.user.managerId && (
                    <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                      Top Mgmt
                    </Badge>
                  )}
                </div>
                <Badge className={`${roleColors[node.user.role]} text-xs`} variant="outline">
                  {node.user.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>{node.user.email}</span>
              </div>
              {node.user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>{node.user.location}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span>Tasks: {userIssues.length}</span>
                <span className="text-green-600">Done: {completedIssues.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connecting Line */}
        {node.children.length > 0 && (
          <div className="relative">
            <div className="w-px h-6 bg-border mx-auto" />
            <div className="w-full h-px bg-border absolute top-6 left-0" />
          </div>
        )}

        {/* Children */}
        {node.children.length > 0 && (
          <div className="flex gap-8 mt-6 relative">
            {node.children.map((child, index) => (
              <div key={child.user.id} className="relative">
                {/* Vertical line to child */}
                <div className="absolute w-px h-6 bg-border left-1/2 -translate-x-1/2 -top-6" />
                <OrgChart node={child} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-500">
          <div className="relative w-[28rem] h-80 flex items-center justify-center mb-8">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={448}
              height={320}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-wide text-center mt-12 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
            🚀 THE BEST KORPO PROJECT TOOL EVER! 🚀
          </h1>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  // User Selection Screen
  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-8">
        <div className="w-full max-w-6xl animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image 
                src="/logo2.png" 
                alt="Logo" 
                width={200}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Profile</h2>
            <p className="text-muted-foreground">Select a user to continue</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.filter((user) => user.isActive).map((user) => {
              const userIssues = issues.filter((issue) => issue.assigneeId === user.id)
              const completedIssues = userIssues.filter((issue) => issue.status === "done")
              
              return (
                <Card 
                  key={user.id} 
                  className="professional-card hover-lift cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Avatar className="w-24 h-24 ring-4 ring-primary/10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
                          {!user.managerId && (
                            <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                              Top Mgmt
                            </Badge>
                          )}
                        </div>
                        <Badge className={`${roleColors[user.role]}`} variant="outline">
                          {user.role}
                        </Badge>
                      </div>

                      <div className="w-full pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tasks</p>
                            <p className="text-lg font-semibold text-foreground">{userIssues.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Done</p>
                            <p className="text-lg font-semibold text-green-600">{completedIssues.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-center">
              <div className="relative w-full h-16 flex items-center justify-center">
                <Image 
                  src="/logo2.png" 
                  alt="Logo" 
                  width={200}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant={activeView === "issues" ? "default" : "ghost"}
                onClick={() => setActiveView("issues")}
                className="w-full justify-start gap-3 h-10"
              >
                <List className="w-4 h-4" />
                Issues
              </Button>
              <Button
                variant={activeView === "kanban" ? "default" : "ghost"}
                onClick={() => setActiveView("kanban")}
                className="w-full justify-start gap-3 h-10"
              >
                <Kanban className="w-4 h-4" />
                Board
              </Button>
              <Button
                variant={activeView === "sprints" ? "default" : "ghost"}
                onClick={() => setActiveView("sprints")}
                className="w-full justify-start gap-3 h-10"
              >
                <Calendar className="w-4 h-4" />
                Sprints
              </Button>
              <Button
                variant={activeView === "users" ? "default" : "ghost"}
                onClick={() => setActiveView("users")}
                className="w-full justify-start gap-3 h-10"
              >
                <Users className="w-4 h-4" />
                Users
              </Button>
              <Button
                variant={activeView === "organization" ? "default" : "ghost"}
                onClick={() => setActiveView("organization")}
                className="w-full justify-start gap-3 h-10"
              >
                <BarChart3 className="w-4 h-4" />
                Organization
              </Button>
              
              {/* Special Boss-only Feature */}
              {selectedUser?.role === "boss" && (
                <>
                  <div className="my-2 border-t border-sidebar-border" />
                  <Button
                    variant={activeView === "tarot" ? "default" : "ghost"}
                    onClick={() => setActiveView("tarot")}
                    className={`w-full justify-start gap-3 h-10 ${activeView === "tarot" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}`}
                  >
                    <span className="text-lg">🔮</span>
                    TAROT AI BOOST
                  </Button>
                </>
              )}
            </div>
          </nav>

          <div className="p-4 border-t border-sidebar-border space-y-4">
            {/* Current User */}
            <div className="px-3 py-2 bg-sidebar-accent rounded-lg">
              <p className="text-xs text-sidebar-foreground/60 mb-2">Logged in as</p>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedUser?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {selectedUser?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{selectedUser?.name}</p>
                  <Badge className={`${roleColors[selectedUser?.role || "developer"]} text-xs`} variant="outline">
                    {selectedUser?.role}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="w-full mt-3 text-xs"
              >
                Switch User
              </Button>
            </div>

            <div className="space-y-2">
              {/* Standard Light/Dark Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleStandardTheme}
                className={`w-full justify-start gap-3 ${isStandardMode ? "bg-sidebar-accent" : ""}`}
              >
                {standardTheme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {standardTheme === "light" ? "Dark mode" : "Light mode"}
              </Button>

              {/* Cyberpunk Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCyberpunkTheme}
                className={`w-full justify-start gap-3 ${!isStandardMode ? "bg-sidebar-accent" : ""}`}
              >
                {cyberpunkTheme === "cyberpunk" ? (
                  <div className="w-4 h-4 bg-primary rounded-sm" style={{ boxShadow: "0 0 8px currentColor" }} />
                ) : (
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{
                      background: "linear-gradient(45deg, #00ff41, #ff0080, #ff4500)",
                      boxShadow: "0 0 12px #00ff41, 0 0 24px #ff0080",
                    }}
                  />
                )}
                {cyberpunkTheme === "cyberpunk" ? "Turbo Matrix" : "Cyberpunk"}
              </Button>

              {/* Theme Mode Switch */}
              <Button variant="outline" size="sm" onClick={switchThemeMode} className="w-full text-xs bg-transparent">
                {isStandardMode ? "Switch to Cyber" : "Switch to Standard"}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {activeView === "issues" && "Issues"}
                  {activeView === "kanban" && "Board"}
                  {activeView === "sprints" && "Sprints"}
                  {activeView === "users" && "Users"}
                  {activeView === "organization" && "Organization"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeView === "issues" && `${issues.length} issues total`}
                  {activeView === "kanban" && activeSprint ? `${activeSprint.name}` : "No active sprint"}
                  {activeView === "sprints" && `${sprints.length} sprints`}
                  {activeView === "users" && `${users.filter((u) => u.isActive).length} active users`}
                  {activeView === "organization" && "Company hierarchy and reporting structure"}
                  {activeView === "tarot" && "🔮 Mystical insights for the enlightened leader"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {activeView === "issues" && (
                  <Dialog open={isCreateIssueOpen} onOpenChange={setIsCreateIssueOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Issue
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Issue</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newIssue.title}
                            onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                            placeholder="Enter issue title..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newIssue.description}
                            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                            placeholder="Enter issue description..."
                            className="mt-1 min-h-[100px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                              value={newIssue.priority}
                              onValueChange={(value) =>
                                setNewIssue({ ...newIssue, priority: value as Issue["priority"] })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="P0">P0 - Critical</SelectItem>
                                <SelectItem value="P1">P1 - High</SelectItem>
                                <SelectItem value="P2">P2 - Medium</SelectItem>
                                <SelectItem value="P3">P3 - Low</SelectItem>
                                <SelectItem value="P4">P4 - Minor</SelectItem>
                                <SelectItem value="P5">P5 - Trivial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="assignee">Assignee</Label>
                            <Select
                              value={newIssue.assigneeId || "none"}
                              onValueChange={(value) =>
                                setNewIssue({ ...newIssue, assigneeId: value === "none" ? "" : value })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Unassigned" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Unassigned</SelectItem>
                                {users
                                  .filter((user) => user.isActive)
                                  .map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-sprint">Sprint (Optional)</Label>
                          <Select
                            value={newIssue.sprintId || "none"}
                            onValueChange={(value) =>
                              setNewIssue({ ...newIssue, sprintId: value === "none" ? undefined : value })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="No sprint" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No sprint</SelectItem>
                              {sprints
                                .filter((sprint) => sprint.status !== "completed")
                                .map((sprint) => (
                                  <SelectItem key={sprint.id} value={sprint.id}>
                                    {sprint.name} ({sprint.status})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={createIssue} className="w-full">
                          Create Issue
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {activeView === "sprints" && (
                  <Dialog open={isCreateSprintOpen} onOpenChange={setIsCreateSprintOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Sprint
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Sprint</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sprint-name">Sprint Name</Label>
                          <Input
                            id="sprint-name"
                            value={newSprint.name}
                            onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                            placeholder="Enter sprint name..."
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                              id="start-date"
                              type="date"
                              value={newSprint.startDate}
                              onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                              id="end-date"
                              type="date"
                              value={newSprint.endDate}
                              onChange={(e) => setNewSprint({ ...newSprint, endDate: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <Button onClick={createSprint} className="w-full">
                          Create Sprint
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {/* New User button for users view */}
                {activeView === "users" && (
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserPlus className="w-4 h-4" />
                        New User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex flex-col items-center gap-4 p-4 border border-border rounded-lg bg-muted/30">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={newUser.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {newUser.name
                                ? newUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="w-full">
                            <Label htmlFor="user-avatar">Profile Picture</Label>
                            <Input
                              id="user-avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Upload an image from your computer</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="user-name">Full Name</Label>
                            <Input
                              id="user-name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              placeholder="Enter full name..."
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="user-email">Email</Label>
                            <Input
                              id="user-email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              placeholder="Enter email address..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="user-type">User Type</Label>
                          <Select
                            value={newUser.userType}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, userType: value as "top-management" | "user", managerId: value === "top-management" ? "" : newUser.managerId })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="top-management">Top Management</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="user-role">Role</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({ ...newUser, role: value as User["role"] })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="boss">BOSS</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="designer">Designer</SelectItem>
                                <SelectItem value="qa">QA Engineer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="user-phone">Phone (Optional)</Label>
                            <Input
                              id="user-phone"
                              value={newUser.phone}
                              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                              placeholder="Enter phone number..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="user-location">Location (Optional)</Label>
                          <Input
                            id="user-location"
                            value={newUser.location}
                            onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                            placeholder="Enter location..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-spawn-date">Date of Birth (Optional)</Label>
                          <Input
                            id="user-spawn-date"
                            type="date"
                            value={newUser.spawnDate}
                            onChange={(e) => setNewUser({ ...newUser, spawnDate: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        {newUser.userType === "user" && (
                          <div>
                            <Label htmlFor="user-manager">Manager (Optional)</Label>
                            <Select
                              value={newUser.managerId || "none"}
                              onValueChange={(value) =>
                                setNewUser({ ...newUser, managerId: value === "none" ? "" : value })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="No manager" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No manager</SelectItem>
                                {users
                                  .filter((user) => user.isActive && (user.role === "manager" || user.role === "boss"))
                                  .map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name} ({user.role})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {newUser.userType === "top-management" && (
                          <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">
                              <strong>Top Management</strong> users do not require a manager assignment.
                            </p>
                          </div>
                        )}
                        <Button onClick={createUser} className="w-full">
                          Add User
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Issues View */}
            {activeView === "issues" && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search issues..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>

                  {selectedIssues.length > 0 && (
                    <div className="flex items-center gap-2 pl-4 border-l border-border">
                      <span className="text-sm text-muted-foreground">{selectedIssues.length} selected</span>
                      <Select value={bulkAssigneeId} onValueChange={setBulkAssigneeId}>
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Unassign</SelectItem>
                          {users
                            .filter((user) => user.isActive)
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={bulkAssignIssues} disabled={!bulkAssigneeId}>
                        Assign
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedIssues([])}>
                        Clear
                      </Button>
                    </div>
                  )}
                </div>

                {/* Issues List */}
                <div className="space-y-3">
                  {issues.map((issue) => {
                    const assignee = issue.assigneeId ? getUserById(issue.assigneeId) : null
                    const isSelected = selectedIssues.includes(issue.id)

                    return (
                      <Card
                        key={issue.id}
                        className={`professional-card hover-lift ${isSelected ? "ring-2 ring-primary" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleIssueSelection(issue.id)}
                                className="mt-1 rounded border-border"
                              />

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {issue.id}
                                  </Badge>
                                  <Badge className={`text-xs priority-${issue.priority.toLowerCase()}`}>
                                    {issue.priority}
                                  </Badge>
                                  <Badge className={`text-xs status-${issue.status}`}>
                                    {issue.status.replace("-", " ")}
                                  </Badge>
                                </div>
                                <h3 className="font-medium text-foreground mb-1">{issue.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{issue.description}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={issue.assigneeId || "none"}
                                      onValueChange={(value) =>
                                        quickAssignIssue(issue.id, value === "none" ? undefined : value)
                                      }
                                    >
                                      <SelectTrigger className="w-[140px] h-7 text-xs">
                                        <SelectValue>
                                          {assignee ? (
                                            <div className="flex items-center gap-2">
                                              <Avatar className="w-4 h-4">
                                                <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                                                <AvatarFallback className="text-xs">
                                                  {assignee.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span>{assignee.name}</span>
                                            </div>
                                          ) : (
                                            "Unassigned"
                                          )}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">Unassigned</SelectItem>
                                        {users
                                          .filter((user) => user.isActive)
                                          .map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                              <div className="flex items-center gap-2">
                                                <Avatar className="w-4 h-4">
                                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                                  <AvatarFallback className="text-xs">
                                                    {user.name
                                                      .split(" ")
                                                      .map((n) => n[0])
                                                      .join("")}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <span>{user.name}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={issue.sprintId || "none"}
                                      onValueChange={(value) =>
                                        assignIssueToSprint(issue.id, value === "none" ? undefined : value)
                                      }
                                    >
                                      <SelectTrigger className="w-[140px] h-7 text-xs">
                                        <SelectValue placeholder="No sprint" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">No sprint</SelectItem>
                                        {sprints
                                          .filter((sprint) => sprint.status !== "completed")
                                          .map((sprint) => (
                                            <SelectItem key={sprint.id} value={sprint.id}>
                                              {sprint.name} ({sprint.status})
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                    {issue.sprintId && (
                                      <Badge variant="outline" className="text-xs">
                                        {sprints.find((s) => s.id === issue.sprintId)?.name}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingIssue(issue)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteIssue(issue.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Users View */}
            {activeView === "users" && (
              <div className="space-y-4">
                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="professional-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                      <p className="text-2xl font-bold text-foreground">{users.length}</p>
                    </CardContent>
                  </Card>
                  <Card className="professional-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.isActive).length}</p>
                    </CardContent>
                  </Card>
                  <Card className="professional-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Developers</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {users.filter((u) => u.role === "developer").length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="professional-card">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Managers</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {users.filter((u) => u.role === "manager").length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Users List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {users.map((user) => {
                    const userIssues = issues.filter((issue) => issue.assigneeId === user.id)
                    const completedIssues = userIssues.filter((issue) => issue.status === "done")
                    const manager = user.managerId ? getUserById(user.managerId) : null
                    const directReports = getDirectReports(user.id)

                    return (
                      <Card key={user.id} className="professional-card hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                                  {!user.managerId && (
                                    <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                                      Top Mgmt
                                    </Badge>
                                  )}
                                </div>
                                <Badge className={roleColors[user.role]} variant="outline">
                                  {user.role}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingUser(user)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleUserStatus(user.id)}
                                className={`h-8 w-8 p-0 ${user.isActive ? "text-orange-600" : "text-green-600"}`}
                              >
                                {user.isActive ? <Square className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                            {user.location && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{user.location}</span>
                              </div>
                            )}

                            {manager && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>Reports to: </span>
                                <div className="flex items-center gap-1">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {manager.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-foreground font-medium">{manager.name}</span>
                                </div>
                              </div>
                            )}

                            {directReports.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4" />
                                  <span>
                                    Manages {directReports.length} team member{directReports.length > 1 ? "s" : ""}:
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 ml-6">
                                  {directReports.map((report) => (
                                    <div
                                      key={report.id}
                                      className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1"
                                    >
                                      <Avatar className="w-4 h-4">
                                        <AvatarImage src={report.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="text-xs">
                                          {report.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-foreground">{report.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-3 border-t border-border">
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="text-sm text-muted-foreground">Assigned</p>
                                  <p className="text-lg font-semibold text-foreground">{userIssues.length}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Completed</p>
                                  <p className="text-lg font-semibold text-green-600">{completedIssues.length}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                              <div className="flex flex-col gap-1 pt-2">
                                {user.birthDate && (
                                  <span>
                                    Born {user.birthDate.toLocaleDateString()} (Age: {calculateAge(user.birthDate)})
                                  </span>
                                )}
                                <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                              </div>
                              <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Kanban View */}
            {activeView === "kanban" && (
              <div>
                {!activeSprint ? (
                  <Card className="professional-card">
                    <CardContent className="py-16 text-center">
                      <Kanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Active Sprint</h3>
                      <p className="text-muted-foreground">Start a sprint to use the kanban board</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {(["todo", "in-progress", "in-review", "done"] as const).map((status) => (
                      <div key={status} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground capitalize">{status.replace("-", " ")}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {activeSprintIssues.filter((issue) => issue.status === status).length}
                          </Badge>
                        </div>
                        <div
                          className="min-h-[500px] p-3 rounded-lg border-2 border-dashed border-border bg-muted/20 transition-colors"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, status)}
                        >
                          {activeSprintIssues
                            .filter((issue) => issue.status === status)
                            .map((issue) => {
                              const assignee = issue.assigneeId ? getUserById(issue.assigneeId) : null
                              return (
                                <Card
                                  key={issue.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, issue.id)}
                                  onDragEnd={handleDragEnd}
                                  className={`mb-3 cursor-move transition-all ${
                                    draggedIssue === issue.id
                                      ? "opacity-50 scale-95"
                                      : "professional-card hover-lift"
                                  }`}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        {issue.id}
                                      </Badge>
                                      <Badge className={`text-xs priority-${issue.priority.toLowerCase()}`}>
                                        {issue.priority}
                                      </Badge>
                                    </div>
                                    <h4 className="font-medium text-sm mb-2 line-clamp-2">{issue.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                      {issue.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      {assignee ? (
                                        <>
                                          <Avatar className="w-5 h-5">
                                            <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-xs">
                                              {assignee.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs text-foreground">{assignee.name}</span>
                                        </>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">Unassigned</span>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sprints View */}
            {activeView === "sprints" && (
              <div className="space-y-6">
                {sprints.map((sprint) => {
                  const sprintIssues = issues.filter((issue) => issue.sprintId === sprint.id)
                  const completedIssues = sprintIssues.filter((issue) => issue.status === "done")
                  const progressPercentage =
                    sprintIssues.length > 0 ? Math.round((completedIssues.length / sprintIssues.length) * 100) : 0

                  return (
                    <Card key={sprint.id} className="professional-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{sprint.name}</CardTitle>
                            <Badge
                              className={`
                                ${sprint.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}
                                ${sprint.status === "completed" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                                ${sprint.status === "planned" ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
                              `}
                            >
                              {sprint.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {sprint.status === "planned" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startSprint(sprint.id)}
                                className="gap-2"
                              >
                                <Play className="h-4 w-4" />
                                Start Sprint
                              </Button>
                            )}
                            {sprint.status === "active" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => endSprint(sprint.id)}
                                className="gap-2"
                              >
                                <Square className="h-4 w-4" />
                                End Sprint
                              </Button>
                            )}
                            {sprint.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Sprint Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
                            <p className="text-2xl font-bold text-foreground">{sprintIssues.length}</p>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{completedIssues.length}</p>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Progress</p>
                            <p className="text-2xl font-bold text-primary">{progressPercentage}%</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {sprintIssues.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Completion Rate</span>
                              <span className="font-medium">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Sprint Dates */}
                        {sprint.startDate && (
                          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t">
                            <span>
                              Start: <span className="text-foreground">{sprint.startDate.toLocaleDateString()}</span>
                            </span>
                            {sprint.endDate && (
                              <span>
                                End: <span className="text-foreground">{sprint.endDate.toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Organization View */}
            {activeView === "organization" && (
              <div className="space-y-6">
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>Organization Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {buildOrgTree().map((rootNode) => (
                        <OrgChart key={rootNode.user.id} node={rootNode} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tarot AI Boost - Boss Only */}
            {activeView === "tarot" && selectedUser?.role === "boss" && (
              <div className="space-y-6">
                {/* Warning Banner */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-2 border-purple-500 rounded-lg p-6 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🔮</span>
                    <h3 className="text-2xl font-bold">TAROT AI BOOST™</h3>
                    <span className="text-3xl">✨</span>
                  </div>
                  <p className="text-purple-200 text-sm italic">
                    "When data-driven decisions fail, consult the ancient arts of middle management mysticism."
                  </p>
                </div>

                {/* Destiny - Decision Feature */}
                <Card className="bg-gradient-to-r from-indigo-950 to-purple-950 border-purple-500 border-2 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-purple-200 flex items-center gap-2">
                      <span>⚖️</span> Destiny - Decision
                    </CardTitle>
                    <p className="text-purple-300 text-sm mt-2">
                      Consult the ancient cards to determine your project's fate: Go, Stop, or Process?
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Draw Card Section */}
                      <div className="space-y-4">
                        <Button
                          onClick={drawDestinyCard}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                          <span className="mr-2">✨</span>
                          REVEAL YOUR DESTINY
                          <span className="ml-2">✨</span>
                        </Button>

                        {destinyCard && (
                          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="bg-gradient-to-b from-purple-900 to-indigo-900 p-6 rounded-lg border-2 border-purple-400 shadow-xl">
                              <div className="text-center space-y-3">
                                <div className="flex justify-center">
                                  <div className="w-32 h-32 flex items-center justify-center">
                                    <img
                                      src={destinyCard.image}
                                      alt={destinyCard.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </div>
                                <h3 className="text-xl font-bold text-purple-100">{destinyCard.name}</h3>
                                <p className="text-lg text-purple-300 font-semibold">{destinyCard.subtitle}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!destinyCard && (
                          <div className="text-center py-12 border-2 border-dashed border-purple-700 rounded-lg bg-purple-950/30">
                            <p className="text-purple-400 text-sm italic">The fates await your query...</p>
                            <p className="text-purple-500 text-xs mt-2">🎴 Will you receive the green light? 🎴</p>
                          </div>
                        )}
                      </div>

                      {/* Card Description */}
                      {destinyCard && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                          <div className="bg-purple-950/50 p-6 rounded-lg border border-purple-700">
                            <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                              <span>📜</span> The Prophecy:
                            </h4>
                            <p className="text-purple-200 leading-relaxed">
                              {destinyCard.description}
                            </p>
                          </div>

                          <Button
                            onClick={drawDestinyCard}
                            variant="outline"
                            className="w-full border-purple-500 text-purple-300 hover:bg-purple-900/50"
                          >
                            Seek Another Destiny
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-purple-700">
                      <div className="bg-green-950/30 p-4 rounded-lg border border-green-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🟢</span>
                          <p className="text-green-300 font-semibold text-sm">The Magician</p>
                        </div>
                        <p className="text-green-400 text-xs">Green Light - Full speed ahead!</p>
                      </div>
                      <div className="bg-red-950/30 p-4 rounded-lg border border-red-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🔴</span>
                          <p className="text-red-300 font-semibold text-sm">The Hanged Man</p>
                        </div>
                        <p className="text-red-400 text-xs">No Go - Suspended indefinitely</p>
                      </div>
                      <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🟡</span>
                          <p className="text-yellow-300 font-semibold text-sm">Justice</p>
                        </div>
                        <p className="text-yellow-400 text-xs">Process - Think and decide</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Tarot Card Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Tarot Draw */}
                  <Card className="bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-500 border-2 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-purple-200 flex items-center gap-2">
                        <span>🌙</span> Divine Your Project's Fate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center space-y-4">
                        <p className="text-purple-300 text-sm">
                          Harness the power of corporate mysticism. Click below to reveal what the universe (and your quarterly reports) have in store.
                        </p>
                        <Button
                          onClick={drawTarotCard}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                          <span className="mr-2">🎴</span>
                          DRAW A CARD OF DESTINY
                          <span className="ml-2">🎴</span>
                        </Button>
                      </div>

                      {!tarotCard && (
                        <div className="text-center py-12 border-2 border-dashed border-purple-700 rounded-lg bg-purple-950/30">
                          <p className="text-purple-400 text-sm italic">The cards await your command...</p>
                          <p className="text-purple-500 text-xs mt-2">⭐ 100% accuracy guaranteed* ⭐</p>
                          <p className="text-purple-600 text-xs mt-1">*Not actually guaranteed</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Right: Card Reading */}
                  {tarotCard && (
                    <Card className="bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-500 border-2 shadow-2xl animate-in fade-in zoom-in duration-500">
                      <CardHeader>
                        <CardTitle className="text-purple-200 flex items-center gap-2">
                          <span>✨</span> Your Reading
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Card Display */}
                        <div className="bg-gradient-to-b from-purple-900 to-indigo-900 p-8 rounded-lg border-2 border-purple-400 shadow-xl">
                          <div className="text-center space-y-4">
                            <div className="text-6xl mb-4">🎴</div>
                            <h3 className="text-2xl font-bold text-purple-100">{tarotCard.name}</h3>
                          </div>
                        </div>

                        {/* Meaning */}
                        <div className="space-y-2">
                          <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                            <span>🌟</span> The Meaning:
                          </h4>
                          <p className="text-purple-200 bg-purple-950/50 p-4 rounded border border-purple-700">
                            {tarotCard.meaning}
                          </p>
                        </div>

                        {/* Advice */}
                        <div className="space-y-2">
                          <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                            <span>💡</span> The Wisdom:
                          </h4>
                          <p className="text-purple-200 bg-purple-950/50 p-4 rounded border border-purple-700 italic">
                            "{tarotCard.advice}"
                          </p>
                        </div>

                        <Button
                          onClick={drawTarotCard}
                          variant="outline"
                          className="w-full border-purple-500 text-purple-300 hover:bg-purple-900/50"
                        >
                          Draw Another Card
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Statistics */}
                <Card className="bg-gradient-to-r from-purple-950 to-indigo-950 border-purple-500 border-2">
                  <CardHeader>
                    <CardTitle className="text-purple-200 flex items-center gap-2">
                      <span>📊</span> Your Mystical Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
                        <p className="text-purple-400 text-sm mb-1">Overworked Developers</p>
                        <p className="text-3xl font-bold text-purple-200">{users.filter(u => u.role === "developer").length}</p>
                        <p className="text-purple-500 text-xs mt-1">All of them</p>
                      </div>
                      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
                        <p className="text-purple-400 text-sm mb-1">Deadline Anxiety Level</p>
                        <p className="text-3xl font-bold text-purple-200">∞</p>
                        <p className="text-purple-500 text-xs mt-1">Off the charts</p>
                      </div>
                      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
                        <p className="text-purple-400 text-sm mb-1">Meetings This Week</p>
                        <p className="text-3xl font-bold text-purple-200">Too Many</p>
                        <p className="text-purple-500 text-xs mt-1">Could have been emails</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="bg-purple-950/30 border border-purple-800 rounded-lg p-4">
                  <p className="text-purple-400 text-xs text-center italic">
                    ⚠️ DISCLAIMER: TAROT AI BOOST™ is for entertainment purposes only. Any resemblance to actual project management advice is purely coincidental. 
                    Side effects may include: existential dread, imposter syndrome, and an urge to update your LinkedIn profile. 
                    Consult your Scrum Master before making any life-altering decisions based on mystical card readings. ⚠️
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {editingIssue && (
        <Dialog open={!!editingIssue} onOpenChange={() => setEditingIssue(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingIssue.title}
                  onChange={(e) => setEditingIssue({ ...editingIssue, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingIssue.description}
                  onChange={(e) => setEditingIssue({ ...editingIssue, description: e.target.value })}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingIssue.priority}
                    onValueChange={(value) =>
                      setEditingIssue({ ...editingIssue, priority: value as Issue["priority"] })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P0">P0 - Critical</SelectItem>
                      <SelectItem value="P1">P1 - High</SelectItem>
                      <SelectItem value="P2">P2 - Medium</SelectItem>
                      <SelectItem value="P3">P3 - Low</SelectItem>
                      <SelectItem value="P4">P4 - Minor</SelectItem>
                      <SelectItem value="P5">P5 - Trivial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingIssue.status}
                    onValueChange={(value) => setEditingIssue({ ...editingIssue, status: value as Issue["status"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-assignee">Assignee</Label>
                  <Select
                    value={editingIssue.assigneeId || "none"}
                    onValueChange={(value) =>
                      setEditingIssue({ ...editingIssue, assigneeId: value === "none" ? undefined : value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {users
                        .filter((user) => user.isActive)
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-sprint">Sprint</Label>
                  <Select
                    value={editingIssue.sprintId || "none"}
                    onValueChange={(value) =>
                      setEditingIssue({ ...editingIssue, sprintId: value === "none" ? undefined : value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="No sprint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No sprint</SelectItem>
                      {sprints
                        .filter((sprint) => sprint.status !== "completed")
                        .map((sprint) => (
                          <SelectItem key={sprint.id} value={sprint.id}>
                            {sprint.name} ({sprint.status})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => updateIssue(editingIssue)} className="w-full">
                Update Issue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-user-name">Full Name</Label>
                  <Input
                    id="edit-user-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-user-email">Email</Label>
                  <Input
                    id="edit-user-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-user-role">Role</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value as User["role"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boss">BOSS</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="qa">QA Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-user-phone">Phone</Label>
                  <Input
                    id="edit-user-phone"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-user-location">Location</Label>
                <Input
                  id="edit-user-location"
                  value={editingUser.location || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-user-birthdate">Date of Birth</Label>
                <Input
                  id="edit-user-birthdate"
                  type="date"
                  value={editingUser.birthDate ? editingUser.birthDate.toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, birthDate: e.target.value ? new Date(e.target.value) : undefined })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-user-manager">Manager</Label>
                <Select
                  value={editingUser.managerId || "none"}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, managerId: value === "none" ? undefined : value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No manager</SelectItem>
                    {users
                      .filter(
                        (user) =>
                          user.isActive &&
                          user.id !== editingUser.id &&
                          (user.role === "manager" || user.role === "boss"),
                      )
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => updateUser(editingUser)} className="w-full">
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Destiny Card Modal - Fullscreen */}
      {destinyCard && isDestinyModalOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-950 to-indigo-950">
          {/* Close Button - Top Right */}
          <button
            onClick={() => setIsDestinyModalOpen(false)}
            className="absolute top-6 right-6 z-50 w-16 h-16 flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-full border-4 border-purple-400 shadow-2xl hover:shadow-purple-500/50 transition-all group"
          >
            <span className="text-4xl text-white font-bold group-hover:scale-110 transition-transform">×</span>
          </button>

          {/* Full Screen Grid Layout */}
          <div className="grid grid-cols-[1fr_600px] h-full">
            {/* Left Side - Full Height Image */}
            <div className="flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-12 border-r-4 border-purple-500">
              <div className="w-full h-full max-w-[800px] max-h-[90vh] flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 rounded-2xl border-4 border-purple-400 shadow-2xl p-8">
                {destinyCard.image && (
                  <img
                    src={destinyCard.image}
                    alt={destinyCard.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={(e) => {
                      console.error("Image failed to load:", destinyCard.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right Side - Fixed Width Info Panel */}
            <div className="flex flex-col bg-gradient-to-br from-purple-950 to-indigo-950 overflow-y-auto">
              {/* Header */}
              <div className="p-8 border-b-4 border-purple-500">
                <h2 className="text-3xl text-purple-100 text-center font-bold flex items-center justify-center gap-3">
                  <span className="text-4xl">⚖️</span>
                  Your Destiny
                  <span className="text-4xl">⚖️</span>
                </h2>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                  {/* Card Title */}
                  <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 rounded-xl p-8 border-4 border-purple-500">
                    <h3 className="text-5xl font-bold text-purple-100 text-center mb-4 drop-shadow-lg">
                      {destinyCard.name}
                    </h3>
                    <div className="flex justify-center">
                      <p className="text-3xl text-purple-300 font-bold bg-purple-900/80 px-8 py-3 rounded-full border-2 border-purple-400">
                        {destinyCard.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="bg-gradient-to-br from-purple-950/90 to-indigo-950/90 p-8 rounded-xl border-4 border-purple-600 shadow-xl">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-700">
                      <span className="text-4xl">📜</span>
                      <h4 className="text-3xl text-purple-200 font-bold">
                        The Prophecy
                      </h4>
                    </div>
                    <p className="text-purple-100 leading-relaxed text-2xl font-medium">
                      {destinyCard.description}
                    </p>
                  </div>
                </div>

              {/* Footer - Close Button */}
              <div className="p-8 border-t-4 border-purple-500">
                <Button
                  onClick={() => setIsDestinyModalOpen(false)}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-8 text-2xl shadow-lg hover:shadow-purple-500/50 transition-all border-4 border-purple-400"
                >
                  <span className="mr-3 text-3xl">✨</span>
                  Accept Your Fate
                  <span className="ml-3 text-3xl">✨</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
