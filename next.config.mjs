/** @type {import('next').NextConfig} */
console.info(
  `SUPABASE_URL_PRESENT=${Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)} SUPABASE_PUBLISHABLE_KEY_PRESENT=${Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)}`,
)

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
