<script lang="ts">
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { mockRequests } from '$lib/data/requests';
	import { mockStaffNotifications } from '$lib/data/notifications';

	const pendingRequests = $derived(mockRequests.filter((r) => r.status === 'pending'));
	const processingCount = $derived(mockRequests.filter((r) => r.status === 'processing').length);
	const approvedCount = $derived(mockRequests.filter((r) => r.status === 'completed').length);
	const releasedCount = $derived(mockRequests.filter((r) => r.status === 'ready').length);

	const recentActivity = $derived(
		mockStaffNotifications.slice(0, 5).map((n) => ({
			...n,
			icon: n.type === 'request' ? 'fa-solid fa-file-circle-check' :
				n.type === 'urgent' ? 'fa-solid fa-triangle-exclamation' :
				n.type === 'task' ? 'fa-solid fa-clipboard-list' : 'fa-solid fa-gear',
			iconColor: n.type === 'urgent' ? 'text-red-500 bg-red-50' :
				n.type === 'request' ? 'text-blue-500 bg-blue-50' :
				n.type === 'task' ? 'text-purple-500 bg-purple-50' : 'text-gray-500 bg-gray-50'
		}))
	);

	const quickTools = [
		{ icon: 'fa-solid fa-print', label: 'Bulk Print', color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
		{ icon: 'fa-solid fa-file-export', label: 'Export Report', color: 'text-green-600', bg: 'bg-green-50 hover:bg-green-100' },
		{ icon: 'fa-solid fa-bell', label: 'Send Notifications', color: 'text-yellow-600', bg: 'bg-yellow-50 hover:bg-yellow-100' },
		{ icon: 'fa-solid fa-chart-simple', label: 'Generate Stats', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100' },
		{ icon: 'fa-solid fa-calendar-check', label: 'Schedule Review', color: 'text-teal-600', bg: 'bg-teal-50 hover:bg-teal-100' },
		{ icon: 'fa-solid fa-gear', label: 'Settings', color: 'text-gray-600', bg: 'bg-gray-50 hover:bg-gray-100' }
	];
</script>

<div class="space-y-6">
	<!-- Stats -->
	<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
		<StatCard label="Total Applicants" value="1,240" icon="fa-solid fa-users" color="blue" />
		<StatCard label="Released Documents" value="303" icon="fa-solid fa-file-circle-check" color="green" />
		<StatCard label="Pending Requests" value={pendingRequests.length} icon="fa-solid fa-clock" color="orange" />
		<StatCard label="Approved Requests" value={approvedCount} icon="fa-solid fa-circle-check" color="teal" />
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
		<!-- Pending approval queue -->
		<div class="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
				<div>
					<h2 class="font-semibold text-gray-800">Pending Approval Queue</h2>
					<p class="text-xs text-gray-400 mt-0.5">{pendingRequests.length} requests awaiting action</p>
				</div>
				<a
					href="/staff/requests/pending"
					class="text-sm text-essu-green font-medium hover:underline flex items-center gap-1"
				>
					View all <i class="fa-solid fa-arrow-right text-xs"></i>
				</a>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Request ID', 'Student', 'Document', 'Priority', 'Payment', 'Action'] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each pendingRequests.slice(0, 5) as req}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-mono text-xs text-gray-500">{req.id}</td>
								<td class="px-4 py-3">
									<p class="font-medium text-gray-800 leading-tight">{req.studentName}</p>
									<p class="text-xs text-gray-400">{req.studentId} · {req.program}</p>
								</td>
								<td class="px-4 py-3 text-gray-600">{req.documentType}</td>
								<td class="px-4 py-3"><Badge value={req.priority} /></td>
								<td class="px-4 py-3"><Badge value={req.paymentStatus} /></td>
								<td class="px-4 py-3">
									<a
										href="/staff/requests/pending"
										class="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors"
									>
										<i class="fa-solid fa-eye text-[10px]"></i>
										Review
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Right column -->
		<div class="space-y-4">
			<!-- Recent Activity -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="px-5 py-4 border-b border-gray-100">
					<h2 class="font-semibold text-gray-800">Recent Activity</h2>
				</div>
				<div class="divide-y divide-gray-50">
					{#each recentActivity as item}
						<div class="flex items-start gap-3 px-5 py-3">
							<div class="w-8 h-8 rounded-lg {item.iconColor} flex items-center justify-center shrink-0 mt-0.5">
								<i class="{item.icon} text-xs"></i>
							</div>
							<div class="min-w-0">
								<p class="text-sm font-medium text-gray-700 leading-tight truncate">{item.title}</p>
								<p class="text-xs text-gray-400 mt-0.5">{item.date}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Quick Tools -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="px-5 py-4 border-b border-gray-100">
					<h2 class="font-semibold text-gray-800">Quick Tools</h2>
				</div>
				<div class="grid grid-cols-3 gap-2 p-4">
					{#each quickTools as tool}
						<button
							class="{tool.bg} {tool.color} flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-colors"
						>
							<i class="{tool.icon} text-lg"></i>
							<span class="text-xs font-medium leading-tight">{tool.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
