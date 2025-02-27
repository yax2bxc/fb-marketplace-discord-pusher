# Marketplace Discord Webhook Pusher

![alt text](image.png)

A marketplace userscript that checks the marketplace intervally and pushes onto a discord webhook!

## Requirements

- Chrome Browser
- Violent Monkey Extension
- Faceb Account

## Steps to Run

1. Open Chrome
2. Navigate to faceb and log in with your personal account
3. Install the two Userscripts onto violentmonkey
4. Adjust the excluded keywords in item spawner.js
```js
excluded = ['free'] 
```
4. Adjust the webhook in item pusher.js
```js
discordwebhookurl = "YOUR URL HERE"
```
5. Enable the userscripts
6. Navigate to marketplace and search item of your choosing
7. Adjust the location of your choosing, pick sort by new and listed within 7 days for best results
![alt text](image-1.png)