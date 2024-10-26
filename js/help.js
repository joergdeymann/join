/**
 * 
 * highlights all "JOIN" blue
 */
function highlightJoin() {
    document.body.innerHTML = document.body.innerHTML.replace(/Join/g, '<span class="highlight-join">Join</span>');
}