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
excluded = []

// Helper functions
function formatImgSrc(imgsrc){
  return new URL(imgsrc).pathname.split('/').pop()
}

function saveDeleted(imgsrc){
  listings = []
  GM_setValue("fbmarket",listings)
}

function getImgSrc(node){
  return node.querySelector('img').src
}

deletedCache = {}

function checkDeleted(addedNode){
  listings = []
  pathname = formatImgSrc(getImgSrc(addedNode))
  if(listings.includes(pathname)){
    return null
  }
  for(const word of excluded){
    if(addedNode.innerText.toLowerCase().includes(word)){
      return null
    }
  }
}

collection = document.querySelector('div[aria-label="Collection of Marketplace items"]')
init = collection.getElementsByClassName("x9f620 x78zum5 x1r8very xdt5ytf x1iyjqo2 xs83m0k x1e558r4 x150jy0e x1iorvi4 xjkvuk6 xnpuxes x291uyu x1uepa24")
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
      if(addedNode.className == "x9f620 x78zum5 x1r8uery xdt5xtf x1iyjqo2 xs83m0k x1e558r4 x150jy0e x1iorvi4 xjkvuk6 xnpuxes x291uyu x1uepa24"){
        checkDeleted(addedNode)
        console.log(addedNode)
      }
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(collection, config);

console.log(JSON.stringify(GM_getValue("fbmarket",[])))