export const formatCount = (count) => {
    if (!count) return 0;

    const format = (num, suffix) => {
        const rounded = Math.floor(num * 10) / 10;
        return rounded % 1 === 0 ? `${rounded}${suffix}` : `${rounded.toFixed(1)}${suffix}`;
    };

    if (count >= 1_000_000) return format(count / 1_000_000, "M");
    if (count >= 1_000) return format(count / 1_000, "K");

    return count;
};

export const kebabToPascal = (name) => {
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};
