export interface Theme {
	// Primary colors
	accent: string 			// Brand color, primary actions, links
	background: string 		// Main background color
	surface: string 		// Card/container backgrounds

	// Text colors
	textPrimary: string 	// Main text color
	textSecondary: string 	// Secondary/muted text
	textAccent: string 		// Text on accent-colored backgrounds

	// UI colors
	border: string 			// Borders, dividers
	hover: string 			// Hover state backgrounds
	shadow: string 			// Box shadows, overlays
	error: string 			// Error states, destructive actions
}

export const defaultLightTheme: Theme = {
	accent: '#007AFF',
	background: '#FFFFFF',
	surface: '#F5F5F5',
	textPrimary: '#000000',
	textSecondary: '#666666',
	textAccent: '#FFFFFF',
	border: '#E0E0E0',
	hover: '#F0F0F0',
	shadow: 'rgba(0, 0, 0, 0.1)',
	error: '#FF3B30',
};

export const defaultDarkTheme: Theme = {
	accent: '#0A84FF',
	background: '#000000',
	surface: '#1C1C1E',
	textPrimary: '#FFFFFF',
	textSecondary: '#8E8E93',
	textAccent: '#FFFFFF',
	border: '#38383A',
	hover: '#2C2C2E',
	shadow: 'rgba(0, 0, 0, 0.3)',
	error: '#FF453A',
};

export const validateTheme = (theme: unknown): theme is Theme => {
	if (!theme || typeof theme !== 'object') return false;

	const requiredKeys: (keyof Theme)[] = [
		'accent', 'background', 'surface',
		'textPrimary', 'textSecondary', 'textAccent',
		'border', 'hover', 'shadow', 'error',
	];

	return requiredKeys.every(key =>
		key in theme && typeof (theme as any)[key] === 'string',
	);
};