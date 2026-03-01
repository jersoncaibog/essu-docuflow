<script lang="ts">
	import StepIndicator from '$lib/components/forms/StepIndicator.svelte';
	import FileUpload from '$lib/components/forms/FileUpload.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	const steps = [
		{ label: 'Select Document', icon: 'fa-solid fa-file' },
		{ label: 'Details', icon: 'fa-solid fa-pen' },
		{ label: 'Subjects', icon: 'fa-solid fa-book' },
		{ label: 'Clearance', icon: 'fa-solid fa-shield-check' },
		{ label: 'Upload Files', icon: 'fa-solid fa-upload' },
		{ label: 'Review', icon: 'fa-solid fa-eye' }
	];

	const documentOptions = [
		{ type: 'TOR', label: 'Transcript of Records', icon: 'fa-solid fa-scroll', processingTime: '3–5 days', fee: '₱150 per copy' },
		{ type: 'Diploma', label: 'Diploma Certificate', icon: 'fa-solid fa-certificate', processingTime: '5–7 days', fee: '₱200' },
		{ type: 'Good Moral Certificate', label: 'Good Moral Certificate', icon: 'fa-solid fa-heart', processingTime: '1–2 days', fee: '₱100' },
		{ type: 'Certificate of Graduation', label: 'Certificate of Graduation', icon: 'fa-solid fa-graduation-cap', processingTime: '3–5 days', fee: '₱150' },
		{ type: 'Grades Report', label: 'Grades Report', icon: 'fa-solid fa-chart-bar', processingTime: '2–3 days', fee: '₱100 per semester' }
	];

	let currentStep = $state(1);
	let selectedDocType = $state('');
	let purpose = $state('');
	let numCopies = $state(1);
	let isRush = $state(false);
	let clearanceComplete = $state(false);
	let confirmOpen = $state(false);
	let successOpen = $state(false);

	// File state
	let paymentFile = $state<File | null>(null);
	let clearanceFile = $state<File | null>(null);
	let idFile = $state<File | null>(null);

	// Subjects (for TOR/Grades Report)
	let subjects = $state([{ code: '', name: '', semester: '', grade: '' }]);

	const requiresSubjects = $derived(['TOR', 'Grades Report'].includes(selectedDocType));

	const canProceed = $derived(() => {
		switch (currentStep) {
			case 1: return !!selectedDocType;
			case 2: return !!purpose && numCopies >= 1;
			case 3: return true;
			case 4: return clearanceComplete;
			case 5: return !!paymentFile && !!clearanceFile && !!idFile;
			default: return true;
		}
	});

	function next() { if (currentStep < 6) currentStep++; }
	function prev() { if (currentStep > 1) currentStep--; }

	function addSubjectRow() {
		subjects = [...subjects, { code: '', name: '', semester: '', grade: '' }];
	}

	function removeSubjectRow(i: number) {
		subjects = subjects.filter((_, idx) => idx !== i);
	}

	function submit() {
		confirmOpen = false;
		successOpen = true;
	}

	function reset() {
		currentStep = 1;
		selectedDocType = '';
		purpose = '';
		numCopies = 1;
		isRush = false;
		clearanceComplete = false;
		paymentFile = clearanceFile = idFile = null;
		subjects = [{ code: '', name: '', semester: '', grade: '' }];
		successOpen = false;
	}

	const requestId = $derived(`REQ-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 7).toUpperCase()}`);
</script>

