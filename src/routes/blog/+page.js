export async function load() {
	// Include top-level posts and folder `_index.md` files (one-level folders)
	const modules = import.meta.glob('/src/content/blog/**/*.md');
	const entries = Object.entries(modules);

	const posts = await Promise.all(
		entries
			.filter(([path]) => {
				// Keep: /src/content/blog/<name>.md
				// Keep: /src/content/blog/<folder>/_index.md
				const rel = path.replace('/src/content/blog/', '');
				const parts = rel.split('/');
				if (parts.length === 1) return true; // top-level file
				if (parts.length === 2 && parts[1] === '_index.md') return true; // folder index
				return false; // ignore deeper files for now
			})
			.map(async ([path, resolver]) => {
				const { metadata } = await resolver();
				const rel = path.replace('/src/content/blog/', '');
				let slug;
				if (rel.endsWith('/_index.md')) {
					slug = rel.split('/')[0];
				} else {
					slug = rel.replace(/\.md$/, '');
				}
				return {
					meta: metadata || {},
					path: slug
				};
			})
	);

	// Sort by date (newest first)
	const sortedPosts = posts.sort((a, b) => {
		const ad = a.meta?.date ? new Date(a.meta.date) : 0;
		const bd = b.meta?.date ? new Date(b.meta.date) : 0;
		return bd - ad;
	});

	return {
		posts: sortedPosts
	};
}
