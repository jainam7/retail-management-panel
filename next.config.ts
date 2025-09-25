/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false, // set true if you want a 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
