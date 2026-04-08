export type AgreementStatus = "PENDING" | "COMPLETED" | "FAILED";
export type ParticipantRole = "CREATOR" | "PARTICIPANT";
export type ObligationStatus = "PENDING" | "DONE" | "FAILED";
export type ActivityAction = "CREATED" | "UPDATED" | "COMPLETED" | "FAILED";
export type DashboardFilter = "ALL" | AgreementStatus;

export interface UserSnippet {
  id: string;
  email: string;
  name: string;
  trustScore: number;
}

export interface AgreementParticipantDto {
  id: string;
  role: ParticipantRole;
  user: UserSnippet;
}

export interface ObligationDto {
  id: string;
  description: string;
  status: ObligationStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo: UserSnippet;
}

export interface ActivityLogDto {
  id: string;
  action: ActivityAction;
  details: string | null;
  timestamp: string;
  user: UserSnippet;
}

export interface AgreementSummaryDto {
  id: string;
  title: string;
  description: string;
  status: AgreementStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  participants: AgreementParticipantDto[];
  obligationsCount: number;
  completedObligationsCount: number;
  failedObligationsCount: number;
}

export interface AgreementDetailDto extends AgreementSummaryDto {
  creator: UserSnippet;
  obligations: ObligationDto[];
  activity: ActivityLogDto[];
}

export interface DashboardStatsDto {
  activeCount: number;
  completedCount: number;
  failedCount: number;
  totalCount: number;
  completionRate: number;
  viewerTrustScore: number;
}

export interface AgreementsResponseDto {
  agreements: AgreementSummaryDto[];
  stats: DashboardStatsDto;
}

export interface CreateAgreementPayload {
  title: string;
  description: string;
  dueDate: string;
  participantIds: string[];
  obligations: Array<{
    assignedToId: string;
    description: string;
  }>;
}

export interface UpdateObligationPayload {
  status: Exclude<ObligationStatus, "PENDING">;
}
