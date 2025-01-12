import type { Theme } from '@/types/theme';
export interface Settings {
	general: {
		layout: 'grid' | 'list'
	}
	theme: {
		theme: 'light' | 'dark' | 'system' | 'preset' | 'custom'
		presetTheme?: string
		customTheme?: Theme
	}
	datetime: {
		format: '12h' | '24h'
		timezone: string
		showSeconds: boolean
	}
	search: {
		defaultEngine: 'google' | 'bing' | 'duckduckgo' | 'yahoo' | 'baidu' | 'yandex' | 'custom'
		selectedCustomEngine?: string
		customEngines?: Record<string, {
			name: string
			url: string
			keyword: string
		}>
	}
	background: {
		type: 'solid' | 'image' | 'slideshow'
		color: string
		interval?: number
		// todo: impl images
	}
	integrations: {
		spotify: {
			enabled: boolean
			showControls: boolean
		}
		github: {
			enabled: boolean
			feedItems: number
		}
		wakatime: {
			enabled: boolean
			defaultTimeframe: string
		}
	}
}

export const defaultSettings: Settings = {
	general: {
		layout: 'grid',
	},
	theme: {
		theme: 'system',
	},
	datetime: {
		format: '24h',
		timezone: 'auto',
		showSeconds: false,
	},
	search: {
		defaultEngine: 'google',
	},
	background: {
		type: 'solid',
		color: '#FFFFFF',
	},
	integrations: {
		spotify: {
			enabled: false,
			showControls: false,
		},
		github: {
			enabled: false,
			feedItems: 10,
		},
		wakatime: {
			enabled: false,
			defaultTimeframe: 'week',
		},
	},
};

export const validateSettings = (settings: unknown): settings is Settings => {
	if (!settings || typeof settings !== 'object') return false;

	const requiredKeys: (keyof Settings)[] = [
		'general', 'theme', 'datetime', 'search', 'background', 'integrations',
	];

	return requiredKeys.every(key =>
		key in settings && typeof (settings as any)[key] === 'object',
	);
}