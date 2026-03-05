<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { currentUser, mockStudentUser } from '$lib/stores/auth';

	let mode: 'login' | 'signup' | 'check-email' = $state('login');
	let email = $state('');
	let password = $state('');
	let fullName = $state('');
	let confirmPassword = $state('');
	let termsAccepted = $state(false);
	let error = $state('');
	let loading = $state(false);

	function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		if (!email || !password) { error = 'Please fill in all fields.'; return; }
		loading = true;
		// Mock login — in real app, call API
		setTimeout(() => {
			currentUser.set(mockStudentUser);
			goto('/student/dashboard');
		}, 600);
	}

	async function handleSignup(e: Event) {
		e.preventDefault();
		if (!browser) return;
		error = '';
		if (!fullName || !email || !password || !confirmPassword) { error = 'Please fill in all fields.'; return; }
		if (password !== confirmPassword) { error = 'Passwords do not match.'; return; }
		if (!termsAccepted) { error = 'Please accept the terms and conditions.'; return; }
		loading = true;
		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fullName, email, password })
			});
			const data = await res.json();
			if (!res.ok) {
				error = data.error ?? 'Registration failed. Please try again.';
			} else {
				mode = 'check-email';
			}
		} catch {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-essu-blue via-essu-green to-essu-green-mid flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- Brand -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-3 backdrop-blur-sm">
				<i class="fa-solid fa-graduation-cap text-white text-3xl"></i>
			</div>
			<h1 class="text-2xl font-bold text-white">ESSU DocuFlow</h1>
			<p class="text-white/70 text-sm mt-1">Student Document Request Portal</p>
		</div>

		<!-- Card -->
		<div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
			<!-- Mode toggle (hidden during check-email) -->
			{#if mode !== 'check-email'}
				<div class="flex border-b border-gray-100">
					<button
						onclick={() => { mode = 'login'; error = ''; }}
						class="flex-1 py-4 text-sm font-semibold transition-colors
							{mode === 'login' ? 'text-essu-green border-b-2 border-essu-green' : 'text-gray-400 hover:text-gray-600'}"
					>
						Sign In
					</button>
					<button
						onclick={() => { mode = 'signup'; error = ''; }}
						class="flex-1 py-4 text-sm font-semibold transition-colors
							{mode === 'signup' ? 'text-essu-green border-b-2 border-essu-green' : 'text-gray-400 hover:text-gray-600'}"
					>
						Create Account
					</button>
				</div>
			{/if}

			<div class="p-8">
				{#if mode === 'check-email'}
					<div class="text-center py-4">
						<div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
							<i class="fa-solid fa-envelope-circle-check text-2xl text-essu-green"></i>
						</div>
						<h2 class="text-lg font-semibold text-gray-800 mb-2">Check your email</h2>
						<p class="text-sm text-gray-500 mb-6">
							We sent a verification link to <span class="font-medium text-gray-700">{email}</span>.
							Click it to activate your account. The link expires in 24 hours.
						</p>
						<button
							onclick={() => { mode = 'login'; error = ''; }}
							class="text-sm text-essu-green hover:underline"
						>
							Back to Sign In
						</button>
					</div>
				{:else}
					{#if error}
						<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
							<i class="fa-solid fa-circle-exclamation shrink-0"></i>
							{error}
						</div>
					{/if}

					{#if mode === 'login'}
						<form onsubmit={handleLogin} class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
								<input
									bind:value={email}
									type="email"
									placeholder="yourname@essu.edu.ph"
									required
									class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
								<input
									bind:value={password}
									type="password"
									placeholder="Enter your password"
									required
									class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
								/>
							</div>
							<div class="flex items-center justify-between text-sm">
								<label class="flex items-center gap-2 text-gray-500 cursor-pointer">
									<input type="checkbox" class="rounded" />
									Remember me
								</label>
								<a href="#" class="text-essu-green hover:underline">Forgot password?</a>
							</div>
							<button
								type="submit"
								disabled={loading}
								class="w-full py-2.5 bg-essu-green text-white rounded-lg font-medium text-sm hover:bg-essu-green-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
							>
								{#if loading}<i class="fa-solid fa-circle-notch fa-spin"></i>{/if}
								Sign In
							</button>
						</form>

						<div class="mt-4 text-center text-sm text-gray-500">
							Staff member? <a href="/admin/login" class="text-essu-green font-medium hover:underline">Admin Login</a>
						</div>
					{:else}
						<form onsubmit={handleSignup} class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
								<input
									bind:value={fullName}
									type="text"
									placeholder="Juan Dela Cruz"
									required
									class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
								<input
									bind:value={email}
									type="email"
									placeholder="yourname@essu.edu.ph"
									required
									class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
								/>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
									<input
										bind:value={password}
										type="password"
										placeholder="Min. 8 characters"
										required
										minlength="8"
										class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
									/>
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
									<input
										bind:value={confirmPassword}
										type="password"
										placeholder="Repeat password"
										required
										class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-essu-green/30 focus:border-essu-green-light"
									/>
								</div>
							</div>
							<label class="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
								<input bind:checked={termsAccepted} type="checkbox" class="mt-0.5 rounded shrink-0" />
								<span>
									I agree to the <a href="#" class="text-essu-green hover:underline">Terms and Conditions</a>
									and <a href="#" class="text-essu-green hover:underline">Privacy Policy</a>
								</span>
							</label>
							<button
								type="submit"
								disabled={loading}
								class="w-full py-2.5 bg-essu-blue text-white rounded-lg font-medium text-sm hover:bg-essu-blue-mid transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
							>
								{#if loading}<i class="fa-solid fa-circle-notch fa-spin"></i>{/if}
								Create Account
							</button>
						</form>
					{/if}
				{/if}
			</div>
		</div>

		<p class="text-center text-white/50 text-xs mt-6">
			Eastern Samar State University · Registrar's Office
		</p>
	</div>
</div>
