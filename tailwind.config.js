/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    container: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '900px',
        xl: '1000px',
        '2xl': '1100px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        xs: 'var(--radius-4)',   // 4px
        sm: 'var(--radius-8)',   // 8px
        md: 'var(--radius-12)',  // 12px
        lg: 'var(--radius-16)',  // 16px - primary workhorse
        xl: 'var(--radius-24)',  // 24px
        '2xl': 'var(--radius-32)', // 32px - pairs perfectly with 16px padding
        full: '9999px'
      },
      borderWidth: {
        'thick': 'var(--border-thick)',
        'base': 'var(--border-base)',
        'subtle': 'var(--border-subtle)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace']
      }
    }
  },
  plugins: []
}; 