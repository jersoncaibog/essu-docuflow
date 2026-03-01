<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import { page } from '$app/stores';
	import { sidebarCollapsed } from '$lib/stores/sidebar';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	const staffNav = [
		{ label: 'Dashboard', icon: 'fa-solid fa-gauge-high', href: '/staff/dashboard' },
		{ label: 'All Requests', icon: 'fa-solid fa-list-check', href: '/staff/requests' },
		{ label: 'Pending Requests', icon: 'fa-solid fa-clock', href: '/staff/requests/pending' },
		{ label: 'Document Process', icon: 'fa-solid fa-gears', href: '/staff/documents/process' },
		{ label: 'Templates', icon: 'fa-solid fa-file-invoice', href: '/staff/documents/templates' },
		{ label: 'Student Registry', icon: 'fa-solid fa-users', href: '/staff/registry' },
		{ label: 'Reports', icon: 'fa-solid fa-chart-bar', href: '/staff/reports' },
		{ label: 'Notifications', icon: 'fa-regular fa-bell', href: '/staff/notifications' },
		{ label: 'My Profile', icon: 'fa-solid fa-circle-user', href: '/staff/profile' }
	];

	// Derive page title from current path
	const titleMap: Record<string, string> = {
		'/staff/dashboard': 'Dashboard',
		'/staff/requests': 'All Requests',
		'/staff/requests/pending': 'Pending Requests',
		'/staff/documents/process': 'Document Processing',
		'/staff/documents/templates': 'Document Templates',
		'/staff/registry': 'Student Registry',
		'/staff/reports': 'Reports & Analytics',
		'/staff/notifications': 'Notifications',
		'/staff/profile': 'My Profile'
	};

	const pageTitle = $derived(titleMap[$page.url.pathname] ?? 'Staff Portal');
	const collapsed = $derived($sidebarCollapsed);
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar items={staffNav} role="staff" />

	<!-- Main content area — offset by sidebar width -->
	<div
		class="flex-1 flex flex-col transition-all duration-300 {collapsed ? 'lg:ml-16' : 'lg:ml-60'}"
	>
		<TopBar title={pageTitle} notifHref="/staff/notifications" />

		<main class="flex-1 mt-16 p-6">
			{@render children()}
		</main>
	</div>
</div>
