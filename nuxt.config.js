import customLang from "./plugins/locale"

export default {
    /*
     ** Nuxt rendering mode
     ** See https://nuxtjs.org/api/configuration-mode
     */
    mode: 'spa',
    router: {
        base: "/"
    },
    /*
     ** Nuxt target
     ** See https://nuxtjs.org/api/configuration-target
     */
    target: 'server',
    /*
     ** Headers of the page
     ** See https://nuxtjs.org/api/configuration-head
     */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: 'IBPay-Merchant Platform',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
        script: [
            // { src: "/js/verifyLogin.js" }
        ]
    },
    /*
     ** Global CSS
     */
    css: [
        'typeface-roboto/index.css',
        '@mdi/font/css/materialdesignicons.css'
    ],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: [
        '~/plugins/toast',
        '~/plugins/clip',
        '~/plugins/iconfont',
        '~/plugins/element',
    ],
    /*
     ** Auto import components
     ** See https://nuxtjs.org/api/configuration-components
     */
    components: true,
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        '@nuxtjs/vuetify'
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/style-resources',
    ],
    styleResources: {
        stylus: [
            './assets/main.styl',
            './assets/light.styl',
            './assets/dark.styl'
        ]
    },
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        proxy: true,
    },
    proxy: {
        '/api': {
            target: 'http://localhost',
            pathRewrite: {
                // '^/api/': ''
            }
        }
    },
    /*
     ** vuetify module configuration
     ** https://github.com/nuxt-community/vuetify-module
     */
    vuetify: {
        defaultAssets: false,
        customVariables: ['~/assets/variables.scss'],
        lang: {
            locales: customLang.locale,
            current: customLang.current
        },
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: '#4266FF',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                },
                dark: {
                    primary: '#2196F3',
                    secondary: '#424242',
                    accent: '#FF4081',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                },
            }
        },
        icons: {
            iconfont: 'mdi', // 设置使用本地的icon资源
        }
    },
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {}
}