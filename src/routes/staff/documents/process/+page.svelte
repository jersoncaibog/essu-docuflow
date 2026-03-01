<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { mockRequests } from '$lib/data/requests';
	import type { Request } from '$lib/types';

	const processing = $derived(mockRequests.filter((r) => r.status === 'processing'));

	let selectedRequest = $state<Request | null>(null);
	let processOpen = $state(false);
	let confirmOpen = $state(false);
	let confirmAction = $state('');

	// Clearance checklist state
	let clearances = $state({
		library: false,
		accounting: false,
		department: false,
		registrar: false
	});

	// Document preparation checklist
	let docChecklist = $state({
		dataVerified: false,
		templateApplied: false,
		signaturesAdded: false,
		qrCodeGenerated: false,
		qualityChecked: false
	});

	let notes = $state('');

	function openProcess(req: Request) {
		selectedRequest = req;
		clearances = { library: false, accounting: false, department: false, registrar: false };
		docChecklist = { dataVerified: false, templateApplied: false, signaturesAdded: false, qrCodeGenerated: false, qualityChecked: false };
		notes = '';
		processOpen = true;
	}

	function openConfirm(action: string) {
		confirmAction = action;
		confirmOpen = true;
	}

	const allClearancesVerified = $derived(Object.values(clearances).every(Boolean));
	const allDocStepsComplete = $derived(Object.values(docChecklist).every(Boolean));
	const canMarkReady = $derived(allClearancesVerified && allDocStepsComplete);
</script>

<div class="space-y-5">
	<div class="flex items-center gap-3 mb-2">
		<div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
			<i class="fa-solid fa-gears text-blue-600"></i>
		</div>
		<div>
			<h2 class="font-semibold text-gray-800">Document Processing</h2>
			<p class="text-sm text-gray-400">{processing.length} documents currently in processing</p>
		</div>
	</div>

	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		{#if processing.length === 0}
			<EmptyState message="No documents in processing" icon="fa-solid fa-gears" />
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Request ID', 'Student', 'Document', 'Date Approved', 'Assigned Staff', 'Priority', 'Actions'] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each processing as req}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-mono text-xs text-gray-500">{req.id}</td>
								<td class="px-4 py-3">
									<p class="font-medium text-gray-800">{req.studentName}</p>
									<p class="text-xs text-gray-400">{req.studentId} · {req.program}</p>
								</td>
								<td class="px-4 py-3 text-gray-700">{req.documentType}</td>
								<td class="px-4 py-3 text-xs text-gray-500">{req.dateRequested}</td>
								<td class="px-4 py-3 text-gray-600">{req.assignedStaff ?? '—'}</td>
								<td class="px-4 py-3"><Badge value={req.priority} /></td>
								<td class="px-4 py-3">
									<button
										onclick={() => openProcess(req)}
										class="text-xs px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										<i class="fa-solid fa-gears mr-1"></i>Process
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

<!-- Process Modal -->
<Modal open={processOpen} title="Process Document" size="xl" onclose={() => (processOpen = false)}>
	{#snippet body()}
		{#if selectedRequest}
			<div class="space-y-6">
				<!-- Student info -->
				<div class="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
					<div><p class="text-xs text-gray-400">Student</p><p class="font-semibold">{selectedRequest.studentName}</p></div>
					<div><p class="text-xs text-gray-400">Student ID</p><p class="font-semibold">{selectedRequest.studentId}</p></div>
					<div><p class="text-xs text-gray-400">Document</p><p class="font-semibold">{selectedRequest.documentType}</p></div>
				</div>

				<!-- Clearance verification -->
				<div>
					<h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
						<i class="fa-solid fa-shield-check text-essu-green"></i>
						Clearance Verification
					</h3>
					<div class="grid grid-cols-2 gap-3">
						{#each [
							{ key: 'library', label: 'Library Clearance', icon: 'fa-solid fa-book' },
							{ key: 'accounting', label: 'Accounting / Finance', icon: 'fa-solid fa-coins' },
							{ key: 'department', label: 'Department Clearance', icon: 'fa-solid fa-building' },
							{ key: 'registrar', label: "Registrar's Office", icon: 'fa-solid fa-file-contract' }
						] as item}
							<label
								class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors
									{clearances[item.key as keyof typeof clearances] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}"
							>
								<input
									type="checkbox"
									bind:checked={clearances[item.key as keyof typeof clearances]}
									class="rounded"
								/>
								<i class="{item.icon} {clearances[item.key as keyof typeof clearances] ? 'text-green-600' : 'text-gray-400'}"></i>
								<span class="text-sm font-medium {clearances[item.key as keyof typeof clearances] ? 'text-green-700' : 'text-gray-600'}">{item.label}</span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Document preparation checklist -->
				<div>
					<h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
						<i class="fa-solid fa-clipboard-list text-blue-600"></i>
						Document Preparation Checklist
					</h3>
					<div class="space-y-2">
						{#each [
							{ key: 'dataVerified', label: 'Student data verified against records' },
							{ key: 'templateApplied', label: 'Correct template version applied' },
							{ key: 'signaturesAdded', label: 'Signatories block filled in' },
							{ key: 'qrCodeGenerated', label: 'QR code / control number generated' },
							{ key: 'qualityChecked', label: 'Final quality check completed' }
						] as step}
							<label
								class="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
							>
								<input
									type="checkbox"
									bind:checked={docChecklist[step.key as keyof typeof docChecklist]}
									class="rounded"
								/>
								<span class="text-sm {docChecklist[step.key as keyof typeof docChecklist] ? 'line-through text-gray-400' : 'text-gray-700'}">{step.label}</span>
							</label>
						{/each}
					</div>
				</div>

				<!-- Notes -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Processing Notes</label>
					<textarea
						bind:value={notes}
						rows="3"
						placeholder="Add any relevant notes..."
						class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-essu-green/30"
					></textarea>
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<button onclick={() => openConfirm('hold')} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
			<i class="fa-solid fa-pause mr-1"></i>Put On Hold
		</button>
		<button class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
			<i class="fa-solid fa-print mr-1"></i>Print Document
		</button>
		<button
			onclick={() => openConfirm('ready')}
			disabled={!canMarkReady}
			class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
		>
			<i class="fa-solid fa-check mr-1"></i>Mark as Ready
		</button>
	{/snippet}
</Modal>

<!-- Confirm Modal -->
<Modal open={confirmOpen} title="Confirm" size="sm" onclose={() => (confirmOpen = false)}>
	{#snippet body()}
		<p class="text-sm text-gray-600">
			Are you sure you want to <strong>{confirmAction === 'ready' ? 'mark this document as ready for release' : 'put this request on hold'}</strong>?
		</p>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={() => { confirmOpen = false; processOpen = false; }} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			Confirm
		</button>
	{/snippet}
</Modal>
