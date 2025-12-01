export type User = {
  id: string
  email: string
  name?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Organization = {
  id: string
  name: string
  slug?: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export type Role = 'Owner' | 'Member'

export type OrganizationMember = {
  id: string
  organizationId: string
  userId: string
  role: Role
  joinedAt: Date
  user?: User
  organization?: Organization
}

export type SectionType = 
  | 'TableOfContents'
  | 'ExecutiveSummary'
  | 'TechnicalApproach'
  | 'Design'
  | 'Capabilities'
  | 'FocusDocument'
  | 'Narrative'

export type Status = 'Pending' | 'InProgress' | 'Completed'

export type Reviewer = 'Assim' | 'Bini' | 'Mami'

export type Outline = {
  id: string
  organizationId: string
  header: string
  sectionType: SectionType
  status: Status
  target: number
  limit: number
  reviewer: Reviewer
  createdAt: Date
  updatedAt: Date
}

export type Invitation = {
  id: string
  organizationId: string
  email: string
  role: Role
  invitedBy: string
  token: string
  expiresAt: Date
  acceptedAt?: Date | null
  createdAt: Date
}
