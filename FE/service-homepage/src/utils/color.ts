export function generateColor() {
    console.log('#' + Math.floor(Math.random() * 16777215).toString(16));
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
