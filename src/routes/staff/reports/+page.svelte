<script lang="ts">
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { mockRequests } from '$lib/data/requests';

	let timeRange = $state('month');
	let docFilter = $state('');
	let programFilter = $state('');

	const totalRequests = $derived(mockRequests.length);
	const approved = $derived(mockRequests.filter((r) => r.status === 'completed').length);
	const rejected = $derived(mockRequests.filter((r) => r.status === 'rejected').length);
	const rush = $derived(mockRequests.filter((r) => r.priority === 'rush').length);

	const docStats = $derived([
		{ type: 'TOR', count: mockRequests.filter((r) => r.documentType === 'TOR').length, avgDays: '3.2' },
		{ type: 'Diploma', count: mockRequests.filter((r) => r.documentType === 'Diploma').length, avgDays: '5.1' },
		{ type: 'Good Moral', count: mockRequests.filter((r) => r.documentType === 'Good Moral Certificate').length, avgDays: '1.8' },
		{ type: 'Cert. of Grad.', count: mockRequests.filter((r) => r.documentType === 'Certificate of Graduation').length, avgDays: '4.0' }
	]);

	const staffPerf = [
		{ name: 'Jane Doe', processed: 34, avgTime: '2.1 days', rating: 98 },
		{ name: 'John Smith', processed: 28, avgTime: '2.8 days', rating: 95 }
	];
</script>

<div class="space-y-5">
	<!-- Controls -->
	<div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3 justify-between">
		<div class="flex items-center gap-2">
			<select bind:value={timeRange} class="py-2 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30">
				<option value="month">This Month</option>
				<option value="quarter">This Quarter</option>
				<option value="year">This Year</option>
				<option value="all">All Time</option>
			</select>
			<select bind:value={docFilter} class="py-2 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30">
				<option value="">All Documents</option>
				<option value="TOR">TOR</option>
				<option value="Diploma">Diploma</option>
				<option value="GMC">Good Moral</option>
			</select>
			<select bind:value={programFilter} class="py-2 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-essu-green/30">
				<option value="">All Programs</option>
				<option value="BSIT">BSIT</option>
				<option value="BSED">BSED</option>
				<option value="BSCS">BSCS</option>
				<option value="BSBM">BSBM</option>
			</select>
		</div>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
				<i class="fa-solid fa-file-pdf text-red-500"></i> Export PDF
			</button>
			<button class="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
				<i class="fa-solid fa-file-excel text-green-600"></i> Export Excel
			</button>
			<button class="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
				<i class="fa-solid fa-print"></i> Print
			</button>
		</div>
	</div>

	<!-- Summary cards -->
	<div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
		<StatCard label="Total Requests" value={totalRequests} icon="fa-solid fa-file-lines" color="blue" trend={{ value: 12 }} />
		<StatCard label="Approved" value={approved} icon="fa-solid fa-circle-check" color="green" trend={{ value: 8 }} />
		<StatCard label="Rejected" value={rejected} icon="fa-solid fa-circle-xmark" color="red" trend={{ value: -3 }} />
		<StatCard label="Rush Orders" value={rush} icon="fa-solid fa-bolt" color="gold" trend={{ value: 5 }} />
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
		<!-- Document Type Stats -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			<div class="px-5 py-4 border-b border-gray-100">
				<h3 class="font-semibold text-gray-800">Document Type Statistics</h3>
			</div>
			<div class="p-4">
				{#each docStats as stat}
					<div class="flex items-center gap-3 mb-3">
						<p class="text-sm text-gray-600 w-28 shrink-0">{stat.type}</p>
						<div class="flex-1 bg-gray-100 rounded-full h-2">
							<div
								class="bg-essu-green h-2 rounded-full"
								style="width: {(stat.count / totalRequests) * 100}%"
							></div>
						</div>
						<p class="text-sm font-semibold text-gray-700 w-6 text-right">{stat.count}</p>
						<p class="text-xs text-gray-400 w-16 text-right">{stat.avgDays} days avg</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Processing Time -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			<div class="px-5 py-4 border-b border-gray-100">
				<h3 class="font-semibold text-gray-800">Processing Time Report</h3>
			</div>
			<div class="grid grid-cols-2 gap-4 p-5">
				{#each [
					{ label: 'Average Processing Time', value: '2.8 days', icon: 'fa-solid fa-clock', color: 'text-blue-600 bg-blue-50' },
					{ label: 'Fastest Processing', value: '0.5 days', icon: 'fa-solid fa-bolt', color: 'text-green-600 bg-green-50' },
					{ label: 'Slowest Processing', value: '7 days', icon: 'fa-solid fa-hourglass-end', color: 'text-red-600 bg-red-50' },
					{ label: 'On-Time Rate', value: '94.2%', icon: 'fa-solid fa-chart-pie', color: 'text-purple-600 bg-purple-50' }
				] as item}
					<div class="p-4 rounded-xl {item.color.split(' ')[1]} border border-gray-100">
						<i class="{item.icon} {item.color.split(' ')[0]} mb-2"></i>
						<p class="text-2xl font-bold text-gray-800">{item.value}</p>
						<p class="text-xs text-gray-500 mt-0.5">{item.label}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Staff Performance -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
		<div class="px-5 py-4 border-b border-gray-100">
			<h3 class="font-semibold text-gray-800">Staff Performance</h3>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 border-b border-gray-100">
					<tr>
						{#each ['Staff Member', 'Requests Processed', 'Avg Processing Time', 'Performance Rating'] as col}
							<th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{col}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each staffPerf as staff}
						<tr class="hover:bg-gray-50">
							<td class="px-5 py-3 font-medium text-gray-800">{staff.name}</td>
							<td class="px-5 py-3 text-gray-600">{staff.processed}</td>
							<td class="px-5 py-3 text-gray-600">{staff.avgTime}</td>
							<td class="px-5 py-3">
								<div class="flex items-center gap-2">
									<div class="flex-1 bg-gray-100 rounded-full h-1.5 max-w-24">
										<div class="bg-essu-green h-1.5 rounded-full" style="width: {staff.rating}%"></div>
									</div>
									<span class="text-sm font-semibold text-gray-700">{staff.rating}%</span>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Chart placeholder -->
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
		<i class="fa-solid fa-chart-line text-4xl text-gray-200 mb-3"></i>
		<p class="text-gray-400 text-sm">Request Trends Chart</p>
		<p class="text-xs text-gray-300 mt-1">Integrate Chart.js or D3.js here for live charts</p>
	</div>
</div>
