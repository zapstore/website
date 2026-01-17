import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICONS_DIR = join(__dirname, '../src/lib/components/icons');

async function fixIconFills() {
  try {
    const files = await readdir(ICONS_DIR);
    const svelteFiles = files.filter(
      file => file.endsWith('.svelte') && file !== 'BaseIcon.svelte'
    );

    console.log(`Found ${svelteFiles.length} icon components to check...`);

    let fixedCount = 0;
    for (const file of svelteFiles) {
      const filePath = join(ICONS_DIR, file);
      let content = await readFile(filePath, 'utf-8');
      const originalContent = content;

      // Remove fill={fillColor} and stroke={strokeColor} attributes
      content = content.replace(/fill=\{fillColor\}/g, '');
      content = content.replace(/stroke=\{strokeColor\}/g, '');

      // Clean up any double spaces that might result
      content = content.replace(/\s{2,}/g, ' ');
      content = content.replace(/\s+>/g, '>');

      if (content !== originalContent) {
        await writeFile(filePath, content, 'utf-8');
        console.log(`  ✅ Fixed ${file}`);
        fixedCount++;
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} icon components`);
  } catch (error) {
    console.error('Error fixing icons:', error);
    process.exit(1);
  }
}

fixIconFills();

