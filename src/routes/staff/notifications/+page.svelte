<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { mockStaffNotifications } from '$lib/data/notifications';
	import type { Notification } from '$lib/types';

	let notifications = $state([...mockStaffNotifications]);
	let activeFilter = $state<string>('all');
	let search = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 5;

	let selectedNotif = $state<Notification | null>(null);
	let detailOpen = $state(false);

	const filterOptions = ['all', 'request', 'urgent', 'task', 'system'];

	const filtered = $derived(
		notifications.filter((n) => {
			const matchFilter = activeFilter === 'all' || n.type === activeFilter;
			const q = search.toLowerCase();
			const matchSearch = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
			return matchFilter && matchSearch;
		})
	);

	const paginated = $derived(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

	const unreadCount = $derived(notifications.filter((n) => !n.isRead).length);
	const urgentCount = $derived(notifications.filter((n) => n.isUrgent).length);
	const actionCount = $derived(notifications.filter((n) => n.actionItems && n.actionItems.length > 0).length);

	function markAllRead() {
		notifications = notifications.map((n) => ({ ...n, isRead: true }));
	}

	function viewDetail(notif: Notification) {
		selectedNotif = notif;
		detailOpen = true;
		// Mark as read
		notifications = notifications.map((n) => n.id === notif.id ? { ...n, isRead: true } : n);
	}

	const typeIconMap: Record<string, { icon: string; color: string; bg: string }> = {
		request: { icon: 'fa-solid fa-file-circle-check', color: 'text-blue-600', bg: 'bg-blue-50' },
		urgent: { icon: 'fa-solid fa-triangle-exclamation', color: 'text-red-600', bg: 'bg-red-50' },
		task: { icon: 'fa-solid fa-clipboard-list', color: 'text-purple-600', bg: 'bg-purple-50' },
		system: { icon: 'fa-solid fa-gear', color: 'text-gray-600', bg: 'bg-gray-100' }
	};
</script>

<div class="space-y-5">
	<!-- Stats -->
	<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
		<StatCard label="Total" value={notifications.length} icon="fa-regular fa-bell" color="blue" />
		<StatCard label="Unread" value={unreadCount} icon="fa-solid fa-envelope" color="orange" />
		<StatCard label="Urgent" value={urgentCount} icon="fa-solid fa-triangle-exclamation" color="red" />
		<StatCard label="Action Required" value={actionCount} icon="fa-solid fa-list-check" color="purple" />
	</div>

	<!-- Controls -->
	<div class="flex items-center justify-between gap-4 flex-wrap">
		<div class="flex items-center gap-2">
			{#each filterOptions as opt}
				<button
					onclick={() => { activeFilter = opt; currentPage = 1; }}
					class="px-3 py-1.5 text-sm rounded-lg font-medium capitalize transition-colors
						{activeFilter === opt ? 'bg-essu-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}"
				>
					{opt}
				</button>
			{/each}
		</div>
		<div class="flex items-center gap-2">
			<div class="relative">
				<i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
				<input
					type="text"
					bind:value={search}
					placeholder="Search notifications..."
					oninput={() => (currentPage = 1)}
					class="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30 w-48"
				/>
			</div>
			{#if unreadCount > 0}
				<button
					onclick={markAllRead}
					class="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
				>
					<i class="fa-solid fa-check-double mr-1 text-xs"></i>Mark all read
				</button>
			{/if}
		</div>
	</div>

	<!-- Notifications list -->
	<div class="space-y-2">
		{#if paginated.length === 0}
			<div class="bg-white rounded-xl border border-gray-100 shadow-sm">
				<EmptyState message="No notifications found" icon="fa-regular fa-bell-slash" />
			</div>
		{:else}
			{#each paginated as notif}
				{@const meta = typeIconMap[notif.type]}
				<button
					onclick={() => viewDetail(notif)}
					class="w-full text-left bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all flex items-start gap-4
						{!notif.isRead ? 'border-essu-green/30 bg-green-50/30' : 'border-gray-100'}"
				>
					<!-- Unread indicator -->
					{#if !notif.isRead}
						<span class="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-essu-green rounded-full hidden"></span>
					{/if}

					<div class="w-10 h-10 rounded-xl {meta.bg} {meta.color} flex items-center justify-center shrink-0">
						<i class="{meta.icon} text-sm"></i>
					</div>

					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-2">
							<div class="flex items-center gap-2">
								<p class="text-sm font-semibold text-gray-800 {!notif.isRead ? 'text-gray-900' : ''}">{notif.title}</p>
								{#if notif.isUrgent}
									<span class="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Urgent</span>
								{/if}
								{#if !notif.isRead}
									<span class="w-2 h-2 bg-essu-green rounded-full inline-block shrink-0"></span>
								{/if}
							</div>
							<p class="text-xs text-gray-400 whitespace-nowrap shrink-0">{notif.date}</p>
						</div>
						<p class="text-sm text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
						{#if notif.actionItems && notif.actionItems.length > 0}
							<p class="text-xs text-essu-green mt-1 font-medium">
								<i class="fa-solid fa-list-check mr-1"></i>{notif.actionItems.length} action{notif.actionItems.length > 1 ? 's' : ''} required
							</p>
						{/if}
					</div>
					<Badge value={notif.type} size="sm" />
				</button>
			{/each}
		{/if}
	</div>

	{#if filtered.length > itemsPerPage}
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2">
			<Pagination
				totalItems={filtered.length}
				{itemsPerPage}
				{currentPage}
				onPageChange={(p) => (currentPage = p)}
			/>
		</div>
	{/if}
</div>

<!-- Detail Modal -->
<Modal open={detailOpen} title="Notification Detail" size="md" onclose={() => (detailOpen = false)}>
	{#snippet body()}
		{#if selectedNotif}
			{@const meta = typeIconMap[selectedNotif.type]}
			<div class="space-y-4">
				<div class="flex items-start gap-3">
					<div class="w-10 h-10 rounded-xl {meta.bg} {meta.color} flex items-center justify-center shrink-0">
						<i class="{meta.icon}"></i>
					</div>
					<div>
						<p class="font-semibold text-gray-800">{selectedNotif.title}</p>
						<p class="text-xs text-gray-400 mt-0.5">{selectedNotif.date}</p>
					</div>
				</div>
				<p class="text-sm text-gray-600 leading-relaxed">{selectedNotif.message}</p>
				{#if selectedNotif.actionItems && selectedNotif.actionItems.length > 0}
					<div class="border-t border-gray-100 pt-3">
						<p class="text-sm font-semibold text-gray-700 mb-2">Action Items</p>
						<ul class="space-y-1.5">
							{#each selectedNotif.actionItems as action}
								<li class="flex items-center gap-2 text-sm text-gray-600">
									<i class="fa-regular fa-circle text-gray-300 text-xs"></i>
									{action}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if selectedNotif.relatedRequestId}
					<a href="/staff/requests" class="inline-flex items-center gap-2 text-sm text-essu-green hover:underline font-medium">
						<i class="fa-solid fa-arrow-right text-xs"></i>
						View related request {selectedNotif.relatedRequestId}
					</a>
				{/if}
			</div>
		{/if}
	{/snippet}
	{#snippet footer()}
		<button onclick={() => (detailOpen = false)} class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Close</button>
	{/snippet}
</Modal>
