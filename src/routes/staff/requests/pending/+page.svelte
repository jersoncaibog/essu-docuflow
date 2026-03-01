<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import FilterBar from '$lib/components/forms/FilterBar.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import FileUpload from '$lib/components/forms/FileUpload.svelte';
	import { mockRequests } from '$lib/data/requests';
	import type { Request } from '$lib/types';

	let search = $state('');
	let filterValues = $state<Record<string, string>>({});
	let selectedRequest = $state<Request | null>(null);
	let detailOpen = $state(false);
	let confirmOpen = $state(false);
	let confirmAction = $state<'approve' | 'reject' | 'request-correction'>('approve');
	let actionReason = $state('');

	const pending = $derived(
		mockRequests.filter((r) => {
			const isPending = r.status === 'pending';
			const q = search.toLowerCase();
			const matchSearch = !q || r.studentName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
			const matchDoc = !filterValues.documentType || r.documentType === filterValues.documentType;
			const matchPriority = !filterValues.priority || r.priority === filterValues.priority;
			const matchPayment = !filterValues.paymentStatus || r.paymentStatus === filterValues.paymentStatus;
			return isPending && matchSearch && matchDoc && matchPriority && matchPayment;
		})
	);

	function openDetail(req: Request) {
		selectedRequest = req;
		detailOpen = true;
	}

	function openConfirm(action: typeof confirmAction) {
		confirmAction = action;
		actionReason = '';
		confirmOpen = true;
	}

	function executeAction() {
		confirmOpen = false;
		detailOpen = false;
		// In real app: call API to update request status
		alert(`Action "${confirmAction}" executed on ${selectedRequest?.id}`);
	}

	const filterDefs = [
		{
			key: 'documentType',
			placeholder: 'Document Type',
			options: [
				{ value: 'TOR', label: 'TOR' },
				{ value: 'Diploma', label: 'Diploma' },
				{ value: 'Good Moral Certificate', label: 'Good Moral' },
				{ value: 'Certificate of Graduation', label: 'Certificate' }
			]
		},
		{
			key: 'priority',
			placeholder: 'Priority',
			options: [{ value: 'regular', label: 'Regular' }, { value: 'rush', label: 'Rush' }]
		},
		{
			key: 'paymentStatus',
			placeholder: 'Payment',
			options: [
				{ value: 'paid', label: 'Paid' },
				{ value: 'unpaid', label: 'Unpaid' },
				{ value: 'for-verification', label: 'For Verification' }
			]
		}
	];
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
				<i class="fa-solid fa-clock text-orange-600"></i>
			</div>
			<div>
				<h2 class="font-semibold text-gray-800">Pending Requests</h2>
				<p class="text-sm text-gray-400">{pending.length} requests need your review</p>
			</div>
		</div>
	</div>

	<FilterBar
		searchPlaceholder="Search by name or request ID..."
		searchValue={search}
		filters={filterDefs}
		filterValues={filterValues}
		onSearch={(v) => (search = v)}
		onFilterChange={(k, v) => (filterValues = { ...filterValues, [k]: v })}
		onReset={() => { search = ''; filterValues = {}; }}
	/>

	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		{#if pending.length === 0}
			<EmptyState message="No pending requests" icon="fa-solid fa-inbox" description="All caught up! No requests need your attention right now." />
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Request ID', 'Student', 'Document', 'Priority', 'Payment', 'Date', 'Actions'] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each pending as req}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-mono text-xs text-gray-500">{req.id}</td>
								<td class="px-4 py-3">
									<p class="font-medium text-gray-800">{req.studentName}</p>
									<p class="text-xs text-gray-400">{req.studentId} · {req.program}</p>
								</td>
								<td class="px-4 py-3 text-gray-700">{req.documentType}</td>
								<td class="px-4 py-3"><Badge value={req.priority} /></td>
								<td class="px-4 py-3"><Badge value={req.paymentStatus} /></td>
								<td class="px-4 py-3 text-xs text-gray-500">{req.dateRequested}</td>
								<td class="px-4 py-3">
									<button
										onclick={() => openDetail(req)}
										class="text-xs px-2.5 py-1.5 bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors"
									>
										<i class="fa-solid fa-eye mr-1"></i>Review
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Detail Modal -->
<Modal open={detailOpen} title="Review Pending Request" size="lg" onclose={() => (detailOpen = false)}>
	{#snippet body()}
		{#if selectedRequest}
			<div class="space-y-5">
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div class="col-span-2 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-2">
						<i class="fa-solid fa-clock text-orange-500"></i>
						<span class="text-orange-700 text-sm">Awaiting review since <strong>{selectedRequest.dateRequested}</strong></span>
					</div>
					<div><p class="text-xs text-gray-400">Student</p><p class="font-semibold">{selectedRequest.studentName}</p></div>
					<div><p class="text-xs text-gray-400">Student ID</p><p class="font-semibold">{selectedRequest.studentId}</p></div>
					<div><p class="text-xs text-gray-400">Program</p><p class="font-medium">{selectedRequest.program}</p></div>
					<div><p class="text-xs text-gray-400">Document</p><p class="font-medium">{selectedRequest.documentType}</p></div>
					<div><p class="text-xs text-gray-400">Purpose</p><p class="font-medium">{selectedRequest.purpose ?? '—'}</p></div>
					<div><p class="text-xs text-gray-400">Copies</p><p class="font-medium">{selectedRequest.numCopies ?? 1}</p></div>
					<div><p class="text-xs text-gray-400">Payment</p><Badge value={selectedRequest.paymentStatus} /></div>
					<div><p class="text-xs text-gray-400">Priority</p><Badge value={selectedRequest.priority} /></div>
				</div>

				<div class="border-t border-gray-100 pt-4">
					<p class="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Submitted Files</p>
					<div class="space-y-2">
						{#each ['Payment Receipt', 'Clearance Form', 'Valid ID'] as file}
							<div class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
								<i class="fa-solid fa-file-pdf text-red-400"></i>
								<span class="text-sm text-gray-700 flex-1">{file}</span>
								<span class="text-xs text-green-600 font-medium">
									<i class="fa-solid fa-circle-check"></i> Uploaded
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<button onclick={() => openConfirm('request-correction')} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
			Request Correction
		</button>
		<button onclick={() => openConfirm('reject')} class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
			<i class="fa-solid fa-xmark mr-1"></i>Reject
		</button>
		<button onclick={() => openConfirm('approve')} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			<i class="fa-solid fa-check mr-1"></i>Approve
		</button>
	{/snippet}
</Modal>

<!-- Confirmation Modal -->
<Modal open={confirmOpen} title="Confirm Action" size="sm" onclose={() => (confirmOpen = false)}>
	{#snippet body()}
		<div class="space-y-4">
			<div class="flex items-center gap-3 p-3 {confirmAction === 'approve' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg">
				<i class="fa-solid {confirmAction === 'approve' ? 'fa-circle-check text-green-600' : 'fa-circle-xmark text-red-600'}"></i>
				<p class="text-sm font-medium {confirmAction === 'approve' ? 'text-green-700' : 'text-red-700'}">
					You are about to <strong>{confirmAction}</strong> request {selectedRequest?.id}.
				</p>
			</div>
			{#if confirmAction !== 'approve'}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">
						Reason <span class="text-gray-400">(optional)</span>
					</label>
					<textarea
						bind:value={actionReason}
						rows="3"
						placeholder="Provide a reason for the student..."
						class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-essu-green/30"
					></textarea>
				</div>
			{/if}
		</div>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={executeAction} class="px-4 py-2 text-sm {confirmAction === 'approve' ? 'bg-essu-green hover:bg-essu-green-mid' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors">
			Confirm
		</button>
	{/snippet}
</Modal>
