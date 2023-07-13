let playArea = document.getElementById("playArea");
playArea.style.backgroundColor = "#13131D";
playArea.style.width = "400px";
playArea.style.height = "400px";
playArea.style.position = "absolute";
// "background-color: #13131D; width: 400px; height: 400px; position: static;"

// "background-color: #635c5b; width: 15px; height: 15px; position: static; top: 0px; left: 0px;"
const generateRandomXY = () => {
    let xcoord = Math.floor(Math.random() * (40-1))*10;
    let ycoord = Math.floor(Math.random() * (40-1))*10;
    return {xcoord, ycoord};
}

// let snekBlocks = [];
let snekBlocks2 = {};
let snekBlockCounter = 0;
let currentSnekHead;
const createSnekBlock = (xcoord, ycoord) => {

    // checks if the new snekblock already exists.
    if ( snekBlocks2.hasOwnProperty(xcoord.toString() + ycoord.toString()) ) {
        alert("game over, you ate yourself")
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        return;
    }

    let snekBlock = document.createElement("div");
    playArea.appendChild(snekBlock);
    snekBlock.style.backgroundColor = "#c4bfbe";
    snekBlock.style.width = "10px";
    snekBlock.style.height = "10px";
    snekBlock.style.position = "absolute";
    snekBlock.style.top = ycoord + "px";
    snekBlock.style.left = xcoord + "px";
    let snekBlockName = (xcoord.toString() + ycoord.toString());
    // console.log(snekBlockName);
    snekBlocks2[snekBlockName] = {
        snekBlock: snekBlock,
        counter: snekBlockCounter,
        xcoord: xcoord,
        ycoord: ycoord
    };
    snekBlockCounter++;
    currentSnekHead = {
        xcoord,
        ycoord,
    }
    // console.log(snekBlocks2);
}

let decSnekBlockCounter = -1;
const createSnekBlockTail = (xcoord, ycoord) => {
    let snekBlock = document.createElement("div");
    playArea.appendChild(snekBlock);
    snekBlock.style.backgroundColor = "#c4bfbe";
    snekBlock.style.width = "10px";
    snekBlock.style.height = "10px";
    snekBlock.style.position = "absolute";
    snekBlock.style.top = ycoord + "px";
    snekBlock.style.left = xcoord + "px";
    let snekBlockName = (xcoord.toString() + ycoord.toString());
    // console.log(snekBlockName);
    snekBlocks2[snekBlockName] = {
        snekBlock: snekBlock,
        counter: decSnekBlockCounter,
        xcoord: xcoord,
        ycoord: ycoord
    };
    decSnekBlockCounter--;
    // console.log(snekBlocks2);
}

let originalSnekPositions = [{ xcoord: 120, ycoord: 200}, {xcoord: 130, ycoord: 200}, {xcoord: 140, ycoord: 200}, {xcoord: 150, ycoord: 200}];
const createSnek = (snekPos) => {
    for (snekBloc of snekPos) {
        createSnekBlock(snekBloc.xcoord, snekBloc.ycoord);
    }
}
createSnek(originalSnekPositions);

const checkCollisionWithSnek = (block, blockObj) => {
    let blockName = block.xcoord.toString() + block.ycoord.toString();
    let res = blockObj.hasOwnProperty(blockName);
    return res;
}

let gameInterval;
const checkHeadCollisionWithWall = () => {
    if (currentSnekHead.xcoord >= 400) {
        alert("game over");
        if (gameInterval) {
            clearInterval(gameInterval);
        }
    } else if (currentSnekHead.xcoord < 0) {
        alert("game over");
        if (gameInterval) {
            clearInterval(gameInterval);
        }
    } else if (currentSnekHead.ycoord >= 400) {
        alert("game over");
        if (gameInterval) {
            clearInterval(gameInterval);
        }
    } else if (currentSnekHead.ycoord < 0) {
        alert("game over");
        if (gameInterval) {
            clearInterval(gameInterval);
        }
    }
}

