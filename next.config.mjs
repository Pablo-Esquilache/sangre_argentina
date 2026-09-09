/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddazifkcvsvztdnafxpi.supabase.co',
      },
    ],
  },
};

export default nextConfig;
