<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import { currentUser } from '$lib/stores/auth';
	import type { StaffMember } from '$lib/types';

	const user = $derived($currentUser);
	const profile = $derived(user?.profile as StaffMember);

	// Edit modal state
	let editPersonalOpen = $state(false);
	let editProfessionalOpen = $state(false);
	let editContactOpen = $state(false);
	let passwordOpen = $state(false);
	let confirmOpen = $state(false);
	let confirmAction = $state('');

	// Form state
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');

	function handlePasswordChange(e: Event) {
		e.preventDefault();
		passwordError = '';
		if (!currentPassword || !newPassword || !confirmPassword) { passwordError = 'All fields are required.'; return; }
		if (newPassword.length < 8) { passwordError = 'Password must be at least 8 characters.'; return; }
		if (newPassword !== confirmPassword) { passwordError = 'New passwords do not match.'; return; }
		passwordOpen = false;
		currentPassword = newPassword = confirmPassword = '';
	}

	const activityLog = [
		{ date: '2024-01-18 09:30', action: 'Approved request REQ-2024-003' },
		{ date: '2024-01-17 14:00', action: 'Rejected request REQ-2024-004 (incomplete clearance)' },
		{ date: '2024-01-16 11:00', action: 'Marked REQ-2024-006 as ready for release' },
		{ date: '2024-01-15 09:00', action: 'Updated document template TOR v3.0' },
		{ date: '2024-01-14 16:30', action: 'Exported monthly report (December 2023)' }
	];
</script>

<div class="max-w-4xl mx-auto space-y-5">
	<!-- Profile header -->
	<div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="h-24 bg-gradient-to-r from-essu-green to-essu-green-mid"></div>
		<div class="px-6 pb-6">
			<div class="flex items-end gap-4 -mt-3 mb-4">
				<div class="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-essu-green">
					{profile?.avatarInitials ?? '??'}
				</div>
				<div class="mb-2">
					<h2 class="text-xl font-bold text-gray-800">{profile?.name}</h2>
					<p class="text-sm text-gray-500">{profile?.position} · {profile?.department}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
		<!-- Info sections -->
		<div class="xl:col-span-2 space-y-4">
			<!-- Personal Info -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<h3 class="font-semibold text-gray-700">Personal Information</h3>
					<button onclick={() => (editPersonalOpen = true)} class="text-sm text-essu-green hover:underline flex items-center gap-1">
						<i class="fa-solid fa-pen text-xs"></i> Edit
					</button>
				</div>
				<div class="grid grid-cols-2 gap-4 p-5 text-sm">
					{#each [
						['Full Name', profile?.name],
						['Staff ID', profile?.id],
						['Date of Birth', '1985-06-15'],
						['Gender', 'Female'],
						['Nationality', 'Filipino']
					] as [label, value]}
						<div>
							<p class="text-xs text-gray-400 mb-0.5">{label}</p>
							<p class="font-medium text-gray-700">{value ?? '—'}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Professional Info -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<h3 class="font-semibold text-gray-700">Professional Information</h3>
					<button onclick={() => (editProfessionalOpen = true)} class="text-sm text-essu-green hover:underline flex items-center gap-1">
						<i class="fa-solid fa-pen text-xs"></i> Edit
					</button>
				</div>
				<div class="grid grid-cols-2 gap-4 p-5 text-sm">
					{#each [
						['Position', profile?.position],
						['Department', profile?.department],
						['Employee ID', profile?.id],
						['Hire Date', '2015-03-01'],
						['Employment Status', 'Regular']
					] as [label, value]}
						<div>
							<p class="text-xs text-gray-400 mb-0.5">{label}</p>
							<p class="font-medium text-gray-700">{value ?? '—'}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Contact Info -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<h3 class="font-semibold text-gray-700">Contact Information</h3>
					<button onclick={() => (editContactOpen = true)} class="text-sm text-essu-green hover:underline flex items-center gap-1">
						<i class="fa-solid fa-pen text-xs"></i> Edit
					</button>
				</div>
				<div class="grid grid-cols-2 gap-4 p-5 text-sm">
					<div><p class="text-xs text-gray-400">Email</p><p class="font-medium">{profile?.email}</p></div>
					<div><p class="text-xs text-gray-400">Phone</p><p class="font-medium">{profile?.phone ?? '—'}</p></div>
					<div class="col-span-2"><p class="text-xs text-gray-400">Address</p><p class="font-medium">123 Registrar St., Borongan City, Eastern Samar</p></div>
				</div>
			</div>

			<!-- Activity Log -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="px-5 py-4 border-b border-gray-100">
					<h3 class="font-semibold text-gray-700">Recent Activity</h3>
				</div>
				<div class="divide-y divide-gray-50">
					{#each activityLog as log}
						<div class="flex items-center gap-3 px-5 py-3 text-sm">
							<i class="fa-solid fa-circle-dot text-essu-green text-xs shrink-0"></i>
							<span class="flex-1 text-gray-700">{log.action}</span>
							<span class="text-xs text-gray-400 whitespace-nowrap">{log.date}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Account Settings -->
		<div class="space-y-4">
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="px-5 py-4 border-b border-gray-100">
					<h3 class="font-semibold text-gray-700">Account Settings</h3>
				</div>
				<div class="p-4 space-y-2">
					{#each [
						{ icon: 'fa-solid fa-lock', label: 'Change Password', action: () => (passwordOpen = true) },
						{ icon: 'fa-solid fa-envelope', label: 'Update Email', action: () => { confirmAction = 'email'; confirmOpen = true; } },
						{ icon: 'fa-solid fa-shield-halved', label: 'Enable 2FA', action: () => { confirmAction = '2fa'; confirmOpen = true; } },
						{ icon: 'fa-solid fa-right-from-bracket', label: 'Logout All Devices', action: () => { confirmAction = 'logout'; confirmOpen = true; } }
					] as item}
						<button
							onclick={item.action}
							class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
						>
							<div class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
								<i class="{item.icon} text-gray-600 text-sm"></i>
							</div>
							<span class="text-sm font-medium text-gray-700">{item.label}</span>
							<i class="fa-solid fa-chevron-right text-xs text-gray-400 ml-auto"></i>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Password Modal -->
