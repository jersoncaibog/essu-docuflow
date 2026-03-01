<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Timeline from '$lib/components/ui/Timeline.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { mockRequests, requestStatusTimeline } from '$lib/data/requests';
	import type { Request } from '$lib/types';

	const studentId = '2022-00123';
	const myRequests = $derived(mockRequests.filter((r) => r.studentId === studentId));

	let activeTab = $state<'submitted' | 'approved' | 'history'>('submitted');
	let search = $state('');
	let statusFilter = $state('');
	let selectedRequest = $state<Request | null>(null);
	let detailOpen = $state(false);

	const submitted = $derived(
		myRequests.filter((r) => {
			const matchStatus = !statusFilter || r.status === statusFilter;
			const q = search.toLowerCase();
			const matchSearch = !q || r.id.toLowerCase().includes(q) || r.documentType.toLowerCase().includes(q);
			return matchStatus && matchSearch;
		})
	);

	const approved = $derived(myRequests.filter((r) => r.status === 'completed' || r.status === 'ready'));
	const history = $derived(myRequests.filter((r) => ['completed', 'rejected', 'cancelled'].includes(r.status)));

	const timeline = $derived(selectedRequest ? requestStatusTimeline(selectedRequest.id) : []);

	function viewDetail(req: Request) {
		selectedRequest = req;
		detailOpen = true;
	}
</script>

