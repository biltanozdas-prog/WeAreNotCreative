/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async redirects() {
        return [
            // /blog was renamed to /journal — keep old shared links working.
            { source: '/blog', destination: '/journal', permanent: true },
            { source: '/blog/:slug', destination: '/journal/:slug', permanent: true },
        ]
    },
}

export default nextConfig
