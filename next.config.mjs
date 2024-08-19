/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { _, dev }) => {
    if (dev) {
      config.stats = {
        logging: 'verbose',
      };
    }

    return config;
  },
};

export default nextConfig;
