<script lang="ts">
	import { sidebarCollapsed, sidebarMobileOpen } from '$lib/stores/sidebar';
	import { currentUser } from '$lib/stores/auth';
	import type { StaffMember, Student } from '$lib/types';

	interface Props {
		title: string;
		notifHref: string;
	}

	const { title, notifHref }: Props = $props();

	const collapsed = $derived($sidebarCollapsed);
	const user = $derived($currentUser);

	const avatarLabel = $derived.by(() => {
		if (!user) return '?';
		const profile = user.profile as StaffMember & Student;
		if ('avatarInitials' in profile && profile.avatarInitials) return profile.avatarInitials;
		return profile.name
			.split(' ')
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();
	});

	const displayName = $derived(user?.profile.name ?? 'User');
	const displayRole = $derived.by(() => {
		if (!user) return '';
		if (user.role === 'staff') return (user.profile as StaffMember).position ?? 'Staff';
		return `${(user.profile as Student).program} · Year ${(user.profile as Student).year}`;
	});
</script>

<header
	class="fixed top-0 right-0 z-20 h-16 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 gap-3 transition-all duration-300
		{collapsed ? 'left-16' : 'left-60'}
		max-lg:left-0"
>
	<!-- Mobile hamburger -->
	<button
		onclick={() => sidebarMobileOpen.update((v) => !v)}
		class="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
		aria-label="Toggle sidebar"
	>
		<i class="fa-solid fa-bars"></i>
	</button>

	<!-- Page title -->
	<h1 class="text-lg font-semibold text-gray-800 flex-1 truncate">{title}</h1>

	<div class="flex items-center gap-2">
		<!-- Notifications bell -->
		<a
			href={notifHref}
			class="relative p-2 text-gray-500 hover:text-essu-green hover:bg-green-50 rounded-lg transition-colors"
			aria-label="Notifications"
		>
			<i class="fa-regular fa-bell text-lg"></i>
			<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
		</a>

		<!-- User avatar -->
		<div class="flex items-center gap-2 pl-2 border-l border-gray-100">
			<div class="w-8 h-8 rounded-full bg-essu-green flex items-center justify-center text-white text-xs font-bold shrink-0">
				{avatarLabel}
			</div>
			<div class="hidden sm:block text-left">
				<p class="text-sm font-medium text-gray-800 leading-tight">{displayName}</p>
				<p class="text-xs text-gray-500 leading-tight">{displayRole}</p>
			</div>
		</div>
	</div>
</header>
