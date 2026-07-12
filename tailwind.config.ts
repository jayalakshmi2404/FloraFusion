import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				bloom: {
					50: '#fdf4f7',
					100: '#fbe8ee',
					200: '#f6cddb',
					300: '#eea3bc',
					400: '#e1709a',
					500: '#cf4a7c',
					600: '#b32e60',
					700: '#93204c',
					800: '#7a1d41',
					900: '#681c3a'
				},
				sage: {
					50: '#f4f7f3',
					100: '#e5ede2',
					200: '#cddcc7',
					300: '#a9c39e',
					400: '#7fa470',
					500: '#5f884f',
					600: '#4a6c3e',
					700: '#3c5633',
					800: '#32452c',
					900: '#2b3a26'
				},
				cream: {
					50: '#fffdf8',
					100: '#fdf8ec',
					200: '#faefd3',
					300: '#f5e0ab',
					400: '#eecb79',
					500: '#e5b34e'
				},
				charcoal: {
					50: '#f6f6f7',
					100: '#e2e3e5',
					700: '#3a3a3f',
					800: '#26262a',
					900: '#18181b'
				}
			},
			fontFamily: {
				display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
				body: ['"Inter"', 'system-ui', 'sans-serif']
			},
			boxShadow: {
				glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
				bloom: '0 10px 40px -10px rgba(207, 74, 124, 0.35)'
			},
			backdropBlur: {
				xs: '2px'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.4s ease-out',
				shimmer: 'shimmer 2s linear infinite',
				float: 'float 6s ease-in-out infinite'
			},
			keyframes: {
				fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	},
	plugins: [forms, typography]
} satisfies Config;
