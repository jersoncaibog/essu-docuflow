<script lang="ts">
	import { page } from '$app/stores';
	import { sidebarCollapsed, sidebarMobileOpen } from '$lib/stores/sidebar';

	type NavItem = {
		label: string;
		icon: string;
		href: string;
	};

	interface Props {
		items: NavItem[];
		role: 'staff' | 'student';
	}

	const { items, role }: Props = $props();

	const collapsed = $derived($sidebarCollapsed);
	const mobileOpen = $derived($sidebarMobileOpen);

	const currentPath = $derived($page.url.pathname);

	function isActive(href: string) {
		return currentPath === href || (href !== '/' && currentPath.startsWith(href));
	}

	function toggle() {
		sidebarCollapsed.update((v) => !v);
	}

	function closeMobile() {
		sidebarMobileOpen.set(false);
	}

	// Keyboard shortcut Ctrl+B
	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
			e.preventDefault();
			toggle();
		}
	}

	const logoText = role === 'staff' ? 'Staff Portal' : 'Student Portal';
	const accentColor = role === 'staff' ? 'from-essu-green to-essu-green-mid' : 'from-essu-blue to-essu-blue-mid';
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Mobile backdrop -->
{#if mobileOpen}
	<div
		class="fixed inset-0 z-30 bg-black/40 lg:hidden"
		onclick={closeMobile}
		role="presentation"
	></div>
{/if}

<!-- Sidebar -->
<aside
	class="fixed top-0 left-0 h-full z-40 flex flex-col bg-gradient-to-b {accentColor} text-white shadow-xl
		transition-all duration-300 ease-in-out
		{collapsed ? 'w-16' : 'w-60'}
		{mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
	aria-label="Sidebar navigation"
>
	<!-- Logo / Brand -->
	<div class="flex items-center h-16 px-3 border-b border-white/10 shrink-0">
		<div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
			<i class="fa-solid fa-graduation-cap text-white text-lg"></i>
		</div>
		{#if !collapsed}
			<div class="ml-3 overflow-hidden">
				<p class="text-sm font-bold leading-tight text-white">ESSU</p>
				<p class="text-xs text-white/70 leading-tight">{logoText}</p>
			</div>
		{/if}
	</div>

	<!-- Nav items -->
	<nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Main navigation">
		{#each items as item}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				onclick={closeMobile}
				class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
					{active
						? 'bg-white/20 text-white shadow-sm'
						: 'text-white/70 hover:bg-white/10 hover:text-white'}"
				aria-current={active ? 'page' : undefined}
				title={collapsed ? item.label : undefined}
			>
				<i class="{item.icon} w-5 text-center shrink-0 {active ? 'text-white' : 'text-white/70 group-hover:text-white'}"></i>
				{#if !collapsed}
					<span class="truncate">{item.label}</span>
					{#if active}
						<span class="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
					{/if}
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Footer / Collapse toggle -->
	<div class="shrink-0 border-t border-white/10 p-2">
		<button
			onclick={toggle}
			class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			title="Toggle sidebar (Ctrl+B)"
		>
			<i class="fa-solid {collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} w-5 text-center shrink-0"></i>
			{#if !collapsed}
				<span class="text-xs">Collapse</span>
			{/if}
		</button>
	</div>
</aside>
