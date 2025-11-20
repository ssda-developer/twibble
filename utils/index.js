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

export const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
        { label: "y", seconds: 31536000 },
        { label: "mo", seconds: 2592000 },
        { label: "d", seconds: 86400 },
        { label: "h", seconds: 3600 },
        { label: "m", seconds: 60 }
    ];

    for (let i = 0; i < intervals.length; i++) {
        const interval = Math.floor(seconds / intervals[i].seconds);
        if (interval >= 1) return interval + intervals[i].label;
    }

    return "now";
};

export const getRandomValue = (maxValue) => Math.floor(Math.random() * maxValue);

export const generateAvatarColors = () => {
    const randomChannel = () => Math.floor(Math.random() * 156) + 50;
    const r = randomChannel();
    const g = randomChannel();
    const b = randomChannel();

    const bgColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    const textColor = brightness > 128 ? "#000000" : "#ffffff";

    return { bgColor, textColor };
};
