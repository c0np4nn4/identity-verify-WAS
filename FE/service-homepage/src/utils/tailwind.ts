export function cls(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
