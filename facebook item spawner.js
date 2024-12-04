// ==UserScript==
// @name        FB Marketplace New Item Tab Spawner
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/marketplace/nyc/*
// @grant       none
// @version     1.0
// @author      A.Y
// @description Opens fb tabs of new items! Herustic checks of the titles!
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_openInTab
// ==/UserScript==

// Add deleted drawer to see things youve deleted
// Manage Configuration here!
// EDIT the @match Parameter to your marketplace search results! i.e https://www.facebook.com/marketplace/nyc/*
startupDelay = 10 * 1000 // 10 Seconds to startup is recommended!
spawnTabDelay = 40 * 1000
// Excluded in title as to not open these tabs
excluded = ['free','ship']

// Helper functions
function formatImgSrc(imgsrc){
  return new URL(imgsrc).pathname.split('/').pop()
}

function saveDeleted(imgsrc){
  listings = GM_getValue("fbmarket",[])
  listings.push(formatImgSrc(imgsrc))
  GM_setValue("fbmarket",listings)
}

function getImgSrc(node){
  return node.querySelector('img').src
}

deletedCache = {}

function checkDeleted(addedNode){
  listings = GM_getValue("fbmarket",[])
  pathname = formatImgSrc(getImgSrc(addedNode))
  deletedCache[pathname] = addedNode
  if(listings.includes(pathname)){
    setTimeout(()=>{
      addedNode.style['display'] = 'none'
    },700)
    return null
  }
  for(const word of excluded){
    if(addedNode.innerText.toLowerCase().includes(word)){
      setTimeout(()=>{
        addedNode.style['display'] = 'none'
      },700)
      return null
    }
  }
  able.push(addedNode)
}

/*
function undo(){
  listings = GM_getValue("fbmarket",[])
  pathname = listings.pop()
  console.log(pathname)
  console.log(deletedCache)
  if(deletedCache.hasOwnProperty(pathname)){
    deletedCache[pathname].style['display'] = ''
  }
  GM_setValue("fbmarket",listings)
}

function createUndoButton(){
  undoButton = document.createElement('div')
  undoButton.style['position'] = 'fixed'
  undoButton.style['top'] = '10px'
  undoButton.style['left'] = '120px'
  undoButton.style['font-size'] = '30px'
  undoButton.innerHTML += '↩️'
  undoButton.addEventListener("click",undo)
  document.querySelector('body').appendChild(undoButton)
}

createUndoButton()
*/

collection = document.querySelector('div[aria-label="Collection of Marketplace items"]')
init = collection.getElementsByClassName("x9f619 x78zum5 x1r8uery xdt5ytf x1iyjqo2 xs83m0k x1e558r4 x150jy0e x1iorvi4 xjkvuk6 xnpuxes x291uyu x1uepa24")
setTimeout(()=>{
  for(const addedNode of init){
    checkDeleted(addedNode)
  }
},startupdelay)

const config = { attributes: true, childList: true, subtree: true };
const callback = (records, observer) => {
  for (const record of records) {
    for (const addedNode of record.addedNodes) {
      // TODO: Change to check for tag attribute instead 
      if(addedNode.className == "x9f619 x78zum5 x1r8uery xdt5ytf x1iyjqo2 xs83m0k x1e558r4 x150jy0e x1iorvi4 xjkvuk6 xnpuxes x291uyu x1uepa24"){
        checkDeleted(addedNode)
        console.log(addedNode)
      }
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(collection, config);

console.log(JSON.stringify(GM_getValue("fbmarket",[])))
setTimeout(()=>{
   for(var a of able.slice(0,3)){
    GM_openInTab(a.querySelector('a').href,true)
    saveDeleted(getImgSrc(a))
  }
},spawnTabDelay)

setTimeout(()=>{
  window.location.reload()
},reloadDelay)