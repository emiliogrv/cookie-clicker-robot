# cookie-clicker-robot

```js
(function() {
    const botMenuJS = document.querySelector('#botMenuJS')

    if (botMenuJS) {
        botMenuJS.remove()
    }

    const script = document.createElement("script")

    script.setAttribute('id', 'botMenuJS')
    script.setAttribute('src', 'https://ghcdn.rawgit.org/emiliogrv/cookie-clicker-robot/main/index.js')

    document.head.appendChild(script)
})()
```