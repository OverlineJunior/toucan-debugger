/** Formats a runtime in milliseconds for display. */
export function formatMs(ms: number): string {
	if (ms >= 1) return `${math.round(ms * 10) / 10}ms`

	const us = ms * 1000
	const usRounded = math.round(us * 10) / 10
	const showDecimal = usRounded < 10
	return showDecimal ? `${usRounded}µs` : `${math.round(us)}µs`
}