let foodObj;
const createFood = () => {
    let randomBlock = generateRandomXY();
    let flag = true;
    while (flag) {
        let result = checkCollisionWithSnek(randomBlock, snekBlocks2);
        if (result == false) {
            flag = false;
        } else {
            randomBlock = generateRandomXY();
        }
    }
    let xcoord = randomBlock.xcoord;
    let ycoord = randomBlock.ycoord;
    // xcoord = 200; // for testing
    // ycoord = 200; // for testing
    // console.log("xcoord: " + xcoord);
    // console.log("ycoord: " + ycoord);
    let food = document.createElement("div");
    playArea.appendChild(food)
    food.style.backgroundColor = "#635c5b";
    food.style.width = "10px";
    food.style.height = "10px";
    food.style.position = "absolute";
    food.style.top = ycoord + "px";
    food.style.left = xcoord + "px";
    foodObj = {
        food,
        xcoord,
        ycoord,
    }
}

const deleteOldFoodObj = () => {
    foodObj.food.remove();
}

let lastDeletedSnekBlockPosition;
const moveSnekRight = () => {
    let nameList = Object.getOwnPropertyNames(snekBlocks2);
    // largest counter is snek head, smallest counter is snek tail
    // remove snek tail, add head
    let smallestCounter = snekBlocks2[nameList[0]].counter;
    let tailBlockName = nameList[0];
    let largestCounter = snekBlocks2[nameList[0]].counter;
    let headBlockName  = nameList[0];
    for (propName of nameList) {
        if (snekBlocks2[propName].counter < smallestCounter) {
            tailBlockName = propName;
            smallestCounter = snekBlocks2[propName].counter;
        }
        if (snekBlocks2[propName].counter > largestCounter) {
            headBlockName = propName;
            largestCounter = snekBlocks2[propName].counter;
        }
    }
    lastDeletedSnekBlockPosition = {
        xcoord: snekBlocks2[tailBlockName].xcoord,
        ycoord: snekBlocks2[tailBlockName].xcoord,
    }
    snekBlocks2[tailBlockName].snekBlock.remove();
    delete snekBlocks2[tailBlockName];
    let newXcoord = parseInt( snekBlocks2[headBlockName].xcoord ) + 10;
    createSnekBlock(newXcoord, snekBlocks2[headBlockName].ycoord);
}
const moveSnekLeft = () => {
    let nameList = Object.getOwnPropertyNames(snekBlocks2);
    // largest counter is snek head, smallest counter is snek tail
    // remove snek tail, add head
    let smallestCounter = snekBlocks2[nameList[0]].counter;
    let tailBlockName = nameList[0];
    let largestCounter = snekBlocks2[nameList[0]].counter;
    let headBlockName  = nameList[0];
    for (propName of nameList) {
        if (snekBlocks2[propName].counter < smallestCounter) {
            tailBlockName = propName;
            smallestCounter = snekBlocks2[propName].counter;
        }
        if (snekBlocks2[propName].counter > largestCounter) {
            headBlockName = propName;
            largestCounter = snekBlocks2[propName].counter;
        }
    }
    lastDeletedSnekBlockPosition = {
        xcoord: snekBlocks2[tailBlockName].xcoord,
        ycoord: snekBlocks2[tailBlockName].xcoord,
    }
    snekBlocks2[tailBlockName].snekBlock.remove();
    delete snekBlocks2[tailBlockName];
    let newXcoord = parseInt( snekBlocks2[headBlockName].xcoord ) - 10;
    createSnekBlock(newXcoord, snekBlocks2[headBlockName].ycoord);
}
// moveSnekRight();
// setTimeout(moveSnekRight, 500);
const moveSnekUp = () => {
    let nameList = Object.getOwnPropertyNames(snekBlocks2);
    // largest counter is snek head, smallest counter is snek tail
    // remove snek tail, add head
    let smallestCounter = snekBlocks2[nameList[0]].counter;
    let tailBlockName = nameList[0];
    let largestCounter = snekBlocks2[nameList[0]].counter;
    let headBlockName  = nameList[0];
    for (propName of nameList) {
        if (snekBlocks2[propName].counter < smallestCounter) {
            tailBlockName = propName;
            smallestCounter = snekBlocks2[propName].counter;
        }
        if (snekBlocks2[propName].counter > largestCounter) {
            headBlockName = propName;
            largestCounter = snekBlocks2[propName].counter;
        }
    }
    lastDeletedSnekBlockPosition = {
        xcoord: snekBlocks2[tailBlockName].xcoord,
        ycoord: snekBlocks2[tailBlockName].xcoord,
    }
    snekBlocks2[tailBlockName].snekBlock.remove();
    delete snekBlocks2[tailBlockName];
    let newYcoord = parseInt( snekBlocks2[headBlockName].ycoord ) - 10;
    createSnekBlock(snekBlocks2[headBlockName].xcoord, newYcoord);
}
const moveSnekDown = () => {
    let nameList = Object.getOwnPropertyNames(snekBlocks2);
    // largest counter is snek head, smallest counter is snek tail
    // remove snek tail, add head
    let smallestCounter = snekBlocks2[nameList[0]].counter;
    let tailBlockName = nameList[0];
    let largestCounter = snekBlocks2[nameList[0]].counter;
    let headBlockName  = nameList[0];
    for (propName of nameList) {
        if (snekBlocks2[propName].counter < smallestCounter) {
            tailBlockName = propName;
            smallestCounter = snekBlocks2[propName].counter;
        }
        if (snekBlocks2[propName].counter > largestCounter) {
            headBlockName = propName;
            largestCounter = snekBlocks2[propName].counter;
        }
    }
    lastDeletedSnekBlockPosition = {
        xcoord: snekBlocks2[tailBlockName].xcoord,
        ycoord: snekBlocks2[tailBlockName].xcoord,
    }
    snekBlocks2[tailBlockName].snekBlock.remove();
    delete snekBlocks2[tailBlockName];
    let newYcoord = parseInt( snekBlocks2[headBlockName].ycoord ) + 10;
    createSnekBlock(snekBlocks2[headBlockName].xcoord, newYcoord);
}

