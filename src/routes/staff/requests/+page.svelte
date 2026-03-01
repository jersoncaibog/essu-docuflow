<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import FilterBar from '$lib/components/forms/FilterBar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Timeline from '$lib/components/ui/Timeline.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { mockRequests, requestStatusTimeline } from '$lib/data/requests';
	import type { Request } from '$lib/types';

	// Filter state
	let search = $state('');
	let filterValues = $state<Record<string, string>>({});
	let currentPage = $state(1);
	let itemsPerPage = $state(10);

	// Modal state
	let selectedRequest = $state<Request | null>(null);
	let detailOpen = $state(false);

	const filtered = $derived(
		mockRequests.filter((r) => {
			const q = search.toLowerCase();
			const matchSearch =
				!q ||
				r.studentName.toLowerCase().includes(q) ||
				r.id.toLowerCase().includes(q) ||
				r.studentId.toLowerCase().includes(q);
			const matchDoc = !filterValues.documentType || r.documentType === filterValues.documentType;
			const matchStatus = !filterValues.status || r.status === filterValues.status;
			const matchPayment = !filterValues.paymentStatus || r.paymentStatus === filterValues.paymentStatus;
			const matchProgram = !filterValues.program || r.program === filterValues.program;
			const matchPriority = !filterValues.priority || r.priority === filterValues.priority;
			return matchSearch && matchDoc && matchStatus && matchPayment && matchProgram && matchPriority;
		})
	);

	const paginated = $derived(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	function reset() {
		search = '';
		filterValues = {};
		currentPage = 1;
	}

	function viewDetail(req: Request) {
		selectedRequest = req;
		detailOpen = true;
	}

	const timeline = $derived(selectedRequest ? requestStatusTimeline(selectedRequest.id) : []);

	const filterDefs = [
		{
			key: 'documentType',
			placeholder: 'Document Type',
			options: [
				{ value: 'TOR', label: 'Transcript of Records' },
				{ value: 'Diploma', label: 'Diploma' },
				{ value: 'Certificate of Graduation', label: 'Certificate of Graduation' },
				{ value: 'Good Moral Certificate', label: 'Good Moral Certificate' }
			]
		},
		{
			key: 'status',
			placeholder: 'Status',
			options: [
				{ value: 'pending', label: 'Pending' },
				{ value: 'processing', label: 'Processing' },
				{ value: 'ready', label: 'Ready' },
				{ value: 'completed', label: 'Completed' },
				{ value: 'rejected', label: 'Rejected' },
				{ value: 'cancelled', label: 'Cancelled' }
			]
		},
		{
			key: 'paymentStatus',
			placeholder: 'Payment',
			options: [
				{ value: 'paid', label: 'Paid' },
				{ value: 'unpaid', label: 'Unpaid' },
				{ value: 'for-verification', label: 'For Verification' }
			]
		},
		{
			key: 'program',
			placeholder: 'Program',
			options: [
				{ value: 'BSIT', label: 'BSIT' },
				{ value: 'BSED', label: 'BSED' },
				{ value: 'BSCS', label: 'BSCS' },
				{ value: 'BSBM', label: 'BSBM' }
			]
		},
		{
			key: 'priority',
			placeholder: 'Priority',
			options: [
				{ value: 'regular', label: 'Regular' },
				{ value: 'rush', label: 'Rush' }
			]
		}
	];
</script>

<div class="space-y-5">
	<!-- Stats -->
	<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
		<StatCard label="Pending" value={mockRequests.filter((r) => r.status === 'pending').length} icon="fa-solid fa-clock" color="orange" />
		<StatCard label="Processing" value={mockRequests.filter((r) => r.status === 'processing').length} icon="fa-solid fa-gears" color="blue" />
		<StatCard label="Completed" value={mockRequests.filter((r) => r.status === 'completed').length} icon="fa-solid fa-circle-check" color="green" />
		<StatCard label="Rejected" value={mockRequests.filter((r) => r.status === 'rejected').length} icon="fa-solid fa-circle-xmark" color="red" />
	</div>

	<!-- Filter bar -->
	<FilterBar
		searchPlaceholder="Search by name, request ID or student ID..."
		searchValue={search}
		filters={filterDefs}
		filterValues={filterValues}
		onSearch={(v) => { search = v; currentPage = 1; }}
		onFilterChange={(k, v) => { filterValues = { ...filterValues, [k]: v }; currentPage = 1; }}
		onReset={reset}
	/>

	<!-- Table -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
			<p class="text-sm text-gray-500">
				<span class="font-medium text-gray-800">{filtered.length}</span> requests found
			</p>
			<div class="flex gap-2">
				<button class="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
					<i class="fa-solid fa-download text-xs"></i> Export CSV
				</button>
				<button class="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
					<i class="fa-solid fa-print text-xs"></i> Print
				</button>
			</div>
		</div>

		{#if paginated.length === 0}
			<EmptyState message="No requests match your filters" icon="fa-solid fa-filter-circle-xmark" />
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Request ID', 'Student', 'Program', 'Document', 'Date', 'Payment', 'Status', 'Priority', 'Assigned', 'Actions'] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each paginated as req}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{req.id}</td>
								<td class="px-4 py-3 whitespace-nowrap">
									<p class="font-medium text-gray-800">{req.studentName}</p>
									<p class="text-xs text-gray-400">{req.studentId}</p>
								</td>
								<td class="px-4 py-3 text-gray-600">{req.program}</td>
								<td class="px-4 py-3 text-gray-700 whitespace-nowrap">{req.documentType}</td>
								<td class="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{req.dateRequested}</td>
								<td class="px-4 py-3"><Badge value={req.paymentStatus} /></td>
								<td class="px-4 py-3"><Badge value={req.status} /></td>
								<td class="px-4 py-3"><Badge value={req.priority} /></td>
								<td class="px-4 py-3 text-gray-500 text-xs">{req.assignedStaff ?? '—'}</td>
								<td class="px-4 py-3">
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
			<div class="px-5 py-3 border-t border-gray-100">
				<Pagination
					totalItems={filtered.length}
					{itemsPerPage}
					{currentPage}
					onPageChange={(p) => (currentPage = p)}
					onItemsPerPageChange={(n) => { itemsPerPage = n; currentPage = 1; }}
				/>
			</div>
		{/if}
	</div>
</div>

<!-- Detail Modal -->
<Modal open={detailOpen} title="Request Details" size="lg" onclose={() => (detailOpen = false)}>
	{#snippet body()}
		{#if selectedRequest}
			<div class="space-y-5">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-xs text-gray-400 mb-0.5">Request ID</p>
						<p class="font-mono font-semibold text-gray-700">{selectedRequest.id}</p>
					</div>
					<div>
						<p class="text-xs text-gray-400 mb-0.5">Date Requested</p>
						<p class="text-gray-700">{selectedRequest.dateRequested}</p>
					</div>
				</div>

				<div class="border-t border-gray-100 pt-4">
					<h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Student Information</h3>
					<div class="grid grid-cols-2 gap-3 text-sm">
						<div><p class="text-xs text-gray-400">Full Name</p><p class="font-medium">{selectedRequest.studentName}</p></div>
						<div><p class="text-xs text-gray-400">Student ID</p><p class="font-medium">{selectedRequest.studentId}</p></div>
						<div><p class="text-xs text-gray-400">Program</p><p class="font-medium">{selectedRequest.program}</p></div>
					</div>
				</div>

				<div class="border-t border-gray-100 pt-4">
					<h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Document Information</h3>
					<div class="grid grid-cols-2 gap-3 text-sm">
						<div><p class="text-xs text-gray-400">Document Type</p><p class="font-medium">{selectedRequest.documentType}</p></div>
						<div><p class="text-xs text-gray-400">Copies</p><p class="font-medium">{selectedRequest.numCopies ?? 1}</p></div>
						<div><p class="text-xs text-gray-400">Purpose</p><p class="font-medium">{selectedRequest.purpose ?? '—'}</p></div>
						<div><p class="text-xs text-gray-400">Priority</p><Badge value={selectedRequest.priority} /></div>
					</div>
				</div>

				<div class="border-t border-gray-100 pt-4">
					<h3 class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Status</h3>
					<div class="grid grid-cols-2 gap-3 text-sm mb-4">
						<div><p class="text-xs text-gray-400">Request Status</p><Badge value={selectedRequest.status} /></div>
						<div><p class="text-xs text-gray-400">Payment Status</p><Badge value={selectedRequest.paymentStatus} /></div>
						{#if selectedRequest.assignedStaff}
							<div><p class="text-xs text-gray-400">Assigned Staff</p><p class="font-medium">{selectedRequest.assignedStaff}</p></div>
						{/if}
						{#if selectedRequest.rejectionReason}
							<div class="col-span-2">
								<p class="text-xs text-gray-400">Rejection Reason</p>
								<p class="text-red-600 font-medium">{selectedRequest.rejectionReason}</p>
							</div>
						{/if}
					</div>
					<Timeline events={timeline} />
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<button
			onclick={() => (detailOpen = false)}
			class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
		>
			Close
		</button>
	{/snippet}
</Modal>
