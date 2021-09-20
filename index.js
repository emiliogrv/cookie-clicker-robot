if (clicker) {
    clicker.stop()

    clearInterval(clicker.intervalAscendGuard)
} else {
    var clicker
}

clicker = {
    config: {
        shouldBuyBuildings: false,
        shouldBuyBuildingsFirst: false,
        shouldBuyBuildingsOnlyWhenBuffs: false,
        shouldBuyUpgrades: false,
        shouldBuyUpgradesAllButton: false,
        shouldClearNotifications: true,
        shouldClearWrinklers: false,
        shouldClickBigCookie: true,
        shouldClickFortuneCookie: false,
        shouldClickGoldenCookies: true
    },

    elementBuffs: null,
    elementMenuWrapper: null,
    elementShimmers: null,
    elementUpgrades: null,
    elementUpgradesBuyAllButton: null,
    elementWrinklers: null,

    hasOneMind: false,

    intervalAscendGuard: 0,
    intervalBigCookie: 0,
    intervalBuy: 0,
    intervalClearNotifications: 0,
    intervalClearWrinklers: 0,
    intervalFortuneCookie: 0,
    intervalOneMind: 0,
    intervalShimmer: 0,

    isBotRunning: false,
    isWrinklersClear: true,

    buyBuildings() {
        if (!this.config.shouldBuyBuildings) {
            return
        }

        const products = document.querySelectorAll('.product.unlocked')

        products[products.length - 1].click()
    },

    buyUpgrades() {
        if ((this.config.shouldBuyBuildingsOnlyWhenBuffs && this.elementBuffs.childElementCount) || !this.config.shouldBuyUpgrades) {
            return
        }

        const upgrade = this.elementUpgradesBuyAllButton || this.elementUpgrades.querySelector('.enabled')

        if (upgrade) {
            upgrade.click()
        }
    },

    clearWrinklers() {
        setTimeout(() => {
            const wrinkler = Game.wrinklers.find(({ close }) => close)

            if (wrinkler) {
                Game.Click = 1
                Game.mouseX = wrinkler.x + 1
                Game.mouseY = wrinkler.y + 1

                this.clearWrinklers()
            } else {
                Game.mouseX = 0
                Game.mouseY = 0

                this.isWrinklersClear = true
            }
        }, 100)
    },

    configLoad() {
        Object.assign(
            this.config,
            JSON.parse(
                localStorage.getItem('botConfig') || '{}'
            )
        )
    },

    configSave() {
        localStorage.setItem(
            'botConfig',
            JSON.stringify(this.config)
        )
    },

    handleChangeBuyBuildings() {
        this.config.shouldBuyBuildings = !this.config.shouldBuyBuildings

        this.configSave()

        this.mountMenuHTML()
    },

    handleChangeBuyBuildingsFirst() {
        this.config.shouldBuyBuildingsFirst = !this.config.shouldBuyBuildingsFirst

        this.configSave()

        this.mountMenuHTML()
    },

    handleChangeBuyBuildingsOnlyWhenBuffs() {
        this.config.shouldBuyBuildingsOnlyWhenBuffs = !this.config.shouldBuyBuildingsOnlyWhenBuffs

        this.configSave()

        this.mountMenuHTML()
    },

    handleChangeBuyUpgrades() {
        this.config.shouldBuyUpgrades = !this.config.shouldBuyUpgrades

        this.configSave()

        this.mountMenuHTML()
    },

    handleChangeBuyUpgradesAllButton() {
        this.config.shouldBuyUpgradesAllButton = !this.config.shouldBuyUpgradesAllButton

        this.configSave()

        this.setElementUpgradesBuyAllButton()

        this.mountMenuHTML()
    },

    handleChangeClearNotifications() {
        this.config.shouldClearNotifications = !this.config.shouldClearNotifications

        this.configSave()

        if (this.config.shouldClearNotifications) {
            this.initClearNotifications()
        } else {
            clearInterval(this.intervalClearNotifications)
        }

        this.mountMenuHTML()
    },

    handleChangeClearWrinklers() {
        this.config.shouldClearWrinklers = !this.config.shouldClearWrinklers

        this.configSave()

        if (this.config.shouldClearWrinklers) {
            this.initClearWrinklers()
        } else {
            clearInterval(this.intervalClearWrinklers)
        }

        this.mountMenuHTML()
    },

    handleChangeClickBigCookie() {
        this.config.shouldClickBigCookie = !this.config.shouldClickBigCookie

        this.configSave()

        if (this.config.shouldClickBigCookie) {
            this.initBigCookie()
        } else {
            clearInterval(this.intervalBigCookie)
        }

        this.mountMenuHTML()
    },

    handleChangeClickFortuneCookie() {
        this.config.shouldClickFortuneCookie = !this.config.shouldClickFortuneCookie

        this.configSave()

        if (this.config.shouldClickFortuneCookie) {
            this.initFortuneCookie()
        } else {
            clearInterval(this.intervalFortuneCookie)
        }

        this.mountMenuHTML()
    },

    handleChangeClickGoldenCookies() {
        this.config.shouldClickGoldenCookies = !this.config.shouldClickGoldenCookies

        this.configSave()

        if (this.config.shouldClickGoldenCookies) {
            this.initShimmer()
        } else {
            clearInterval(this.intervalShimmer)
        }

        this.mountMenuHTML()
    },

    handleClickClearWrinklers() {
        this.isWrinklersClear = false

        setTimeout(() => {
            this.elementWrinklers.click()

            this.clearWrinklers()
        }, 100)
    },

    init() {
        if (!Game) {
            return
        }

        this.hasOneMind = Game.Has('One mind')
        this.isBotRunning = true

        this.configLoad()
        this.initBigCookie()
        this.initClearNotifications()
        this.initClearWrinklers()
        this.initElementBuffs()
        this.initElementUpgrades()
        this.initFortuneCookie()
        this.initShimmer()

        this.initBuy()

        this.mountMenuCSS()
        this.mountMenuHTML()

        this.initAscendGuard()
        this.initOneMindWatcher()
    },

    initAscendGuard() {
        document.querySelector('#legacyButton').onclick = () => setTimeout(() => {
            if (this.isBotRunning) {
                if (confirm('This action will stop the clicker bot.\nDo you want to continue?\n\nNOTE: You\'ll have to activate it manually.')) {
                    this.stop()
                } else {
                    Game.ClosePrompt()
                }
            }
        }, 250)

        clearInterval(this.intervalAscendGuard)

        this.intervalAscendGuard = setInterval(() => {
            this.elementMenuWrapper.style.display = Game.OnAscend ? 'none' : ''
        }, 1000)
    },

    initBigCookie() {
        const bigCookie = document.querySelector('#bigCookie')

        this.intervalBigCookie = setInterval(() => {
            if (this.isWrinklersClear && !Game.OnAscend) {
                bigCookie.click()
            }
        }, 1)
    },

    initBuy() {
        this.setElementUpgradesBuyAllButton()

        this.intervalBuy = setInterval(() => {
            if (this.isWrinklersClear) {
                if (this.config.shouldBuyBuildingsFirst) {
                    this.buyBuildings()
                    this.buyUpgrades()
                } else {
                    this.buyUpgrades()
                    this.buyBuildings()
                }
            }
        }, 1000 * 10)
    },

    initClearNotifications() {
        if (!this.config.shouldClearNotifications) {
            return
        }

        this.intervalClearNotifications = setInterval(() => Game.CloseNotes(), 1000 * 60)
    },

    initClearWrinklers() {
        this.elementWrinklers = document.querySelector('#backgroundLeftCanvas')

        if (!this.config.shouldClearWrinklers) {
            return
        }

        this.intervalClearWrinklers = setInterval(() => {
            if (this.isWrinklersClear && this.hasOneMind) {
                if (this.hasWrinklers()) {
                    this.handleClickClearWrinklers()
                }
            }
        }, 1000 * 60)
    },

    initElementBuffs() {
        this.elementBuffs = document.querySelector('#buffs')
    },

    initElementUpgrades() {
        this.elementUpgrades = document.querySelector('#upgrades')
    },

    initFortuneCookie() {
        if (!this.config.shouldClickFortuneCookie) {
            return
        }

        const commentsText = document.querySelector('#commentsText')

        this.intervalFortuneCookie = setInterval(() => {
            const fortuneCookie = commentsText.querySelector('.fortune')

            if (this.isWrinklersClear && fortuneCookie) {
                fortuneCookie.click()
            }
        }, 500)
    },

    initOneMindWatcher() {
        this.intervalOneMind = setInterval(() => {
            this.hasOneMind = Game.Has('One mind')

            if (this.hasOneMind) {
                clearInterval(this.intervalOneMind)

                this.mountMenuHTML()
            }
        }, 1000)
    },

    initShimmer() {
        this.elementShimmers = document.querySelector('#shimmers')

        this.intervalShimmer = setInterval(() => {
            if (this.isWrinklersClear) {
                const shimmers = document.querySelector('#shimmers').children

                for (let i = 0; i < shimmers.length; i++) {
                    shimmers[i].click()
                }
            }
        }, 100)
    },

    hasWrinklers() {
        return Game.wrinklers.reduce((p, c) => p + c.close, 0)

        // I don't know if it's only used for wrinklers
        // return Game.cpsSucked > 0
    },

    mountMenuCSS() {
        const botMenuCSS = document.querySelector('#botMenuCSS')

        const style = botMenuCSS || document.createElement("style")

        style.setAttribute('id', 'botMenuCSS')
        style.innerHTML = `
            #botMenuWrapper {
                background-color: rgb(0 0 0 / 50%);
                cursor: move;
                padding: 10px;
                position: fixed;
                z-index: 100000;
            }

            #botMenuWrapper:hover {
                background-color: rgb(0 0 0 / 80%);
            }

            #botMenuWrapper button:not([disabled]) {
                cursor: pointer;
                margin-top: 5px;
            }

            #botMenuWrapper checkbox, #botMenuWrapper label {
                cursor: pointer;
            }

            #botMenuWrapper h4 {
                margin-top: 5px;
            }
        `

        if (!botMenuCSS) {
            document.head.appendChild(style)
        }
    },

    mountMenuHTML() {
        let x = 0
        let y = 0
        const botMenuWrapper = document.querySelector('#botMenuWrapper')

        const menu = this.elementMenuWrapper = botMenuWrapper || document.createElement("div")
        const {
            shouldBuyBuildings,
            shouldBuyBuildingsFirst,
            shouldBuyBuildingsOnlyWhenBuffs,
            shouldBuyUpgrades,
            shouldBuyUpgradesAllButton,
            shouldClearNotifications,
            shouldClearWrinklers,
            shouldClickBigCookie,
            shouldClickFortuneCookie,
            shouldClickGoldenCookies
        } = this.config

        function mouseMoveHandler(e) {
            // Set the position of element
            menu.style.top = `${menu.offsetTop + e.y - y}px`
            menu.style.left = `${menu.offsetLeft + e.x - x}px`

            // Reassign the position of mouse
            x = e.x
            y = e.y
        }

        function mouseUpHandler() {
            // Remove the handlers of `mousemove` and `mouseup`
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        menu.setAttribute('id', 'botMenuWrapper')
        menu.style.display = Game.OnAscend ? 'none' : ''
        menu.style.top = `calc(100vh - ${this.hasOneMind ? 525 : 450}px)`
        // Handle the mousedown event
        // that's triggered when user drags the element
        menu.onmousedown = (e) => {
            // Get the current mouse position
            x = e.x
            y = e.y

            // Attach the listeners to `document`
            document.addEventListener('mousemove', mouseMoveHandler)
            document.addEventListener('mouseup', mouseUpHandler)
        }
        menu.innerHTML = `
            <section>
                <h4>Clicker bot <span style="color: ${this.isBotRunning ? 'green' : 'red'}; margin-right: 10px">⦿</span></h4>
                <button onclick="clicker.init()" ${this.isBotRunning ? 'disabled' : ''}>Start</button>
                <button onclick="clicker.stop()" ${this.isBotRunning ? '' : 'disabled'}>Stop</button>
            </section>

            <section>
                <h4>Cookies</h4>

                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="botShouldClickBigCookie"
                            ${shouldClickBigCookie ? 'checked' : ''}
                            onchange="clicker.handleChangeClickBigCookie()">
                        <label for="botShouldClickBigCookie">Click Big cookie</label>
                    </li>

                    <li>
                        <input
                            type="checkbox"
                            id="botShouldClickFortuneCookie"
                            ${shouldClickFortuneCookie ? 'checked' : ''}
                            onchange="clicker.handleChangeClickFortuneCookie()">
                        <label for="botShouldClickFortuneCookie">Click Fortune cookies</label>
                    </li>

                    <li>
                        <input
                            type="checkbox"
                            id="botShouldClickGoldenCookies"
                            ${shouldClickGoldenCookies ? 'checked' : ''}
                            onchange="clicker.handleChangeClickGoldenCookies()">
                        <label for="botShouldClickGoldenCookies">Click Golden cookies</label>
                    </li>
                </ul>
            </section>

            <section>
                <h4>Buildings</h4>

                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="botShouldBuyBuildings"
                            ${shouldBuyBuildings ? 'checked' : ''}
                            onchange="clicker.handleChangeBuyBuildings()">
                        <label for="botShouldBuyBuildings">Buy Buildings</label>
                    </li>

                    <li>
                        <input
                            type="checkbox"
                            id="botShouldBuyBuildingsFirst"
                            ${shouldBuyBuildingsFirst ? 'checked' : ''}
                            onchange="clicker.handleChangeBuyBuildingsFirst()">
                        <label for="botShouldBuyBuildingsFirst">Buy Buildings first</label>
                    </li>

                    <li>
                        <input
                            type="checkbox"
                            id="botShouldBuyBuildingsOnlyWhenBuffs"
                            ${shouldBuyBuildingsOnlyWhenBuffs ? 'checked' : ''}
                            onchange="clicker.handleChangeBuyBuildingsOnlyWhenBuffs()">
                        <label for="botShouldBuyBuildingsOnlyWhenBuffs">Buy Buildings only when Buffs</label>
                    </li>
                </ul>
            </section>

            <section>
                <h4>Upgrades</h4>

                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="botShouldBuyUpgrades"
                            ${shouldBuyUpgrades ? 'checked' : ''}
                            onchange="clicker.handleChangeBuyUpgrades()">
                        <label for="botShouldBuyUpgrades">Buy Upgrades</label>
                    </li>

                    <li>
                        <input
                            type="checkbox"
                            id="botShouldBuyUpgradesAllButton"
                            ${shouldBuyUpgradesAllButton ? 'checked' : ''}
                            onchange="clicker.handleChangeBuyUpgradesAllButton()">
                        <label for="botShouldBuyUpgradesAllButton">Buy Upgrades with All Button</label>
                    </li>
                </ul>
            </section>

            <section style="display: ${this.hasOneMind ? '' : 'none'}">
                <h4>Wrinklers</h4>

                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="botShouldClearWrinklers"
                            ${shouldClearWrinklers ? 'checked' : ''}
                            onchange="clicker.handleChangeClearWrinklers()">
                        <label for="botShouldClearWrinklers">Clear Wrinklers</label>
                    </li>

                    <li>
                        <button onclick="clicker.handleClickClearWrinklers()">Clear Wrinklers now</button>
                    </li>
                </ul>
            </section>

            <section>
                <h4>Misc</h4>

                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="botShouldClearNotifications"
                            ${shouldClearNotifications ? 'checked' : ''}
                            onchange="clicker.handleChangeClearNotifications()">
                        <label for="botShouldClearNotifications">Clear Notifications</label>
                    </li>

                    <li>
                    </li>
                </ul>
            </section>
        `

        if (!botMenuWrapper) {
            document.body.appendChild(menu)
        }
    },

    setElementUpgradesBuyAllButton() {
        if (this.config.shouldBuyUpgradesAllButton) {
            return this.elementUpgradesBuyAllButton = document.querySelector('#storeBuyAllButton')
        }

        this.elementUpgradesBuyAllButton = null
    },

    stop() {
        clearInterval(this.intervalBigCookie)
        clearInterval(this.intervalBuy)
        clearInterval(this.intervalClearNotifications)
        clearInterval(this.intervalClearWrinklers)
        clearInterval(this.intervalFortuneCookie)
        clearInterval(this.intervalOneMind)
        clearInterval(this.intervalShimmer)

        this.isBotRunning = false

        this.mountMenuHTML()
    }
}


setTimeout(() => clicker.init(), 1500)