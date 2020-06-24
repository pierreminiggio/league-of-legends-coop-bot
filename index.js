var robot = require('robotjs')

const screenSize = robot.getScreenSize()
robot.setKeyboardDelay(0)

class Element
{
    /**
     * 
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
        inQueue: ['0f1a18'],
        dodgeTimer: ['040606'],
        gameFound: ['c6f2f3', '9cbebe'],
        gameAccepted: ['545451'],
        champSelect: ['000000', '02060a']
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
 * @param {Element} button 
 */
function clickButton(button) {
    robot.moveMouse(button.x, button.y)
    robot.mouseClick('left')
}

/**
 * @param {Element} element
 * 
 * @returns {string}
 */
function getColor(element) {
    return robot.getPixelColor(element.x, element.y)
}

let lastState = null;
let color = null;

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
    clickButton(launch.page.confirm)
    console.log('Start queuing !')
    setInterval(() => {
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
            waitLoadingScreen()
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
    console.log('In game !')
}

createGame()
