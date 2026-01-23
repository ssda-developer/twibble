import { SITE_NAME } from "@/constants";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/" className="inline-block">
            <h1 className="text-2xl lg:text-4xl font-black">{SITE_NAME}</h1>
        </Link>
    );
};

export default Logo;
