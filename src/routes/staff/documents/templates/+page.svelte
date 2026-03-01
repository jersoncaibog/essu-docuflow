<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { mockTemplates, templateVariables } from '$lib/data/templates';
	import type { DocumentTemplate } from '$lib/types';

	let templates = $state([...mockTemplates]);
	let selectedTemplate = $state<DocumentTemplate | null>(null);
	let editorOpen = $state(false);
	let previewOpen = $state(false);
	let isNew = $state(false);

	// Editor form fields
	let formName = $state('');
	let formDocType = $state('');
	let formVersion = $state('');
	let formStatus = $state<'active' | 'draft' | 'archived'>('draft');
	let formDescription = $state('');

	function openEditor(template?: DocumentTemplate) {
		isNew = !template;
		if (template) {
			selectedTemplate = template;
			formName = template.name;
			formDocType = template.documentType;
			formVersion = template.version;
			formStatus = template.status;
			formDescription = template.description ?? '';
		} else {
			selectedTemplate = null;
			formName = '';
			formDocType = '';
			formVersion = '1.0';
			formStatus = 'draft';
			formDescription = '';
		}
		editorOpen = true;
	}

	function openPreview(template: DocumentTemplate) {
		selectedTemplate = template;
		previewOpen = true;
	}

	function saveTemplate() {
		editorOpen = false;
	}

	function duplicateTemplate(template: DocumentTemplate) {
		const copy: DocumentTemplate = {
			...template,
			id: `TPL-${Date.now()}`,
			name: `${template.name} (Copy)`,
			version: '1.0',
			status: 'draft',
			lastUpdated: new Date().toISOString().split('T')[0],
			updatedBy: 'Admin User'
		};
		templates = [...templates, copy];
	}
</script>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
				<i class="fa-solid fa-file-invoice text-purple-600"></i>
			</div>
			<div>
				<h2 class="font-semibold text-gray-800">Document Templates</h2>
				<p class="text-sm text-gray-400">{templates.filter((t) => t.status === 'active').length} active templates</p>
			</div>
		</div>
		<button
			onclick={() => openEditor()}
			class="flex items-center gap-2 px-4 py-2 bg-essu-green text-white text-sm rounded-lg hover:bg-essu-green-mid transition-colors font-medium"
		>
			<i class="fa-solid fa-plus"></i>
			New Template
		</button>
	</div>

	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		{#if templates.length === 0}
			<EmptyState message="No templates yet" icon="fa-solid fa-file-invoice" />
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-gray-50 border-b border-gray-100">
						<tr>
							{#each ['Template Name', 'Document Type', 'Version', 'Last Updated', 'Updated By', 'Status', 'Actions'] as col}
								<th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each templates as tpl}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-4 py-3 font-medium text-gray-800">{tpl.name}</td>
								<td class="px-4 py-3 text-gray-600">{tpl.documentType}</td>
								<td class="px-4 py-3">
									<span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">v{tpl.version}</span>
								</td>
								<td class="px-4 py-3 text-xs text-gray-500">{tpl.lastUpdated}</td>
								<td class="px-4 py-3 text-gray-600">{tpl.updatedBy}</td>
								<td class="px-4 py-3"><Badge value={tpl.status} /></td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-1">
										<button onclick={() => openEditor(tpl)} class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
											<i class="fa-solid fa-pen text-xs"></i>
										</button>
										<button onclick={() => openPreview(tpl)} class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
											<i class="fa-solid fa-eye text-xs"></i>
										</button>
										<button onclick={() => duplicateTemplate(tpl)} class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Duplicate">
											<i class="fa-solid fa-copy text-xs"></i>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Template Variables Reference -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
		<h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
			<i class="fa-solid fa-code text-gray-400"></i>
			Available Template Variables
		</h3>
		<div class="grid grid-cols-2 gap-2">
			{#each templateVariables as v}
				<div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
					<code class="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-essu-green font-mono">{v.key}</code>
					<span class="text-xs text-gray-500">{v.description}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Editor Modal -->
<Modal open={editorOpen} title="{isNew ? 'Create New Template' : 'Edit Template'}" size="xl" onclose={() => (editorOpen = false)}>
	{#snippet body()}
		<div class="space-y-5">
			<div class="grid grid-cols-2 gap-4">
				<div class="col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Template Name <span class="text-red-500">*</span></label>
					<input bind:value={formName} type="text" placeholder="e.g. Transcript of Records - Standard" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30" />
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Document Type <span class="text-red-500">*</span></label>
					<select bind:value={formDocType} class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 bg-white">
						<option value="">Select type...</option>
						<option>TOR</option>
						<option>Diploma</option>
						<option>Good Moral Certificate</option>
						<option>Certificate of Graduation</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Version</label>
					<input bind:value={formVersion} type="text" placeholder="1.0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30" />
				</div>
				<div class="col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
					<div class="flex gap-3">
						{#each ['draft', 'active', 'archived'] as s}
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="radio" bind:group={formStatus} value={s} class="text-essu-green" />
								<span class="text-sm capitalize text-gray-700">{s}</span>
							</label>
						{/each}
					</div>
				</div>
				<div class="col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
					<textarea bind:value={formDescription} rows="3" placeholder="Brief description of this template..." class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-essu-green/30"></textarea>
				</div>
			</div>

			<div class="p-4 bg-blue-50 border border-blue-100 rounded-xl">
				<p class="text-sm text-blue-700 font-medium mb-2">
					<i class="fa-solid fa-circle-info mr-1"></i>
					Template Content Editor
				</p>
				<p class="text-xs text-blue-600">Full template content editor with variable insertion, letterhead, signature blocks, and security features would be integrated here using a rich text editor.</p>
			</div>
		</div>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (editorOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={saveTemplate} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			<i class="fa-solid fa-floppy-disk mr-1"></i>Save Template
		</button>
	{/snippet}
</Modal>

<!-- Preview Modal -->
<Modal open={previewOpen} title="Template Preview" size="xl" onclose={() => (previewOpen = false)}>
	{#snippet body()}
		{#if selectedTemplate}
			<div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
				<div class="mb-6">
					<p class="text-xs text-gray-400 uppercase tracking-widest mb-1">Republic of the Philippines</p>
					<p class="text-lg font-bold text-essu-green">Eastern Samar State University</p>
					<p class="text-sm text-gray-600">Borongan City, Eastern Samar</p>
					<p class="text-xs text-gray-400 mt-1">Registrar's Office</p>
				</div>
				<div class="border-y border-gray-200 py-4 my-4">
					<h2 class="text-xl font-bold text-gray-800 uppercase tracking-wide">{selectedTemplate.name}</h2>
					<p class="text-xs text-gray-500 mt-1">Version {selectedTemplate.version}</p>
				</div>
				<div class="text-left space-y-2 text-sm text-gray-600">
					{#each templateVariables.slice(0, 5) as v}
						<div class="flex gap-2">
							<span class="font-medium w-32 shrink-0">{v.description}:</span>
							<span class="font-mono text-essu-green">{v.key}</span>
						</div>
					{/each}
				</div>
				<div class="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
					{#each ['University Registrar', 'University President', 'Dept. Head'] as signatory}
						<div>
							<div class="h-10 border-b border-gray-300 mb-1"></div>
							<p>{signatory}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (previewOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Close</button>
	{/snippet}
</Modal>
