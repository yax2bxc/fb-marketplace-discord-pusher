
// ==UserScript==
// @name        FB marketplace item discord Pusher
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/marketplace/item/*
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      A.Y
// @description Automatically pushes onto the discord webhook and closes the tab!
// ==/UserScript==

// Manage Configuration here!
// Discord webhook url to push embeds onto
discordwebhookurl = "YOUR URL HERE"
// Excluded description words as to not push scams onto the discord webhook
var bioexcluded = []

function formatImgSrc(imgsrc){
  return new URL()
}

function checkPage(){
  var inline = null
  var bio = null
  var thumbnail = null
  var innerText = null

  if(document.querySelector('[style="display:inline"]')){
      inline = document.querySelectorAll('[style="display:inline"]')[0]
      bio = inline.querySelector('ul').nextElementSibling.innerText
      // thumbnail = inline.querySelector('[aria-label="Thumbnail 0"]').querySelector('img').src
      thumbnail = inline.querySelector('img').src
      innerText = inline.innerText.split("\n")
  }
  else {
      inline = document.querySelectorAll('[style="display: inline;"]')[0]
      bio = inline.querySelector('ul').nextElementSibling.innerText
      // There is a single thumbnail variant
      if(inline.querySelector('[aria-label="Thumbnail 1"]')){
        thumbnail = inline.querySelector('[aria-label="Thumbnail 1"]').querySelector('img').src
        innerText = inline.innerText.split("\n").slice(1)
      }
      else {
        thumbnail = inline.querySelector('img').src
        innerText = inline.innerText.split("\n")
      }
  }

  // The only heursitc and evaluation really for now...
  if(bioexcluded.some(a=>bio.toLowerCase().includes(a))){
    return null
  }

  // if(innerText.includes('Joined Facebook in 2024')){
  //   return null
  // }

  var title =  innerText[0]
  var description = bio.replace(/\n+/g, '\n')
  var author = `$${innerText[1].split('$')[1]}` + " " + innerText[4]
  var date =  new Date().toLocaleString('en-US') + "/ Posted " + innerText[3]
  embedSend(title,description,thumbnail,author,date)
}

// const stateAbbreviations = [", AL", ", AK", ", AZ", ", AR", ", CA", ", CO", ", DE", ", FL", ", GA", ", HI", ", ID", ", IL", ", IN", ", IA", ", KS", ", KY", ", LA", ", ME", ", MD", ", MA", ", MI", ", MN", ", MS", ", MO", ", MT", ", NE", ", NV", ", NH", ", NM", ", NC", ", ND", ", OH", ", OK", ", OR", ", PA", ", RI", ", SC", ", SD", ", TN", ", TX", ", UT", ", VT", ", VA", ", WA", ", WV", ", WI", ", WY"]

function embedSend(title,description,thumbnail,author,footer){
  console.log("Sending")
  var myurl = new URL(window.location.href)
  data = {embeds:[{
    "title": title,
      "description": description,
      "url": myurl.origin + myurl.pathname,
      "color": 5814783,
      "image": {
        "url": thumbnail
      },
      "author":{
        "name":author,
        "icon_url":"https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
      },
      "footer":{
        "text":footer,
      },
}]}

GM_xmlhttpRequest({
  method:"POST",
  url: discordwebhookurl,
  data: JSON.stringify(data),
  headers: {
    "Content-type": "application/json",
  },
  onload: function(response){
          console.log([
            response.status,
            response.statusText,
            response.readyState,
            response.responseHeaders,
            response.responseText,
            response.finalUrl,
          ].join("\n"))
        },
})
}

GM_registerMenuCommand("Send Embed",()=>{
  console.log("Sending!")
  checkPage()
})