import type { DocumentTemplate } from '$lib/types';

export const mockTemplates: DocumentTemplate[] = [
	{
		id: 'TPL-001',
		name: 'Transcript of Records - Standard',
		documentType: 'TOR',
		version: '3.0',
		status: 'active',
		lastUpdated: '2024-01-10',
		updatedBy: 'Jane Doe',
		description: 'Standard TOR template with QR code verification and official ESSU letterhead.'
	},
	{
		id: 'TPL-002',
		name: 'Diploma Certificate - Bachelor',
		documentType: 'Diploma',
		version: '2.1',
		status: 'active',
		lastUpdated: '2023-12-15',
		updatedBy: 'John Smith',
		description: 'Official bachelor\'s degree diploma with university seal and signatories.'
	},
	{
		id: 'TPL-003',
		name: 'Good Moral Certificate - Standard',
		documentType: 'Good Moral Certificate',
		version: '1.5',
		status: 'active',
		lastUpdated: '2024-01-05',
		updatedBy: 'Jane Doe',
		description: 'Good moral character certificate for employment and graduate school applications.'
	},
	{
		id: 'TPL-004',
		name: 'Certificate of Graduation - Standard',
		documentType: 'Certificate of Graduation',
		version: '2.0',
		status: 'active',
		lastUpdated: '2023-11-20',
		updatedBy: 'John Smith',
		description: 'Official graduation certificate issued after degree completion.'
	},
	{
		id: 'TPL-005',
		name: 'TOR - Old Format (Legacy)',
		documentType: 'TOR',
		version: '2.0',
		status: 'archived',
		lastUpdated: '2023-06-01',
		updatedBy: 'Admin',
		description: 'Previous TOR format, archived after v3.0 approval.'
	}
];

export const templateVariables = [
	{ key: '{{student_name}}', description: 'Full name of the student' },
	{ key: '{{student_id}}', description: 'Student ID number' },
	{ key: '{{program}}', description: 'Degree program (e.g., BSIT)' },
	{ key: '{{year_graduated}}', description: 'Year of graduation' },
	{ key: '{{date_issued}}', description: 'Date the document was issued' },
	{ key: '{{control_number}}', description: 'Auto-generated control number' },
	{ key: '{{registrar_name}}', description: 'Name of the University Registrar' },
	{ key: '{{university_president}}', description: 'Name of the University President' }
];
