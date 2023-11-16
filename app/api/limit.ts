// IPアドレス別にAPIリクエストの制限
// 5分間に20回まで

export const MAX_REQUESTS_PER_MINUTE = 20;
export const RESET_INTERVAL = 300 * 1000;
export const requestsPerMinute: Record<string, { count: number; lastReset: number }> = {};

export async function check(clientIP: string) {
	if (!requestsPerMinute[clientIP]) {
		requestsPerMinute[clientIP] = { count: 0, lastReset: Date.now() };
	}
	if (Date.now() - requestsPerMinute[clientIP].lastReset > RESET_INTERVAL) {
		requestsPerMinute[clientIP] = { count: 0, lastReset: Date.now() };
	}
	// if (requestsPerMinute[clientIP].count >= MAX_REQUESTS_PER_MINUTE) {
	// 	return NextResponse.json({ message: 'Too Many Requests' });
	// }
	requestsPerMinute[clientIP].count++;
}