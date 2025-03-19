/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode : true,
    images: {
        domains: ['res.cloudinary.com'],
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:3001",
      }
};

export default nextConfig;
