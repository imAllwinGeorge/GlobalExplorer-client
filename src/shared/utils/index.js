export const classNames = (...className) => {
    return className.filter(Boolean).join(" ");
};
