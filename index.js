var robot = require('robotjs')

const screenSize = robot.getScreenSize()
robot.setKeyboardDelay(0)

class Element
{
    /**
     * @param {int} x 
     * @param {int} y 
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

const launch = {
    button: new Element(screenSize.width - 1050, screenSize.height - 780),
    page: {
        beginner: new Element(screenSize.width - 800, screenSize.height - 400),
        confirm: new Element(screenSize.width - 720, screenSize.height - 270)
    },
    colors: {
        dodgeTimer: ['525250']
    }
}

const queue = {
    accept: new Element(screenSize.width - 640, screenSize.height - 380),
    colors: {
        inQueue: ['0f1a18', '101b19', '111c1a'],
        dodgeTimer: ['040606'],
        gameFound: ['c6f2f3', '9cbebe', '8fafb0'],
        gameAccepted: ['545451'],
        champSelect: ['000000', '02060a', '02050a'],
        alreadyIngame: ['5d7760']
    }
}

const champSelect = {
    firstChamp: new Element(screenSize.width - 765, screenSize.height - 680),
    lockIn: new Element(screenSize.width - 640, screenSize.height - 330)
}

const loadingScreen = {
    reference: new Element(screenSize.width / 2, (screenSize.height / 2) + 10),
    colors: {
        loading: ['9e895f']
    }
}

const game = {
    shop: {
        open: 'p',
        exit: 'escape'
    },
    items: [
        new Element(screenSize.width - 1070, screenSize.height - 710),
        new Element(screenSize.width - 1015, screenSize.height - 710),
    ],
    lanes: {
        mid: new Element(screenSize.width - 93, screenSize.height - 250)
    },
    middleOfTheScreen: new Element(screenSize.width / 2, screenSize.height / 2)
}

/**
 * 
 * @param {int} ms
 * 
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param {int} max
 * 
 * @returns {int}
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * @param {Element} button
 * @param {string} whichButton
 * @param {boolean} double
 */
function clickButton(button, whichButton = 'left', double = false) {
    robot.moveMouse(button.x, button.y)
    robot.mouseClick(whichButton, double)
}

/**
 * @param {Element} element
 * 
 * @returns {string}
 */
function getColor(element) {
    return robot.getPixelColor(element.x, element.y)
}

function createGame() {
    clickButton(launch.button)
    setTimeout(() => {
        clickButton(launch.page.beginner)
        clickButton(launch.page.confirm)
        setTimeout(async () => {
            while (launch.colors.dodgeTimer.includes(getColor(launch.page.confirm))) {
                console.log('In dodge timer before queuing...')
                await sleep(1000)
            }
            startQueueing()
        }, 2000)
    }, 1000)
}

function startQueueing()
{

    let lastState = null;
    let color = null;

    clickButton(launch.page.confirm)
    console.log('Start queuing !')
    let queueInterval = setInterval(() => {
        color = getColor(queue.accept)
        console.log('Color : ' + color)
        if (queue.colors.inQueue.includes(color)) {
            console.log('In queue...')
        } else if (queue.colors.dodgeTimer.includes(color)) {
            console.log('In dodge timer...')
        } else if (queue.colors.gameFound.includes(color)) {
            console.log('Game found !')
            clickButton(queue.accept)
        } else if (queue.colors.gameAccepted.includes(color)) {
            console.log('Game Accepted !')
        } else if (queue.colors.champSelect.includes(color)) {
            if (! queue.colors.champSelect.includes(lastState)) {
                setTimeout(() => {
                    launchChampSelect()
                }, 2000)
            }
        } else if (loadingScreen.colors.loading.includes(getColor(loadingScreen.reference))) {
            clearInterval(queueInterval)
            waitLoadingScreen()
        } else if (queue.colors.alreadyIngame.includes(getColor(color))) {
            clearInterval(queueInterval)
            playTheGame()
        }
        lastState = color
    }, 1000)
}

function launchChampSelect() {
    console.log('Picking a champ...')
    clickButton(champSelect.firstChamp)
    setTimeout(() => {
        clickButton(champSelect.lockIn)
    }, 2000)
}

async function waitLoadingScreen() {
    while (loadingScreen.colors.loading.includes(getColor(loadingScreen.reference))) {
        console.log('On the loading screen...')
        await sleep(1000)
    }
    playTheGame()
}

let randomInterval = null
let laneInterval = null
function playTheGame() {
    console.log('In game !')

    setTimeout(() => {
        buyStarterItems()
        goLaning()
        if (laneInterval !== null) {
            clearInterval(laneInterval)
        }
        laneInterval = setInterval(() => {
            goLaning()
        }, 120000)
    }, 20000)
}

function buyStarterItems() {

    console.log('Buying items...')

    robot.keyTap(game.shop.open)

    setTimeout(async () => {

        for (let item of game.items) {
            clickButton(item, 'left', true)
            await sleep(1000)
        }

        robot.keyTap(game.shop.exit)

        console.log('Items bought !')
        
    }, 1000)
}

function goLaning() {
    setTimeout(() => {
        laneMid()

        setTimeout(() => {
            if (randomInterval !== null) {
                clearInterval(randomInterval)
            }
            randomInterval = setInterval(() => {
                moveRandomly()
            }, 10000)

            if (potionInterval !== null) {
                clearInterval(potionInterval)
            }
            potionInterval = setInterval(() => {
                game.potion.checkAndPlay()
            }, 10000)

        }, 30000)
    }, 5000)
}

function laneMid() {
    clickButton(game.lanes.mid)
    setTimeout(() => {
        console.log('Going mid !')
        clickButton(game.middleOfTheScreen, 'right')
    }, 1000)
}

function moveRandomly() {
    console.log('Moving randomly ! :D')
    clickButton(new Element(screenSize.width * 7/16 + getRandomInt(screenSize.width / 8), screenSize.height * 7/16 + getRandomInt(screenSize.height / 8)), 'right')
}

createGame()