<div class="max-w-3xl mx-auto space-y-6">
	<!-- Step indicator -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
		<StepIndicator {steps} {currentStep} />
	</div>

	<!-- Step content -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
		<!-- Step 1: Select Document -->
		{#if currentStep === 1}
			<h2 class="text-lg font-semibold text-gray-800 mb-1">Select Document Type</h2>
			<p class="text-sm text-gray-500 mb-5">Choose the document you want to request from the Registrar's Office.</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{#each documentOptions as doc}
					<label
						class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
							{selectedDocType === doc.type ? 'border-essu-green bg-green-50/60' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}"
					>
						<input type="radio" bind:group={selectedDocType} value={doc.type} class="mt-1 accent-essu-green shrink-0" />
						<div>
							<div class="flex items-center gap-2 mb-1">
								<i class="{doc.icon} {selectedDocType === doc.type ? 'text-essu-green' : 'text-gray-400'}"></i>
								<p class="font-semibold text-sm text-gray-800">{doc.label}</p>
							</div>
							<p class="text-xs text-gray-400">{doc.processingTime} · {doc.fee}</p>
						</div>
					</label>
				{/each}
			</div>

		<!-- Step 2: Details -->
		{:else if currentStep === 2}
			<h2 class="text-lg font-semibold text-gray-800 mb-1">Request Details</h2>
			<p class="text-sm text-gray-500 mb-5">Provide the purpose and number of copies needed.</p>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Purpose <span class="text-red-500">*</span></label>
					<textarea
						bind:value={purpose}
						rows="3"
						placeholder="e.g., Graduate school application, board exam requirement, employment..."
						class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-essu-green/30"
					></textarea>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Number of Copies</label>
						<input
							type="number"
							bind:value={numCopies}
							min="1"
							max="10"
							class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
						<label class="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors {isRush ? 'border-red-300 bg-red-50' : 'border-gray-200'}">
							<input type="checkbox" bind:checked={isRush} class="rounded accent-red-600" />
							<div>
								<p class="text-sm font-medium {isRush ? 'text-red-700' : 'text-gray-700'}">Rush Order</p>
								<p class="text-xs text-gray-400">+₱100 additional fee</p>
							</div>
						</label>
					</div>
				</div>
			</div>

		<!-- Step 3: Subjects -->
		{:else if currentStep === 3}
			<h2 class="text-lg font-semibold text-gray-800 mb-1">Subject Listing</h2>
			{#if !requiresSubjects}
				<div class="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-center gap-2 mt-3">
					<i class="fa-solid fa-circle-info"></i>
					Subject listing is not required for <strong>{selectedDocType}</strong>. Click Next to continue.
				</div>
			{:else}
				<p class="text-sm text-gray-500 mb-4">List the subjects/courses to be included in your {selectedDocType}.</p>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="bg-gray-50">
							<tr>
								{#each ['Course Code', 'Course Name', 'Semester', 'Grade', ''] as col}
									<th class="text-left px-3 py-2 text-xs font-semibold text-gray-500">{col}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each subjects as subject, i}
								<tr>
									<td class="px-2 py-1.5"><input bind:value={subject.code} placeholder="e.g. IT-401" class="w-24 px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-essu-green/30" /></td>
									<td class="px-2 py-1.5"><input bind:value={subject.name} placeholder="Subject name" class="w-40 px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-essu-green/30" /></td>
									<td class="px-2 py-1.5">
										<select bind:value={subject.semester} class="px-2 py-1.5 border border-gray-200 rounded text-xs bg-white focus:outline-none">
											<option value="">Select...</option>
											<option>1st Semester</option>
											<option>2nd Semester</option>
											<option>Summer</option>
										</select>
									</td>
									<td class="px-2 py-1.5"><input bind:value={subject.grade} placeholder="1.25" class="w-16 px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-essu-green/30" /></td>
									<td class="px-2 py-1.5">
										{#if subjects.length > 1}
											<button onclick={() => removeSubjectRow(i)} class="p-1 text-red-400 hover:text-red-600">
												<i class="fa-solid fa-xmark text-xs"></i>
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<button onclick={addSubjectRow} class="mt-3 text-sm text-essu-green hover:underline flex items-center gap-1">
					<i class="fa-solid fa-plus text-xs"></i> Add row
				</button>
			{/if}

		<!-- Step 4: Clearance -->
		{:else if currentStep === 4}
			<h2 class="text-lg font-semibold text-gray-800 mb-1">Clearance Confirmation</h2>
			<p class="text-sm text-gray-500 mb-5">You must complete all clearance requirements before submitting a document request.</p>
			<div class="space-y-3 mb-5">
				{#each [
					{ dept: 'Library', cleared: true },
					{ dept: 'Accounting / Finance', cleared: true },
					{ dept: 'Department', cleared: false },
					{ dept: "Registrar's Office", cleared: false }
				] as item}
					<div class="flex items-center gap-3 p-3.5 rounded-xl border {item.cleared ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}">
						<i class="fa-solid {item.cleared ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-red-400'}"></i>
						<span class="text-sm font-medium {item.cleared ? 'text-green-700' : 'text-gray-500'}">{item.dept}</span>
						<span class="ml-auto text-xs {item.cleared ? 'text-green-600' : 'text-red-500'} font-medium">
							{item.cleared ? 'Cleared' : 'Not Cleared'}
						</span>
					</div>
				{/each}
			</div>
			<label class="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors {clearanceComplete ? 'border-essu-green bg-green-50' : 'border-gray-200'}">
				<input type="checkbox" bind:checked={clearanceComplete} class="mt-0.5 rounded accent-essu-green shrink-0" />
				<span class="text-sm text-gray-700">
					I confirm that I have completed all clearance requirements or am currently undergoing the clearance process.
				</span>
			</label>

		<!-- Step 5: Upload -->
		{:else if currentStep === 5}
			<h2 class="text-lg font-semibold text-gray-800 mb-1">Upload Required Files</h2>
			<p class="text-sm text-gray-500 mb-5">Upload clear, legible copies of the required documents.</p>
			<div class="space-y-5">
				<FileUpload
					label="Payment Receipt"
					accept="image/*,.pdf"
					required
					file={paymentFile}
					onFileSelect={(f) => (paymentFile = f)}
				/>
				<FileUpload
					label="Clearance Form"
					accept="image/*,.pdf"
					required
					file={clearanceFile}
					onFileSelect={(f) => (clearanceFile = f)}
				/>
				<FileUpload
					label="Valid ID (School ID or Government-issued)"
					accept="image/*,.pdf"
					required
					file={idFile}
					onFileSelect={(f) => (idFile = f)}
				/>
			</div>

		<!-- Step 6: Review -->
		{:else if currentStep === 6}
			<h2 class="text-lg font-semibold text-gray-800 mb-1">Review Your Request</h2>
			<p class="text-sm text-gray-500 mb-5">Please review all details before submitting.</p>
			<div class="bg-gradient-to-br from-essu-green/5 to-essu-green-mid/5 border border-essu-green/20 rounded-xl p-5 space-y-3 text-sm">
				{#each [
					['Document Type', selectedDocType],
					['Purpose', purpose],
					['Number of Copies', String(numCopies)],
					['Priority', isRush ? '⚡ Rush Order' : 'Regular'],
					['Payment Receipt', paymentFile?.name ?? '—'],
					['Clearance Form', clearanceFile?.name ?? '—'],
					['Valid ID', idFile?.name ?? '—']
				] as [label, value]}
					<div class="flex items-start justify-between gap-4">
						<span class="text-gray-500 shrink-0">{label}</span>
						<span class="font-medium text-gray-800 text-right">{value}</span>
					</div>
				{/each}
			</div>
			<div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700 flex items-start gap-2">
				<i class="fa-solid fa-triangle-exclamation mt-0.5 shrink-0"></i>
				<span>Once submitted, you cannot edit this request. Ensure all information is correct before clicking Submit.</span>
			</div>
		{/if}
	</div>

	<!-- Navigation buttons -->
	<div class="flex items-center justify-between">
		<button
			onclick={prev}
			disabled={currentStep === 1}
			class="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
		>
			<i class="fa-solid fa-chevron-left text-xs"></i> Back
		</button>

		{#if currentStep < 6}
			<button
				onclick={next}
				disabled={!canProceed()}
				class="flex items-center gap-2 px-5 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
			>
				Next <i class="fa-solid fa-chevron-right text-xs"></i>
			</button>
		{:else}
			<button
				onclick={() => (confirmOpen = true)}
				class="flex items-center gap-2 px-5 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors font-medium"
			>
				<i class="fa-solid fa-paper-plane text-xs"></i> Submit Request
			</button>
		{/if}
	</div>
</div>

<!-- Confirm Modal -->
<Modal open={confirmOpen} title="Confirm Submission" size="sm" onclose={() => (confirmOpen = false)}>
	{#snippet body()}
		<p class="text-sm text-gray-600">
			Are you ready to submit your request for <strong>{selectedDocType}</strong>? This action cannot be undone.
		</p>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={submit} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			<i class="fa-solid fa-paper-plane mr-1"></i>Submit
		</button>
	{/snippet}
</Modal>

<!-- Success Modal -->
<Modal open={successOpen} title="Request Submitted!" size="sm" onclose={reset}>
	{#snippet body()}
		<div class="text-center py-4">
			<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<i class="fa-solid fa-circle-check text-green-600 text-3xl"></i>
			</div>
			<p class="text-gray-700 text-sm mb-2">Your document request has been submitted successfully.</p>
			<p class="font-mono font-bold text-essu-green text-lg">{requestId}</p>
			<p class="text-xs text-gray-400 mt-1">Keep this ID for tracking your request.</p>
		</div>
	{/snippet}
	{#snippet footer()}
		<a href="/student/documents" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
			View My Documents
		</a>
		<button onclick={reset} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			New Request
		</button>
	{/snippet}
</Modal>
