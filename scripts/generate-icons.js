import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICONS_DIR = join(__dirname, '../src/lib/components/icons');
const INDEX_FILE = join(ICONS_DIR, 'index.js');

// Convert kebab-case or camelCase to PascalCase
function toPascalCase(str) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

// Extract viewBox from SVG
function extractViewBox(svgContent) {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
  return viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
}

// Extract width/height from SVG (for fallback)
function extractDimensions(svgContent) {
  const widthMatch = svgContent.match(/width=["'](\d+)["']/);
  const heightMatch = svgContent.match(/height=["'](\d+)["']/);
  return {
    width: widthMatch ? parseInt(widthMatch[1]) : 24,
    height: heightMatch ? parseInt(heightMatch[1]) : 24
  };
}

// Process SVG content to replace hardcoded colors with props
function processSVGContent(svgContent) {
  // Remove width and height attributes from SVG element (we'll use size prop)
  let processed = svgContent
    .replace(/<svg([^>]*)width=["'][^"']+["']/g, '<svg$1')
    .replace(/<svg([^>]*)height=["'][^"']+["']/g, '<svg$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract the inner content (paths, etc.) first
  const innerMatch = processed.match(/<svg[^>]*>(.*?)<\/svg>/s);
  let innerContent = innerMatch ? innerMatch[1].trim() : '';

  // Remove fill attributes from path elements (will inherit from SVG)
  innerContent = innerContent.replace(/fill=["'][^"']+["']/g, '');
  
  // Remove fill-opacity attributes
  innerContent = innerContent.replace(/fill-opacity=["'][^"']+["']/g, '');
  
  // Remove stroke attributes from path elements (will inherit from SVG)
  innerContent = innerContent.replace(/stroke=["'][^"']+["']/g, '');
  
  // Remove stroke-opacity attributes
  innerContent = innerContent.replace(/stroke-opacity=["'][^"']+["']/g, '');
  
  // Remove stroke-width attributes (will use SVG-level stroke-width)
  innerContent = innerContent.replace(/stroke-width=["'][^"']+["']/g, '');
  
  // Remove stroke-linecap and stroke-linejoin from paths (already on SVG element)
  innerContent = innerContent.replace(/stroke-linecap=["'][^"']+["']/g, '');
  innerContent = innerContent.replace(/stroke-linejoin=["'][^"']+["']/g, '');
  
  // Remove any incorrectly generated fill={fillColor} or stroke={strokeColor} attributes
  innerContent = innerContent.replace(/fill=\{fillColor\}/g, '');
  innerContent = innerContent.replace(/stroke=\{strokeColor\}/g, '');
  
  // Clean up any double spaces or malformed attributes
  innerContent = innerContent
    .replace(/\s+stroke-\s*/g, ' ')  // Remove any malformed stroke- attributes
    .replace(/\s{2,}/g, ' ')         // Remove double spaces
    .replace(/\s+>/g, '>')          // Remove space before closing bracket
    .trim();

  return innerContent;
}

async function generateIconComponent(svgPath, componentName) {
  const svgContent = await readFile(svgPath, 'utf-8');
  const viewBox = extractViewBox(svgContent);
  const innerContent = processSVGContent(svgContent);

  const componentContent = `<script>
  import BaseIcon from "./BaseIcon.svelte";

  export let variant = "fill";
  export let strokeWidth = 1.4;
  export let color = "hsl(var(--foreground))";
  export let size = 24;
  export let className = "";
</script>

<BaseIcon {variant} {strokeWidth} {color} {size} {className}>
  <svg
    width={size}
    height={size}
    viewBox="${viewBox}"
    fill={variant === "fill" ? color : "none"}
    stroke={variant === "outline" ? color : "none"}
    stroke-width={variant === "outline" ? strokeWidth : 0}
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${innerContent}
  </svg>
</BaseIcon>
`;

  const componentPath = join(ICONS_DIR, `${componentName}.svelte`);
  await writeFile(componentPath, componentContent, 'utf-8');
  return componentName;
}

async function updateIndexFile(componentNames) {
  const exports = componentNames
    .map(name => `export { default as ${name} } from './${name}.svelte';`)
    .join('\n');

  const indexContent = `/**
 * Icon Components Index
 * 
 * Export all icon components here for easier imports
 * 
 * Usage:
 * import { ArrowDown, Download } from '$lib/components/icons';
 */

${exports}
`;

  await writeFile(INDEX_FILE, indexContent, 'utf-8');
}

async function main() {
  try {
    const files = await readdir(ICONS_DIR);
    const svgFiles = files.filter(
      file => file.endsWith('.svg') && !file.startsWith('.')
    );

    console.log(`Found ${svgFiles.length} SVG files to convert...`);

    const componentNames = [];
    const existingComponents = new Set();

    // Get existing component names to avoid duplicates
    for (const file of files) {
      if (file.endsWith('.svelte') && file !== 'BaseIcon.svelte') {
        existingComponents.add(file.replace('.svelte', ''));
      }
    }

    for (const svgFile of svgFiles) {
      const baseName = basename(svgFile, '.svg');
      const componentName = toPascalCase(baseName);

      // Skip if component already exists (unless it's ArrowDown which we know exists)
      if (existingComponents.has(componentName) && componentName !== 'ArrowDown') {
        console.log(`  ⏭️  Skipping ${svgFile} (${componentName}.svelte already exists)`);
        continue;
      }

      const svgPath = join(ICONS_DIR, svgFile);
      await generateIconComponent(svgPath, componentName);
      componentNames.push(componentName);
      console.log(`  ✅ Generated ${componentName}.svelte from ${svgFile}`);
    }

    // Add existing components to the list
    for (const existing of existingComponents) {
      if (!componentNames.includes(existing)) {
        componentNames.push(existing);
      }
    }

    // Sort alphabetically
    componentNames.sort();

    await updateIndexFile(componentNames);
    console.log(`\n✅ Updated index.js with ${componentNames.length} icon exports`);
    console.log('\n🎉 Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();

