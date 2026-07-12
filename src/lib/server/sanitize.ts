const HTML_ESCAPE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;'
};

export function escapeHtml(input: string): string {
	return input.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function stripControlCharacters(input: string): string {
	// eslint-disable-next-line no-control-regex
	return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export function sanitizePlainText(input: string, maxLength = 2000): string {
	return stripControlCharacters(input).trim().slice(0, maxLength);
}

export function sanitizeRichInput(input: string, maxLength = 5000): string {
	return escapeHtml(sanitizePlainText(input, maxLength));
}

export function isSafeUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'https:' || parsed.protocol === 'http:';
	} catch {
		return false;
	}
}

export function sanitizeObjectStrings<T extends Record<string, unknown>>(obj: T): T {
	const result = { ...obj } as Record<string, unknown>;
	for (const key of Object.keys(result)) {
		const value = result[key];
		if (typeof value === 'string') {
			result[key] = sanitizePlainText(value);
		}
	}
	return result as T;
}

export function generateCsrfToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
