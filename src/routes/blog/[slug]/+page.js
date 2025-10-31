import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const slug = params.slug;

	try {
		// Support top-level files `slug.md` and folder `_index.md` at `slug/_index.md`
		const modules = import.meta.glob('/src/content/blog/**/*.md');
		const targetTopLevel = `/src/content/blog/${slug}.md`;
		const targetFolderIndex = `/src/content/blog/${slug}/_index.md`;

		let loader = modules[targetTopLevel] || modules[targetFolderIndex];
		if (!loader) {
			throw error(404, `Blog post not found: ${slug}`);
		}

		const post = await loader();

		return {
			content: post.default,
			metadata: post.metadata || {}
		};
	} catch (err) {
		if (err.status) {
			throw err;
		}
		console.error('Error loading blog post:', err);
		throw error(500, 'Failed to load blog post');
	}
}
