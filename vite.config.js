import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import compression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Gzip compression
		compression({
			algorithm: 'gzip',
			ext: '.gz',
			threshold: 1024, // Only compress files larger than 1KB
			deleteOriginFile: false
		}),
		// Brotli compression (better compression than gzip)
		compression({
			algorithm: 'brotliCompress',
			ext: '.br',
			threshold: 1024,
			deleteOriginFile: false
		})
	],
	resolve: {
		alias: {
			$content: path.resolve('./src/content')
		}
	},
	assetsInclude: ['**/*.md'],
	build: {
		// Enable CSS code splitting for better caching
		cssCodeSplit: true,
		// Optimize asset handling
		assetsInlineLimit: 4096, // Inline assets smaller than 4kb as base64
		rollupOptions: {
			output: {
				// Manual chunk splitting for better caching
				manualChunks: (id) => {
					// Vendor chunks
					if (id.includes('node_modules')) {
						// Separate font packages
						if (id.includes('@fontsource')) {
							return 'fonts';
						}
						// Separate large dependencies
						if (id.includes('nostr-tools') || id.includes('ws')) {
							return 'nostr';
						}
						// Other vendor code
						return 'vendor';
					}
				}
			}
		},
		// Minify options
		minify: 'esbuild',
		target: 'es2020',
		// Enable source maps for production debugging (can disable for smaller builds)
		sourcemap: false
	},
	// Optimize dependencies
	optimizeDeps: {
		include: [
			'@fontsource/geist-sans',
			'@fontsource/geist-mono'
		]
	}
});