<div class="space-y-5">
	<!-- Stats -->
	<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
		<StatCard label="Submitted" value={myRequests.length} icon="fa-solid fa-file-lines" color="blue" />
		<StatCard label="Approved" value={approved.length} icon="fa-solid fa-circle-check" color="green" />
		<StatCard label="Pending" value={myRequests.filter((r) => r.status === 'pending').length} icon="fa-solid fa-clock" color="orange" />
		<StatCard label="For Revision" value={myRequests.filter((r) => r.status === 'revision').length} icon="fa-solid fa-rotate" color="red" />
	</div>

	<!-- Tab switcher -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="flex border-b border-gray-100">
			{#each [
				{ key: 'submitted', label: 'Submitted', count: myRequests.length },
				{ key: 'approved', label: 'Approved & Ready', count: approved.length },
				{ key: 'history', label: 'History', count: history.length }
			] as tab}
				<button
					onclick={() => (activeTab = tab.key as typeof activeTab)}
					class="flex-1 py-3.5 text-sm font-medium border-b-2 transition-colors
						{activeTab === tab.key ? 'border-essu-green text-essu-green' : 'border-transparent text-gray-500 hover:text-gray-700'}"
				>
					{tab.label}
					{#if tab.count > 0}
						<span class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full
							{activeTab === tab.key ? 'bg-essu-green text-white' : 'bg-gray-100 text-gray-500'}">
							{tab.count}
						</span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Filters -->
		<div class="flex items-center gap-3 px-5 py-3 border-b border-gray-50 bg-gray-50/50">
			<div class="relative flex-1 max-w-64">
				<i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
				<input
					type="text"
					bind:value={search}
					placeholder="Search by ID or document..."
					class="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30"
				/>
			</div>
			{#if activeTab === 'submitted'}
				<select bind:value={statusFilter} class="py-2 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30">
					<option value="">All Status</option>
					<option value="pending">Pending</option>
					<option value="processing">Processing</option>
					<option value="revision">For Revision</option>
					<option value="rejected">Rejected</option>
				</select>
			{/if}
		</div>

		<!-- Content -->
		{#if activeTab === 'submitted'}
			{#if submitted.length === 0}
				<EmptyState message="No requests found" description="Try adjusting your filters." />
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="bg-gray-50 border-b border-gray-100">
							<tr>
								{#each ['Request ID', 'Document', 'Date Submitted', 'Payment', 'Status', 'Priority', 'Actions'] as col}
									<th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50">
							{#each submitted as req}
								<tr class="hover:bg-gray-50 transition-colors">
									<td class="px-5 py-3 font-mono text-xs text-gray-500">{req.id}</td>
									<td class="px-5 py-3 font-medium text-gray-800">{req.documentType}</td>
									<td class="px-5 py-3 text-xs text-gray-500">{req.dateRequested}</td>
									<td class="px-5 py-3"><Badge value={req.paymentStatus} /></td>
									<td class="px-5 py-3"><Badge value={req.status} /></td>
									<td class="px-5 py-3"><Badge value={req.priority} /></td>
									<td class="px-5 py-3">
										<button
											onclick={() => viewDetail(req)}
											class="text-xs px-2.5 py-1.5 bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors"
										>
											<i class="fa-solid fa-eye mr-1"></i>View
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

		{:else if activeTab === 'approved'}
			{#if approved.length === 0}
				<EmptyState message="No approved documents yet" />
			{:else}
				<div class="divide-y divide-gray-50">
					{#each approved as req}
						<div class="flex items-center gap-4 px-5 py-4">
							<div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
								<i class="fa-solid fa-file-circle-check text-green-600"></i>
							</div>
							<div class="flex-1">
								<p class="font-medium text-gray-800">{req.documentType}</p>
								<p class="text-xs text-gray-400">{req.id} · Ready since {req.dateCompleted ?? req.dateRequested}</p>
							</div>
							<div class="flex items-center gap-2">
								<Badge value={req.status} />
								<button
									onclick={() => viewDetail(req)}
									class="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
								>
									Details
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}

		{:else}
			{#if history.length === 0}
				<EmptyState message="No request history" />
			{:else}
				<div class="divide-y divide-gray-50">
					{#each history as req}
						<div class="flex items-center gap-4 px-5 py-3">
							<div class="flex-1">
								<p class="text-sm font-medium text-gray-700">{req.documentType}</p>
								<p class="text-xs text-gray-400">{req.id} · {req.dateCompleted ?? req.dateRequested}</p>
							</div>
							<Badge value={req.status} />
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Detail Modal -->
<Modal open={detailOpen} title="Request Details" size="lg" onclose={() => (detailOpen = false)}>
	{#snippet body()}
		{#if selectedRequest}
			<div class="space-y-5">
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div><p class="text-xs text-gray-400">Request ID</p><p class="font-mono font-semibold">{selectedRequest.id}</p></div>
					<div><p class="text-xs text-gray-400">Date Submitted</p><p class="font-medium">{selectedRequest.dateRequested}</p></div>
					<div><p class="text-xs text-gray-400">Document Type</p><p class="font-medium">{selectedRequest.documentType}</p></div>
					<div><p class="text-xs text-gray-400">Copies</p><p class="font-medium">{selectedRequest.numCopies ?? 1}</p></div>
					<div><p class="text-xs text-gray-400">Purpose</p><p class="font-medium">{selectedRequest.purpose ?? '—'}</p></div>
					<div><p class="text-xs text-gray-400">Status</p><Badge value={selectedRequest.status} /></div>
					<div><p class="text-xs text-gray-400">Payment</p><Badge value={selectedRequest.paymentStatus} /></div>
					<div><p class="text-xs text-gray-400">Priority</p><Badge value={selectedRequest.priority} /></div>
					{#if selectedRequest.rejectionReason}
						<div class="col-span-2 p-3 bg-red-50 border border-red-200 rounded-lg">
							<p class="text-xs text-red-400 mb-0.5">Rejection Reason</p>
							<p class="text-sm text-red-700 font-medium">{selectedRequest.rejectionReason}</p>
						</div>
					{/if}
				</div>

				<div class="border-t border-gray-100 pt-4">
					<p class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Request Timeline</p>
					<Timeline events={timeline} />
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		{#if selectedRequest?.status === 'revision'}
			<button class="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
				<i class="fa-solid fa-upload mr-1"></i>Re-upload Files
			</button>
		{/if}
		<button onclick={() => (detailOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Close</button>
	{/snippet}
</Modal>
