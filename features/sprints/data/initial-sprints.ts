import type { Sprint } from "@/lib/types"

/**
 * Initial seed data for sprints
 */
export const initialSprints: Sprint[] = [
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
  {
    id: "SPR-003",
    name: "Enhancement Sprint",
    status: "planned",
    createdAt: new Date("2024-01-20"),
  },
]

