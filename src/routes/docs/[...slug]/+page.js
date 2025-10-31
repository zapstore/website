import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const slug = params.slug ? (Array.isArray(params.slug) ? params.slug.join('/') : params.slug) : '';

	try {
		// Get all possible markdown files at build time
		const modules = import.meta.glob('/src/content/docs/**/*.md');

		let targetPath;
		if (!slug) {
			// Root docs page - try _index.md first, then fallback to other files
			const indexPath = '/src/content/docs/_index.md';
			if (modules[indexPath]) {
				targetPath = indexPath;
			} else {
				// Fallback to first available file
				const availablePaths = Object.keys(modules);
				targetPath = availablePaths.find(path => path.includes('_index.md')) || availablePaths[0];
			}
		} else {
			// Try different possible paths
			const possiblePaths = [
				`/src/content/docs/${slug}.md`,
				`/src/content/docs/${slug}/_index.md`
			];

			// Find the first existing path
			targetPath = possiblePaths.find(path => modules[path]);
		}

		if (!targetPath || !modules[targetPath]) {
			throw error(404, `Documentation page not found: ${slug}`);
		}

		const post = await modules[targetPath]();

		return {
			content: post.default,
			metadata: post.metadata || {}
		};
	} catch (err) {
		if (err.status) {
			throw err;
		}
		console.error('Error loading docs content:', err);
		throw error(500, 'Failed to load documentation');
	}
}
