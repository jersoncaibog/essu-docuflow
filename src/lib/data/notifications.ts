import type { Notification } from '$lib/types';

export const mockStaffNotifications: Notification[] = [
	{
		id: 'NOTIF-001',
		type: 'request',
		title: 'New Document Request Submitted',
		message: 'Juan Dela Cruz (2022-00123) submitted a new TOR request. Payment receipt is attached.',
		isRead: false,
		isUrgent: false,
		date: '2024-01-18 09:30',
		actionItems: ['Review request', 'Verify payment'],
		relatedRequestId: 'REQ-2024-001'
	},
	{
		id: 'NOTIF-002',
		type: 'urgent',
		title: 'Rush Request Needs Immediate Action',
		message: 'Maria Santos (2021-00456) has a RUSH diploma request. Processing deadline: Today 5PM.',
		isRead: false,
		isUrgent: true,
		date: '2024-01-18 08:15',
		actionItems: ['Process immediately', 'Notify student when ready'],
		relatedRequestId: 'REQ-2024-002'
	},
	{
		id: 'NOTIF-003',
		type: 'task',
		title: 'Clearance Verification Required',
		message: 'Roberto Cruz (2022-00987) has a pending clearance issue with the Accounting Office.',
		isRead: false,
		isUrgent: false,
		date: '2024-01-17 14:00',
		actionItems: ['Contact Accounting Office', 'Update clearance status']
	},
	{
		id: 'NOTIF-004',
		type: 'system',
		title: 'System Maintenance Scheduled',
		message: 'The document management system will undergo maintenance on Jan 20, 2024 from 12AM–4AM.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-16 10:00'
	},
	{
		id: 'NOTIF-005',
		type: 'urgent',
		title: 'Payment Discrepancy Detected',
		message: 'Payment verification for REQ-2024-009 shows discrepancy. Cashier confirmation needed.',
		isRead: false,
		isUrgent: true,
		date: '2024-01-17 16:45',
		actionItems: ['Contact cashier', 'Verify payment amount'],
		relatedRequestId: 'REQ-2024-009'
	},
	{
		id: 'NOTIF-006',
		type: 'request',
		title: 'Document Ready for Release',
		message: 'Luisa Fernandez (2020-00111) Good Moral Certificate is ready for release. Notify student.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-16 15:00',
		relatedRequestId: 'REQ-2024-006'
	},
	{
		id: 'NOTIF-007',
		type: 'urgent',
		title: 'Overdue Request Alert',
		message: 'REQ-2024-005 (Carlos Mendoza) has been pending for 3 days without payment. Action required.',
		isRead: false,
		isUrgent: true,
		date: '2024-01-18 07:00',
		actionItems: ['Contact student', 'Update request status'],
		relatedRequestId: 'REQ-2024-005'
	},
	{
		id: 'NOTIF-008',
		type: 'task',
		title: 'Monthly Report Due',
		message: 'The January 2024 document processing report is due by January 31. Please prepare the data.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-15 09:00',
		actionItems: ['Gather statistics', 'Generate report', 'Submit to director']
	},
	{
		id: 'NOTIF-009',
		type: 'system',
		title: 'New Template Version Available',
		message: 'TOR Template v2.1 has been uploaded and is pending your review before activation.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-14 11:30',
		actionItems: ['Review template', 'Approve or reject']
	}
];

export const mockStudentNotifications: Notification[] = [
	{
		id: 'SNOTIF-001',
		type: 'request',
		title: 'TOR Request Approved',
		message: 'Your Transcript of Records request (REQ-2024-001) has been approved. Processing is underway.',
		isRead: false,
		isUrgent: false,
		date: '2024-01-17 10:00',
		relatedRequestId: 'REQ-2024-001'
	},
	{
		id: 'SNOTIF-002',
		type: 'urgent',
		title: 'Payment Receipt Missing',
		message: 'Your diploma request (REQ-2024-002) was rejected due to a missing payment receipt. Please re-upload.',
		isRead: false,
		isUrgent: true,
		date: '2024-01-16 14:30',
		actionItems: ['Re-upload payment receipt'],
		relatedRequestId: 'REQ-2024-002'
	},
	{
		id: 'SNOTIF-003',
		type: 'task',
		title: 'Department Clearance Pending',
		message: 'Your department clearance is still pending. Please visit the IT Department to complete it.',
		isRead: false,
		isUrgent: false,
		date: '2024-01-15 09:00',
		actionItems: ['Visit IT Department', 'Complete clearance form']
	},
	{
		id: 'SNOTIF-004',
		type: 'system',
		title: 'System Maintenance Notice',
		message: 'The student portal will be down for maintenance on Jan 20, 2024 from 12AM–4AM.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-14 08:00'
	},
	{
		id: 'SNOTIF-005',
		type: 'request',
		title: 'Finance Clearance Completed',
		message: 'Your Finance/Accounting clearance has been verified. No outstanding balance found.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-13 13:00'
	},
	{
		id: 'SNOTIF-006',
		type: 'request',
		title: 'Library Clearance Approved',
		message: 'Your Library clearance has been approved. You have no outstanding library obligations.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-12 11:00'
	},
	{
		id: 'SNOTIF-007',
		type: 'system',
		title: 'New Feature Available',
		message: 'You can now track your request status in real-time from the My Documents page.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-10 09:00'
	},
	{
		id: 'SNOTIF-008',
		type: 'request',
		title: 'Request Under Review',
		message: 'Your Good Moral Certificate request (REQ-2024-003) is currently under staff review.',
		isRead: true,
		isUrgent: false,
		date: '2024-01-09 14:00',
		relatedRequestId: 'REQ-2024-003'
	},
	{
		id: 'SNOTIF-009',
		type: 'urgent',
		title: 'Document Quality Issue',
		message: 'The uploaded clearance form for REQ-2024-003 is illegible. Please re-upload a clear copy.',
		isRead: false,
		isUrgent: true,
		date: '2024-01-18 08:00',
		actionItems: ['Re-upload clearance form'],
		relatedRequestId: 'REQ-2024-003'
	}
];
