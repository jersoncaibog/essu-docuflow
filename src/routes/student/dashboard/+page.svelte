<script lang="ts">
	import { mockRequests } from '$lib/data/requests';
	import { mockStudentNotifications } from '$lib/data/notifications';
	import Badge from '$lib/components/ui/Badge.svelte';

	// Simulate student's data
	const studentId = '2022-00123';
	const myRequests = $derived(mockRequests.filter((r) => r.studentId === studentId));
	const activeRequests = $derived(myRequests.filter((r) => !['completed', 'cancelled', 'rejected'].includes(r.status)));
	const myNotifs = $derived(mockStudentNotifications.filter((n) => !n.isRead).slice(0, 4));

	const clearanceItems = [
		{ label: 'Library', done: true },
		{ label: 'Accounting', done: true },
		{ label: 'Department', done: false },
		{ label: "Registrar's Office", done: false }
	];

	const clearanceDone = $derived(clearanceItems.filter((c) => c.done).length);
	const clearancePct = $derived(Math.round((clearanceDone / clearanceItems.length) * 100));

	const quickActions = [
		{ icon: 'fa-solid fa-file-circle-plus', label: 'Request Document', href: '/student/request', color: 'bg-essu-green text-white hover:bg-essu-green-mid' },
		{ icon: 'fa-solid fa-folder-open', label: 'My Documents', href: '/student/documents', color: 'bg-blue-600 text-white hover:bg-blue-700' },
		{ icon: 'fa-regular fa-bell', label: 'Notifications', href: '/student/notifications', color: 'bg-purple-600 text-white hover:bg-purple-700' },
		{ icon: 'fa-solid fa-circle-user', label: 'My Profile', href: '/student/profile', color: 'bg-gray-700 text-white hover:bg-gray-800' }
	];
</script>

<div class="space-y-5">
	<!-- Welcome banner -->
	<div class="bg-gradient-to-r from-essu-green to-essu-green-mid rounded-2xl p-6 text-white">
		<p class="text-white/80 text-sm mb-1">Welcome back,</p>
		<h2 class="text-2xl font-bold">Juan Dela Cruz</h2>
		<p class="text-white/70 text-sm mt-1">BSIT · Year 4 · ID: 2022-00123</p>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
		<!-- Active Requests -->
		<div class="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
				<div>
					<h3 class="font-semibold text-gray-800">Active Document Requests</h3>
					<p class="text-xs text-gray-400 mt-0.5">{activeRequests.length} in progress</p>
				</div>
				<a href="/student/documents" class="text-sm text-essu-green font-medium hover:underline">
					View all <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
				</a>
			</div>

			{#if activeRequests.length === 0}
				<div class="py-12 text-center">
					<i class="fa-solid fa-file-circle-plus text-3xl text-gray-200 mb-3"></i>
					<p class="text-sm text-gray-400">No active requests</p>
					<a href="/student/request" class="mt-3 inline-block text-sm text-essu-green font-medium hover:underline">
						Request a document →
					</a>
				</div>
			{:else}
				<div class="divide-y divide-gray-50">
					{#each activeRequests as req}
						<div class="flex items-center gap-4 px-5 py-3.5">
							<div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
								<i class="fa-solid fa-file text-blue-500 text-sm"></i>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-800">{req.documentType}</p>
								<p class="text-xs text-gray-400">{req.id} · {req.dateRequested}</p>
							</div>
							<div class="flex items-center gap-2 shrink-0">
								<Badge value={req.priority} size="sm" />
								<Badge value={req.status} size="sm" />
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Right column -->
		<div class="space-y-4">
			<!-- Clearance Progress -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-semibold text-gray-800">Clearance Status</h3>
					<span class="text-sm font-bold text-essu-green">{clearancePct}%</span>
				</div>

				<!-- Progress ring (simplified as bar) -->
				<div class="w-full bg-gray-100 rounded-full h-2 mb-4">
					<div class="bg-essu-green h-2 rounded-full transition-all" style="width: {clearancePct}%"></div>
				</div>

				<div class="space-y-2">
					{#each clearanceItems as item}
						<div class="flex items-center gap-2 text-sm">
							<i class="fa-solid {item.done ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-gray-300'} shrink-0"></i>
							<span class="{item.done ? 'text-gray-700' : 'text-gray-400'}">{item.label}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Notifications snippet -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
				<div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
					<h3 class="font-semibold text-gray-800 text-sm">Recent Notifications</h3>
					<a href="/student/notifications" class="text-xs text-essu-green hover:underline">View all</a>
				</div>
				{#if myNotifs.length === 0}
					<p class="text-sm text-gray-400 text-center py-6">No new notifications</p>
				{:else}
					<div class="divide-y divide-gray-50">
						{#each myNotifs as notif}
							<div class="flex items-start gap-2.5 px-4 py-3">
								<span class="w-1.5 h-1.5 bg-essu-green rounded-full mt-1.5 shrink-0"></span>
								<div class="min-w-0">
									<p class="text-xs font-medium text-gray-800 leading-tight">{notif.title}</p>
									<p class="text-xs text-gray-400 mt-0.5">{notif.date}</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Quick Actions -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
				<h3 class="font-semibold text-gray-800 mb-3 text-sm">Quick Actions</h3>
				<div class="grid grid-cols-2 gap-2">
					{#each quickActions as action}
						<a
							href={action.href}
							class="{action.color} flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-colors"
						>
							<i class="{action.icon} text-lg"></i>
							<span class="text-xs font-medium leading-tight">{action.label}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
