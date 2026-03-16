<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const profile = data.profile;
	const fullName = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ');

	const myRequests: never[] = [];

	let editPersonalOpen = $state(false);
	let passwordOpen = $state(false);
	let confirmOpen = $state(false);
	let confirmAction = $state('');
	let passwordError = $state('');
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	function handlePasswordChange(e: Event) {
		e.preventDefault();
		passwordError = '';
		if (!currentPassword || !newPassword || !confirmPassword) { passwordError = 'All fields required.'; return; }
		if (newPassword.length < 8) { passwordError = 'Password must be at least 8 characters.'; return; }
		if (newPassword !== confirmPassword) { passwordError = 'Passwords do not match.'; return; }
		passwordOpen = false;
		currentPassword = newPassword = confirmPassword = '';
	}

	const initials = [profile.first_name, profile.last_name].map((n) => n[0]).join('');
</script>

<div class="max-w-4xl mx-auto space-y-5">
	<!-- Profile header -->
	<div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="h-24 bg-linear-to-r from-essu-green to-essu-gold"></div>
		<div class="px-6 pb-6">
			<div class="flex items-end gap-4 -mt-3 mb-4">
				<div class="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-essu-green">
					{initials}
				</div>
				<div class="mb-2 flex-1">
					<div class="flex items-center gap-2">
						<h2 class="text-xl font-bold text-gray-800">{fullName}</h2>
					</div>
					<p class="text-sm text-gray-500">{profile.program} · {profile.student_id}</p>
				</div>
			</div>

			<!-- Request stats -->
			<div class="grid grid-cols-3 gap-3">
				{#each [
					{ label: 'Total Requests', value: myRequests.length, color: 'text-blue-600 bg-blue-50' },
					{ label: 'Completed', value: myRequests.filter((r) => r.status === 'completed').length, color: 'text-green-600 bg-green-50' },
					{ label: 'Pending', value: myRequests.filter((r) => r.status === 'pending').length, color: 'text-orange-600 bg-orange-50' }
				] as stat}
					<div class="p-3 {stat.color} rounded-xl text-center">
						<p class="text-lg font-bold">{stat.value}</p>
						<p class="text-xs mt-0.5">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
		<div class="xl:col-span-2 space-y-4">
			<!-- Personal Info — only DB fields -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<h3 class="font-semibold text-gray-700">Personal Information</h3>
					<button onclick={() => (editPersonalOpen = true)} class="text-sm text-essu-green hover:underline flex items-center gap-1">
						<i class="fa-solid fa-pen text-xs"></i> Edit
					</button>
				</div>
				<div class="grid grid-cols-2 gap-4 p-5 text-sm">
					<div><p class="text-xs text-gray-400">First Name</p><p class="font-medium">{profile.first_name}</p></div>
					<div><p class="text-xs text-gray-400">Middle Name</p><p class="font-medium">{profile.middle_name || '—'}</p></div>
					<div><p class="text-xs text-gray-400">Last Name</p><p class="font-medium">{profile.last_name}</p></div>
					<div><p class="text-xs text-gray-400">Date of Birth</p><p class="font-medium">{profile.date_of_birth}</p></div>
					<div><p class="text-xs text-gray-400">Email</p><p class="font-medium">{profile.email}</p></div>
				</div>
			</div>

			<!-- Academic Info — read-only -->
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<div class="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
					<h3 class="font-semibold text-gray-700">Academic Information</h3>
					<span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Read-only</span>
				</div>
				<div class="grid grid-cols-2 gap-4 p-5 text-sm">
					<div><p class="text-xs text-gray-400">Student ID</p><p class="font-medium">{profile.student_id}</p></div>
					<div><p class="text-xs text-gray-400">Program</p><p class="font-medium">{profile.program}</p></div>
					<div class="col-span-2"><p class="text-xs text-gray-400">Student Type</p><p class="font-medium">
						{#if profile.student_type === 'Enrolled'}Currently Enrolled Graduate Student
						{:else if profile.student_type === 'Supplemental'}Supplemental Student
						{:else if profile.student_type === 'Former'}Former Graduate Student
						{:else if profile.student_type === 'Alumni'}Alumni
						{:else}—{/if}
					</p></div>
					<div><p class="text-xs text-gray-400">Last School Year Attended</p><p class="font-medium">{profile.last_school_year ?? '—'}</p></div>
					<div><p class="text-xs text-gray-400">Date Registered</p><p class="font-medium">{profile.date_registered}</p></div>
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
						{ icon: 'fa-solid fa-envelope', label: 'Update Email', action: () => { confirmAction = 'email'; confirmOpen = true; } }
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

			<!-- Danger Zone -->
			<div class="bg-white rounded-xl border border-red-200 shadow-sm">
				<div class="px-5 py-4 border-b border-red-100">
					<h3 class="font-semibold text-red-600">Danger Zone</h3>
				</div>
				<div class="p-4">
					<button
						onclick={() => { confirmAction = 'delete'; confirmOpen = true; }}
						class="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
					>
						<i class="fa-solid fa-trash-can mr-1"></i> Request Account Deletion
					</button>
					<p class="text-xs text-gray-400 text-center mt-2">This will initiate a review process.</p>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Password Modal -->
<Modal open={passwordOpen} title="Change Password" size="sm" onclose={() => (passwordOpen = false)}>
	{#snippet body()}
		<form onsubmit={handlePasswordChange} id="pw-form" class="space-y-4">
			{#if passwordError}
				<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{passwordError}</div>
			{/if}
			{#each [['Current Password', currentPassword], ['New Password', newPassword], ['Confirm New Password', confirmPassword]] as [label, val], i}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
					<input
						type="password"
						value={val}
						oninput={(e) => {
							const v = (e.target as HTMLInputElement).value;
							if (i === 0) currentPassword = v;
							else if (i === 1) newPassword = v;
							else confirmPassword = v;
						}}
						required
						class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30"
					/>
				</div>
			{/each}
		</form>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (passwordOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button type="submit" form="pw-form" class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">Update Password</button>
	{/snippet}
</Modal>

<!-- Confirm Modal -->
<Modal open={confirmOpen} title="Confirm Action" size="sm" onclose={() => (confirmOpen = false)}>
	{#snippet body()}
		<p class="text-sm text-gray-600">
			{#if confirmAction === 'delete'}
				<span class="text-red-600 font-medium">Warning:</span> Requesting account deletion will notify the Registrar's Office. This process cannot be done instantly.
			{:else}
				Proceed with this action?
			{/if}
		</p>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={() => (confirmOpen = false)} class="px-4 py-2 text-sm {confirmAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-essu-green hover:bg-essu-green-mid'} text-white rounded-lg transition-colors">
			Confirm
		</button>
	{/snippet}
</Modal>

<!-- Edit Personal Info Modal -->
<Modal open={editPersonalOpen} title="Edit Personal Information" size="md" onclose={() => (editPersonalOpen = false)}>
	{#snippet body()}
		<div class="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
			<i class="fa-solid fa-circle-info mr-1"></i>
			Pre-filled edit form fields would be rendered here.
		</div>
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (editPersonalOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
		<button onclick={() => (editPersonalOpen = false)} class="px-4 py-2 text-sm bg-essu-green text-white rounded-lg hover:bg-essu-green-mid transition-colors">Save</button>
	{/snippet}
</Modal>
