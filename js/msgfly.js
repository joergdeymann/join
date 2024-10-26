/**
 * Let a Msg fly form Bottom to Center 
 * Time 900ms
 * Wait after 800ms
 * Together 1700ms until continue
 */
async function msgfly(sleep=1700) 
{
    let disabled=document.querySelector(".msgflydisable");
    let msgfly=document.getElementById("msgfly");
    let itemfly=msgfly.querySelector(".msgfly");
    
    disabled?.disabled;
    msgfly.style.visibility="visible";
    itemfly.classList.add("msgflyin");
    await new Promise(e => setTimeout(e,sleep));
    msgfly.style.visibility="";
    itemfly.classList.remove("msgflyin");
    if (disabled) disabled.disabled=false;
}