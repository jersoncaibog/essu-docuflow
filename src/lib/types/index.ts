// ─── Enums ────────────────────────────────────────────────────────────────────

export type DocumentType =
	| 'TOR'
	| 'Diploma'
	| 'Certificate of Graduation'
	| 'Good Moral Certificate'
	| 'Certificate of Completion'
	| 'Grades Report';

export type RequestStatus =
	| 'pending'
	| 'processing'
	| 'ready'
	| 'completed'
	| 'rejected'
	| 'cancelled'
	| 'revision';

export type PaymentStatus = 'paid' | 'unpaid' | 'for-verification';

export type Priority = 'regular' | 'rush';

export type ClearanceStatus = 'cleared' | 'not-cleared' | 'with-balance' | 'pending';

export type NotificationType = 'request' | 'urgent' | 'task' | 'system';

export type TemplateStatus = 'active' | 'archived' | 'draft';

export type UserRole = 'staff' | 'student';

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface Request {
	id: string;
	studentId: string;
	studentName: string;
	program: string;
	documentType: DocumentType;
	status: RequestStatus;
	paymentStatus: PaymentStatus;
	priority: Priority;
	dateRequested: string;
	assignedStaff?: string;
	dateCompleted?: string;
	purpose?: string;
	numCopies?: number;
	notes?: string;
	rejectionReason?: string;
}

export interface Student {
	id: string;
	name: string;
	program: string;
	year: number;
	email: string;
	phone?: string;
	address?: string;
	clearanceStatus: ClearanceStatus;
	requestCount: number;
	dateOfBirth?: string;
	gender?: string;
}

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	isRead: boolean;
	isUrgent: boolean;
	date: string;
	actionItems?: string[];
	relatedRequestId?: string;
}

export interface DocumentTemplate {
	id: string;
	name: string;
	documentType: DocumentType;
	version: string;
	status: TemplateStatus;
	lastUpdated: string;
	updatedBy: string;
	description?: string;
}

export interface StaffMember {
	id: string;
	name: string;
	position: string;
	department: string;
	email: string;
	phone?: string;
	hireDate?: string;
	avatarInitials?: string;
}

export interface TimelineEvent {
	date: string;
	title: string;
	description?: string;
	status: 'completed' | 'current' | 'pending';
}

export interface TableColumn {
	key: string;
	label: string;
	sortable?: boolean;
	width?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
	role: UserRole;
	profile: StaffMember | Student;
}
