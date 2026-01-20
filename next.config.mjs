import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    turbopack: {
        root: path.resolve(__dirname, ".")
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos"
            }
        ]
    }
};

export default nextConfig;
