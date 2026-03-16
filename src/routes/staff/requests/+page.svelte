<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	type Req = {
		request_id: string; document_name: string; student_name: string;
		student_code: string; program: string; status: string;
		purpose: string; date_requested: string;
	};

	const requests = data.requests as Req[];

	let search = $state('');
	let filterStatus = $state('');

	const filtered = $derived(
		requests.filter(r => {
			const q = search.toLowerCase();
			const matchSearch = !q ||
				r.student_name.toLowerCase().includes(q) ||
				r.request_id.toLowerCase().includes(q) ||
				r.student_code?.toLowerCase().includes(q) ||
				r.document_name.toLowerCase().includes(q);
			const matchStatus = !filterStatus || r.status === filterStatus;
			return matchSearch && matchStatus;
		})
	);

	const statusCounts = $derived({
		pending: requests.filter(r => r.status === 'Pending').length,
		correction: requests.filter(r => r.status === 'Correction Requested').length,
		approved: requests.filter(r => r.status === 'Approved').length,
		rejected: requests.filter(r => r.status === 'Rejected').length,
	});
</script>

<div class="space-y-5">
	<!-- Stats -->
	<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
		<StatCard label="Pending" value={statusCounts.pending} icon="fa-solid fa-clock" color="orange" />
		<StatCard label="Correction Requested" value={statusCounts.correction} icon="fa-solid fa-rotate-left" color="gold" />
		<StatCard label="Approved" value={statusCounts.approved} icon="fa-solid fa-circle-check" color="green" />
		<StatCard label="Rejected" value={statusCounts.rejected} icon="fa-solid fa-circle-xmark" color="red" />
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-3">
		<div class="relative flex-1">
			<i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
			<input
				bind:value={search}
				type="text"
				placeholder="Search by name, request ID or student ID..."
				class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30"
			/>
		</div>
		<select bind:value={filterStatus} class="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30">
			<option value="">All Statuses</option>
			<option value="Pending">Pending</option>
			<option value="Correction Requested">Correction Requested</option>
			<option value="Approved">Approved</option>
			<option value="Rejected">Rejected</option>
		</select>
		{#if search || filterStatus}
			<button onclick={() => { search = ''; filterStatus = ''; }} class="px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
				<i class="fa-solid fa-xmark mr-1"></i>Clear
			</button>
		{/if}
	</div>

	<!-- Table -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="px-5 py-4 border-b border-gray-100">
			<p class="text-sm text-gray-500">
				<span class="font-medium text-gray-800">{filtered.length}</span> requests found
			</p>
		</div>

		{#if filtered.length === 0}
			<EmptyState message="No requests found" icon="fa-solid fa-inbox" />
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Request ID', 'Student', 'Program', 'Document', 'Date', 'Status', ''] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each filtered as req}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{req.request_id}</td>
								<td class="px-4 py-3 whitespace-nowrap">
									<p class="font-medium text-gray-800">{req.student_name}</p>
									<p class="text-xs text-gray-400">{req.student_code ?? '—'}</p>
								</td>
								<td class="px-4 py-3 text-gray-600">{req.program ?? '—'}</td>
								<td class="px-4 py-3 text-gray-700 whitespace-nowrap">{req.document_name}</td>
								<td class="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
									{new Date(req.date_requested).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
								</td>
								<td class="px-4 py-3"><Badge value={req.status.toLowerCase()} /></td>
								<td class="px-4 py-3">
									<a
										href="/staff/requests/{req.request_id}"
										class="text-xs px-2.5 py-1.5 bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors"
									>
										<i class="fa-solid fa-eye mr-1"></i>Review
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
