<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import FilterBar from '$lib/components/forms/FilterBar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { mockStudents } from '$lib/data/students';
	import { mockRequests } from '$lib/data/requests';
	import type { Student } from '$lib/types';

	let search = $state('');
	let filterValues = $state<Record<string, string>>({});
	let currentPage = $state(1);
	let itemsPerPage = $state(10);
	let selectedStudent = $state<Student | null>(null);
	let profileOpen = $state(false);
	let activeTab = $state<'personal' | 'academic' | 'requests'>('personal');

	const filtered = $derived(
		mockStudents.filter((s) => {
			const q = search.toLowerCase();
			const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
			const matchProgram = !filterValues.program || s.program === filterValues.program;
			const matchYear = !filterValues.year || String(s.year) === filterValues.year;
			const matchClearance = !filterValues.clearanceStatus || s.clearanceStatus === filterValues.clearanceStatus;
			return matchSearch && matchProgram && matchYear && matchClearance;
		})
	);

	const paginated = $derived(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const studentRequests = $derived(
		selectedStudent ? mockRequests.filter((r) => r.studentId === selectedStudent?.id) : []
	);

	function openProfile(student: Student) {
		selectedStudent = student;
		activeTab = 'personal';
		profileOpen = true;
	}

	const filterDefs = [
		{
			key: 'program',
			placeholder: 'Program',
			options: [{ value: 'BSIT', label: 'BSIT' }, { value: 'BSED', label: 'BSED' }, { value: 'BSCS', label: 'BSCS' }, { value: 'BSBM', label: 'BSBM' }]
		},
		{
			key: 'year',
			placeholder: 'Year Level',
			options: [1, 2, 3, 4, 5].map((y) => ({ value: String(y), label: `Year ${y}` }))
		},
		{
			key: 'clearanceStatus',
			placeholder: 'Clearance',
			options: [
				{ value: 'cleared', label: 'Cleared' },
				{ value: 'not-cleared', label: 'Not Cleared' },
				{ value: 'with-balance', label: 'With Balance' },
				{ value: 'pending', label: 'Pending' }
			]
		}
	];
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
				<i class="fa-solid fa-users text-teal-600"></i>
			</div>
			<div>
				<h2 class="font-semibold text-gray-800">Student Registry</h2>
				<p class="text-sm text-gray-400">{mockStudents.length} students in the system</p>
			</div>
		</div>
	</div>

	<FilterBar
		searchPlaceholder="Search by student ID or name..."
		searchValue={search}
		filters={filterDefs}
		filterValues={filterValues}
		onSearch={(v) => { search = v; currentPage = 1; }}
		onFilterChange={(k, v) => { filterValues = { ...filterValues, [k]: v }; currentPage = 1; }}
		onReset={() => { search = ''; filterValues = {}; currentPage = 1; }}
	/>

	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		{#if paginated.length === 0}
			<EmptyState message="No students found" icon="fa-solid fa-users" />
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Student ID', 'Full Name', 'Program', 'Year', 'Email', 'Clearance', 'Requests', 'Actions'] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each paginated as student}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-mono text-xs text-gray-500">{student.id}</td>
								<td class="px-4 py-3 font-medium text-gray-800">{student.name}</td>
								<td class="px-4 py-3 text-gray-600">{student.program}</td>
								<td class="px-4 py-3 text-gray-600">{student.year}</td>
								<td class="px-4 py-3 text-gray-500 text-xs">{student.email}</td>
								<td class="px-4 py-3"><Badge value={student.clearanceStatus} /></td>
								<td class="px-4 py-3">
									<span class="text-sm font-semibold text-gray-700">{student.requestCount}</span>
								</td>
								<td class="px-4 py-3">
									<button
										onclick={() => openProfile(student)}
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

<!-- Profile Modal -->
<Modal open={profileOpen} title="Student Profile" size="lg" onclose={() => (profileOpen = false)}>
	{#snippet body()}
		{#if selectedStudent}
			<!-- Tabs -->
			<div class="flex gap-1 border-b border-gray-100 mb-5">
				{#each [['personal', 'Personal'], ['academic', 'Academic'], ['requests', 'Requests']] as [tab, label]}
					<button
						onclick={() => (activeTab = tab as typeof activeTab)}
						class="px-4 py-2 text-sm font-medium transition-colors border-b-2
							{activeTab === tab ? 'border-essu-green text-essu-green' : 'border-transparent text-gray-500 hover:text-gray-700'}"
					>
						{label}
					</button>
				{/each}
			</div>

			{#if activeTab === 'personal'}
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div><p class="text-xs text-gray-400">Full Name</p><p class="font-semibold">{selectedStudent.name}</p></div>
					<div><p class="text-xs text-gray-400">Student ID</p><p class="font-semibold">{selectedStudent.id}</p></div>
					<div><p class="text-xs text-gray-400">Date of Birth</p><p class="font-medium">{selectedStudent.dateOfBirth ?? '—'}</p></div>
					<div><p class="text-xs text-gray-400">Gender</p><p class="font-medium">{selectedStudent.gender ?? '—'}</p></div>
					<div><p class="text-xs text-gray-400">Email</p><p class="font-medium">{selectedStudent.email}</p></div>
					<div><p class="text-xs text-gray-400">Phone</p><p class="font-medium">{selectedStudent.phone ?? '—'}</p></div>
					<div class="col-span-2"><p class="text-xs text-gray-400">Address</p><p class="font-medium">{selectedStudent.address ?? '—'}</p></div>
				</div>
			{:else if activeTab === 'academic'}
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div><p class="text-xs text-gray-400">Program</p><p class="font-semibold">{selectedStudent.program}</p></div>
					<div><p class="text-xs text-gray-400">Year Level</p><p class="font-semibold">Year {selectedStudent.year}</p></div>
					<div><p class="text-xs text-gray-400">Clearance Status</p><Badge value={selectedStudent.clearanceStatus} /></div>
					<div><p class="text-xs text-gray-400">Total Requests</p><p class="font-semibold">{selectedStudent.requestCount}</p></div>
				</div>
			{:else}
				{#if studentRequests.length === 0}
					<EmptyState message="No requests from this student" icon="fa-solid fa-file-lines" />
				{:else}
					<div class="space-y-2">
						{#each studentRequests as req}
							<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-700">{req.documentType}</p>
									<p class="text-xs text-gray-400">{req.id} · {req.dateRequested}</p>
								</div>
								<Badge value={req.status} />
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		{/if}
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (profileOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Close</button>
	{/snippet}
</Modal>
