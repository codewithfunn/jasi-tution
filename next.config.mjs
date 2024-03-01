/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextConfig = {
  // modules: true,
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./app/styles/base.scss";`,
  },
  images: {
    domains: ["utfs.io"],
  },
};

export default nextConfig;
