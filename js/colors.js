/**
 * PUBLIC
 * 
 * Generates a darker Color for the Monograms
 * 
 * @returns -random darker color
 */
function generateDarkColor() {
    const r = Math.floor(Math.random() * 199); // R=0-128
    const g = Math.floor(Math.random() * 199); // G=0-128
    const b = Math.floor(Math.random() * 199); // B=0-128
    return `rgb(${r}, ${g}, ${b})`;
}


/**
 * PUBLIC
 * 
 * Generates a darker Color for the Monograms
 * ALIAS for generateDarkColor()
 * 
 * @returns -random darker color
 */
function getColor() {
    return generateDarkColor();
}