const checkIfFoodEaten = () => {
    let nameList = Object.getOwnPropertyNames(snekBlocks2);
    // largest counter is snek head, smallest counter is snek tail
    // we want snek head
    let largestCounter = snekBlocks2[nameList[0]].counter;
    let headBlockName  = nameList[0];
    for (propName of nameList) {
        if (snekBlocks2[propName].counter > largestCounter) {
            headBlockName = propName;
            largestCounter = snekBlocks2[propName].counter;
        }
    }
    console.log((foodObj.xcoord.toString()+foodObj.ycoord.toString()));
    console.log((snekBlocks2[headBlockName].xcoord.toString()+snekBlocks2[headBlockName].ycoord.toString()));
    if ((foodObj.xcoord.toString()+foodObj.ycoord.toString()) == (snekBlocks2[headBlockName].xcoord.toString()+snekBlocks2[headBlockName].ycoord.toString()) ) {
        createSnekBlockTail(lastDeletedSnekBlockPosition.xcoord, lastDeletedSnekBlockPosition.ycoord);
        deleteOldFoodObj();
        createFood();
    }
}

// code is bugged. functionality moved to createSnekBlock()
// const checkCollisionWithSelf = () => {
//     let currentSnekHeadName = (currentSnekHead.xcoord.toString()+currentSnekHead.ycoord.toString());
//     let snekBlocks2CopyMinusHead = JSON.parse(JSON.stringify(snekBlocks2));
//     delete snekBlocks2CopyMinusHead[currentSnekHeadName];
//     if ( snekBlocks2CopyMinusHead.hasOwnProperty(currentSnekHeadName) ) {
//         alert("game over, you ate yourself")
//         if (gameInterval) {
//             clearInterval(gameInterval);
//         }
//     }
// }

let snekDirection = "right";
const gameLoop = () => {
    const innerLoop = () => {
        if (snekDirection == "right") {
            moveSnekRight();
        } else if (snekDirection == "down") {
            moveSnekDown();
        } else if (snekDirection == "up") {
            moveSnekUp();
        } else if (snekDirection == "left") {
            moveSnekLeft();
        }
        checkIfFoodEaten();
        checkHeadCollisionWithWall();
        // checkCollisionWithSelf();
    }
    alert("Begin?");
    createFood();
    gameInterval = setInterval(innerLoop, 150);
}
gameLoop();

document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "i") { // up
        // console.log("i");
        if (snekDirection != "down") {
            snekDirection = "up";
        }
    }
    else if (event.key === "j") { // left
        // console.log("j");
        if (snekDirection != "right") {
            snekDirection = "left";
        }
    }
    else if (event.key === "k") { // down
        // console.log("k");
        if (snekDirection != "up") {
            snekDirection = "down";
        }
    }
    else if (event.key === "l") { // right
        // console.log("l");
        if (snekDirection != "left") {
            snekDirection = "right";
        }
    }
});