/**
 * load from a key from localstorage if possible
 * 
 * @param {string} key - key to load from
 * @returns - JSON array 
 */
function loadFromLocalStorage(key) { // key 
    return JSON.parse(localStorage.getItem(key)); // ins Array umwandeln
}


/**
 * saves a JSON array to the key to local storage if possible
 * @param {string} key    - key
 * @param {object} value  - JSON array
 */
function saveToLocalStorage(key,value = {}) {
    localStorage.setItem(key,JSON.stringify(value));
}


/**
 * Remove the content of a key in local storage
 * 
 * @param {string} key 
 */
function removeKeyInLocalStorage(key) {
    localStorage.removeItem(key);
}
