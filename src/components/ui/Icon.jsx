import { kebabToPascal } from "@/src/utils";
import * as Outline from "@heroicons/react/24/outline";
import * as Solid from "@heroicons/react/24/solid";

const Icon = ({ name, type = "outline", className = "w-5 h-5" }) => {
    const IconSet = type === "solid" ? Solid : Outline;

    const Component = IconSet[`${kebabToPascal(name)}Icon`];

    if (!Component) return null;

    return <Component className={className} />;
};

export default Icon;
