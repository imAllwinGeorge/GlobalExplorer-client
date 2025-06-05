export const classNames = (...className: string []) => {
    return className.filter(Boolean).join(" ")
}