import { writable } from 'svelte/store';
import type { AuthUser } from '$lib/types';

// Mock auth state — replace with real session logic later
export const currentUser = writable<AuthUser | null>({
	role: 'staff',
	profile: {
		id: 'STAFF-001',
		name: 'Admin User',
		position: 'Office Administrator',
		department: 'Registrar',
		email: 'admin@essu.edu.ph',
		phone: '09123456789',
		avatarInitials: 'AU'
	}
});

export const mockStudentUser: AuthUser = {
	role: 'student',
	profile: {
		id: '2022-00123',
		name: 'Juan Dela Cruz',
		program: 'BSIT',
		year: 4,
		email: 'juan.delacruz@essu.edu.ph',
		clearanceStatus: 'cleared',
		requestCount: 3
	}
};

export const mockStaffUser: AuthUser = {
	role: 'staff',
	profile: {
		id: 'STAFF-001',
		name: 'Admin User',
		position: 'Office Administrator',
		department: 'Registrar',
		email: 'admin@essu.edu.ph',
		avatarInitials: 'AU'
	}
};
