<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, mockStaffUser } from '$lib/stores/auth';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		if (!email || !password) { error = 'Please fill in all fields.'; return; }
		loading = true;
		setTimeout(() => {
			currentUser.set(mockStaffUser);
			goto('/staff/dashboard');
		}, 600);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-essu-green via-essu-green-mid to-essu-blue flex items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<!-- Brand -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-3 backdrop-blur-sm">
				<i class="fa-solid fa-user-shield text-white text-3xl"></i>
			</div>
			<h1 class="text-2xl font-bold text-white">Admin Login</h1>
			<p class="text-white/70 text-sm mt-1">Staff & Registrar Portal</p>
		</div>

		<div class="bg-white rounded-2xl shadow-2xl p-8">
			<div class="flex items-center gap-2 mb-6 p-2.5 bg-essu-green/10 rounded-lg border border-essu-green/20">
				<i class="fa-solid fa-lock text-essu-green text-sm"></i>
				<span class="text-xs font-medium text-essu-green">Restricted Access — Authorized Personnel Only</span>
			</div>

			{#if error}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
					<i class="fa-solid fa-circle-exclamation shrink-0"></i>
					{error}
				</div>
			{/if}

			<form onsubmit={handleLogin} class="space-y-4">
				<div>
					<label for="admin-email" class="block text-sm font-medium text-gray-700 mb-1.5">Staff Email</label>
					<input
						id="admin-email"
						bind:value={email}
						type="email"
						placeholder="admin@essu.edu.ph"
						required
						class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
					/>
				</div>
				<div>
					<label for="admin-password" class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
					<input
						id="admin-password"
						bind:value={password}
						type="password"
						placeholder="Enter your password"
						required
						class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
					/>
				</div>
				<button
					type="submit"
					disabled={loading}
					class="w-full py-2.5 bg-essu-green text-white rounded-lg font-medium text-sm hover:bg-essu-green-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
				>
					{#if loading}<i class="fa-solid fa-circle-notch fa-spin"></i>{/if}
					<i class="fa-solid fa-right-to-bracket"></i>
					Sign In
				</button>
			</form>

			<div class="mt-4 text-center text-sm text-gray-500">
				<a href="/login" class="text-essu-green hover:underline">← Student Login</a>
			</div>
		</div>
	</div>
</div>
