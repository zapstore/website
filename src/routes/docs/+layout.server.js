import { generateNavigation } from '$lib/content.js';

export const prerender = true;

export async function load() {
  try {
    const navigation = await generateNavigation('docs');
    return { navigation: navigation || [] };
  } catch (error) {
    console.error('Error loading docs layout (server):', error);
    return { navigation: [] };
  }
}


