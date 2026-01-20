import { verifyOwner } from "@/lib/auth-check";
import { redirect } from "next/navigation";

export default async function PrivateLayout({ children, params }) {
    const parameters = await params;
    const userName = parameters.username;

    const owner = await verifyOwner(userName);

    if (!owner) {
        redirect("/");
        return null;
    }

    return <>{children}</>;
}
