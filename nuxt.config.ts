export default defineNuxtConfig({
    css: [
        'mapbox-gl/dist/mapbox-gl.css',
        '~/assets/css/main.css'
    ],

    app: {
        rootAttrs: {
            'vaul-drawer-wrapper': '',
            'class': 'bg-[var(--ui-bg)]'
        },
        head: {
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        },
       /* pageTransition: {
            name: 'slide'
        }*/
    },
     vite: {
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:5142',
                    changeOrigin: true,
                    rewrite: (path) => {
                        return path.replace(/^\/api/, '');
                    }
                },
                '/locationHub': {
                    target: 'https://sekerlerteknoloji.com',
                    ws: true,
                    changeOrigin: false,
                },
                '/autocomplete': {
                    target: 'https://sekerlerteknoloji.com',
                    changeOrigin: true,
                },
                '/reverse': {
                    target: 'https://sekerlerteknoloji.com',
                    changeOrigin: true,
                },
                '/ors': {
                    target: 'https://sekerlerteknoloji.com',
                    changeOrigin: true,
                }

            }
        }
     },
    compatibilityDate: '2024-04-03',
    ssr: false,
    devtools: {enabled: true},
    modules: ['@nuxt/ui', '@nuxtjs/color-mode' , '@nuxtjs/google-fonts', '@nuxt/scripts', '@pinia/nuxt', '@vueuse/nuxt', 'nuxt-tour'],
    colorMode: {
        preference: 'dark', // Varsayılan olarak 'dark' modunu ayarla
        fallback: 'light',  // Tarayıcı desteklemiyorsa fallback olarak 'light'
        hid: 'nuxt-color-mode-script',
        globalName: 'colorMode',
        classSuffix: ''
    },
    ui: {
        safelistColors: ['dark']
    },
    googleFonts: {
        families: {
            "Outfit": true
        },
    },
    tailwindcss: {
        config: {
            safelist: [
                'translate-y-[100%]',
            ],
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                        serif: ['Outfit', 'serif'],
                    },
                    colors: {
                        'base': {
                            50: '#fef2f2',
                            100: '#fee2e2',
                            200: '#fecaca',
                            300: '#fca5a5',
                            400: '#f87171',
                            500: '#ef4444',
                            600: '#dc2626',
                            700: '#b91c1c',
                            800: '#991b1b',
                            900: '#7f1d1d',
                            950: '#450a0a',
                        }
                    }
                }
            }
        },
    }
})
