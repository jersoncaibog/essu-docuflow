<script lang="ts">
	import type { RequestStatus, PaymentStatus, Priority, ClearanceStatus, NotificationType, TemplateStatus } from '$lib/types';

	type BadgeValue = RequestStatus | PaymentStatus | Priority | ClearanceStatus | NotificationType | TemplateStatus | string;

	interface Props {
		value: BadgeValue;
		size?: 'sm' | 'md';
	}

	const { value, size = 'md' }: Props = $props();

	const colorMap: Record<string, string> = {
		// RequestStatus
		pending: 'bg-orange-100 text-orange-700 border border-orange-200',
		processing: 'bg-blue-100 text-blue-700 border border-blue-200',
		ready: 'bg-teal-100 text-teal-700 border border-teal-200',
		completed: 'bg-green-100 text-green-700 border border-green-200',
		rejected: 'bg-red-100 text-red-700 border border-red-200',
		cancelled: 'bg-gray-100 text-gray-600 border border-gray-200',
		revision: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
		// PaymentStatus
		paid: 'bg-green-100 text-green-700 border border-green-200',
		unpaid: 'bg-red-100 text-red-700 border border-red-200',
		'for-verification': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
		// Priority
		regular: 'bg-gray-100 text-gray-600 border border-gray-200',
		rush: 'bg-red-100 text-red-700 border border-red-200',
		// ClearanceStatus
		cleared: 'bg-green-100 text-green-700 border border-green-200',
		'not-cleared': 'bg-red-100 text-red-700 border border-red-200',
		'with-balance': 'bg-orange-100 text-orange-700 border border-orange-200',
		// NotificationType
		request: 'bg-blue-100 text-blue-700 border border-blue-200',
		urgent: 'bg-red-100 text-red-700 border border-red-200',
		task: 'bg-purple-100 text-purple-700 border border-purple-200',
		system: 'bg-gray-100 text-gray-600 border border-gray-200',
		// TemplateStatus
		active: 'bg-green-100 text-green-700 border border-green-200',
		archived: 'bg-gray-100 text-gray-500 border border-gray-200',
		draft: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
		// Request statuses
		'correction requested': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
		approved: 'bg-green-100 text-green-700 border border-green-200'
	};

	const labelMap: Record<string, string> = {
		'for-verification': 'For Verification',
		'not-cleared': 'Not Cleared',
		'with-balance': 'With Balance',
		rush: 'Rush',
		regular: 'Regular',
		'correction requested': 'Correction Requested'
	};

	const classes = $derived(colorMap[value] ?? 'bg-gray-100 text-gray-600 border border-gray-200');
	const label = $derived(labelMap[value] ?? value.charAt(0).toUpperCase() + value.slice(1));
	const sizeClass = $derived(size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1');
</script>

<span class="inline-flex items-center rounded-full font-medium {sizeClass} {classes}">
	{label}
</span>