<Modal open={passwordOpen} title="Change Password" size="sm" onclose={() => (passwordOpen = false)}>
	{#snippet body()}
		<form onsubmit={handlePasswordChange} class="space-y-4" id="password-form">
			{#if passwordError}
				<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{passwordError}</div>
			{/if}
			{#each [
				{ label: 'Current Password', bind: currentPassword },
				{ label: 'New Password', bind: newPassword },
				{ label: 'Confirm New Password', bind: confirmPassword }
			] as field}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
					<input
						type="password"
						bind:value={field.bind}
						required
						class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30"
					/>
				</div>
			{/each}
		</form>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (passwordOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button type="submit" form="password-form" class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			Update Password
		</button>
	{/snippet}
</Modal>

<!-- Generic Confirm Modal -->
<Modal open={confirmOpen} title="Confirm Action" size="sm" onclose={() => (confirmOpen = false)}>
	{#snippet body()}
		<p class="text-sm text-gray-600">
			{#if confirmAction === 'logout'}
				Are you sure you want to log out from all devices? You will need to sign in again.
			{:else if confirmAction === '2fa'}
				Enable Two-Factor Authentication for your account for added security.
			{:else}
				Proceed with this action?
			{/if}
		</p>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">
			Confirm
		</button>
	{/snippet}
</Modal>

<!-- Edit modals (simplified) -->
{#each [
	{ open: editPersonalOpen, title: 'Edit Personal Information', onclose: () => (editPersonalOpen = false) },
	{ open: editProfessionalOpen, title: 'Edit Professional Information', onclose: () => (editProfessionalOpen = false) },
	{ open: editContactOpen, title: 'Edit Contact Information', onclose: () => (editContactOpen = false) }
] as modal}
	<Modal open={modal.open} title={modal.title} size="md" onclose={modal.onclose}>
		{#snippet body()}
			<div class="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
				<i class="fa-solid fa-circle-info mr-1"></i>
				Edit form fields would be rendered here with pre-filled current values.
			</div>
		{/snippet}
		{#snippet footer()}
			<button onclick={modal.onclose} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
			<button onclick={modal.onclose} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">Save</button>
		{/snippet}
	</Modal>
{/each}
