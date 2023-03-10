//Variables
const width = 10;
const height = 21;
const numberOfBoxes = width * height;
let boxes = [];
const grid = document.querySelector(".grid");
const colors = ["orange", "red", "purple", "green", "blue"];
const smallGrid = document.querySelector(".smallGrid");
let timerId;
const scoreSel = document.querySelector(".score");
const linesSel = document.querySelector(".lines");
const level = document.querySelector(".levels");
const sound = document.createElement("audio");
const sound2 = document.createElement("audio");
const sound3 = document.createElement("audio");
const sound4 = document.createElement("audio");
const sound5 = document.createElement("audio");
sound.volume = 0.1;
sound2.volume = 0.2;
sound3.volume = 0.2;
sound4.volume = 0.2;
sound5.volume = 0.1;
let score = 0;
let lines = 0;

// Function to create the base grid where the game is taking place
function createGrid() {
  for (let index = 0; index < numberOfBoxes; index++) {
    const box = document.createElement("div");
    document.querySelector(".grid").appendChild(box);
    boxes.push(box);
  }
}
createGrid();

//Creating the smaller grid which displays the next tetromino
//Variables
const displayWidth = 4;
const smallWidth = 4;
const smallHeight = 4;
const smallNumberOfBoxes = smallWidth * smallHeight;
let smallBoxes = [];
let nextRandom = 0;

//function for creating small grid
function createSmallGrid() {
  for (let index = 0; index < smallNumberOfBoxes; index++) {
    const smallBox = document.createElement("div");
    document.querySelector(".smallGrid").appendChild(smallBox);
    smallBoxes.push(smallBox);
  }
}
createSmallGrid();

console.log(smallBoxes);
console.log(boxes);

//Array which contains arrays of the first rotation of each of the tetrominos
const nextTetromino = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2],
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  [displayWidth, displayWidth + 1, 1, displayWidth + 2],
  [0, 1, displayWidth, displayWidth + 1],
];

//Function to display the next tetromino
function displayTetromino() {
  smallBoxes.forEach((square) => {
    square.classList.remove("tetromino"); //removes the previous tetromino so that they dont overlap with each other
    square.style.backgroundColor = "";
  });
  nextTetromino[nextRandom].forEach((index) => {
    smallBoxes[index].classList.add("tetromino");
    smallBoxes[index].style.backgroundColor = colors[nextRandom]; //nextRandom passes its value to random value
  });
}

//Creating the tetrominos using indexes and width to draw them across the grid. Each array is one of the four different rotations of each tetromino
//width = 10 which is the next row
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width * 2, width * 2 + 1, width + 1, width + 2],
  [0, width, width + 1, width * 2 + 1],
  [width * 2, width * 2 + 1, width + 1, width + 2],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3, width + 3],
];

const tTetromino = [
  [width, width + 1, 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, 1, width * 2 + 1],
];

const boxTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

//Array which contains the five created tetrominos
const tetrominos = [
  lTetromino,
  zTetromino,
  iTetromino,
  tTetromino,
  boxTetromino,
];

//Array containing the different colors of tetrominos
let tetrominoColors = [
  "purple",
  "cyan",
  "blue",
  "yellow",
  "orange",
  "green",
  "red",
];

//CurrentPosition is the position 4 in the grid where each tetromino starts from and current rotation 0 is the first rotation of each tetromino
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * tetrominos.length);
let current = tetrominos[random][currentRotation];
console.log(tetrominos);
console.log(tetrominos.length);
console.log(current.length);

//Function to create tetromino
function createTetromino() {
  current.forEach((index) => {
    boxes[currentPosition + index].classList.add("tetromino"); //creating the tetromino using currentposition and index as a parameter which takes the value of each tetrominos index number
    boxes[currentPosition + index].style.backgroundColor = colors[random]; //assigning a random color from colors array
    console.log(index);
  });
}

//Function to remove tetromino
function removeTetromino() {
  current.forEach((index) => {
    boxes[currentPosition + index].classList.remove("tetromino");
    boxes[currentPosition + index].style.backgroundColor = "";
  });
}

//Function for key input actions
function movement(event) {
  if (event.code === "ArrowRight") {
    goRight();
  } else if (event.code === "ArrowLeft") {
    goLeft();
  } else if (event.code === "ArrowDown") {
    scoreSel.innerText = score;
    score++;
    goDown();
  }
}
function keyRotate(event) {
  if (event.code === "ArrowUp") {
    rotate();
  }
}
//Event listeners for key up and down
document.addEventListener("keyup", keyRotate);
document.addEventListener("keydown", movement);

//Function which makes the tetromino move down
function goDown() {
  if (
    current.some(
      (index) =>
        boxes[currentPosition + index + width].classList.contains("taken") //checks if the next line contains the class taken. If it does then it calls the freeze function otherwise keeps moving the tetromino to the next line
    )
  ) {
    freeze();
    sound.src = "mixkit-quick-lock-sound-2854.wav";
    sound.play();
  } else {
    removeTetromino();
    currentPosition += width;
    createTetromino();
  }
}

//Loop that creates 10 divs that do not have style then adds the class taken to them which will be used for the freeze function
for (let index = 200; index < 210; index++) {
  boxes[index].classList.add("taken");
  boxes[index].style.border = 0;
  boxes[index].style.width = 0;
}

//Function that is called in the movedown function. If the next line contains the class taken then it adds the class taken to the tetromino and freezes it
function freeze() {
  current.forEach((index) =>
    boxes[currentPosition + index].classList.add("taken")
  );
  random = nextRandom;
  nextRandom = Math.floor(Math.random() * tetrominos.length);
  current = tetrominos[random][0];
  console.log(current);
  currentPosition = 4;
  removeLine();
  createTetromino();
  displayTetromino();
  gameOver();
}

//function for the tetromimo that stops it from going outside the left border of the grid
function goLeft() {
  removeTetromino();
  const leftBorder = current.some(
    (index) => (currentPosition + index) % width === 0
  );
  console.log(leftBorder);
  if (!leftBorder) {
    currentPosition--;
  }
  if (
    current.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition++;
  }
  createTetromino();
}

//function for the tetromimo that stops it from going outside the right border of the grid
function goRight() {
  removeTetromino();
  const rightBorder = current.some(
    (index) => (currentPosition + index) % width === 9
  );
  console.log(rightBorder);

  if (!rightBorder) currentPosition++;

  if (
    current.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition--;
  }
  createTetromino();
}

//Functions that prevent the tetromino from spliting to other side of the grid when rotating at the edge of the border
function isAtRight() {
  return current.some((index) => (currentPosition + index + 1) % width === 0);
}

function isAtLeft() {
  return current.some((index) => (currentPosition + index) % width === 0);
}

function isAtBottom() {
  return current.some(
    (index) => currentPosition + index + width > numberOfBoxes
  );
}

//function created so that tetrominos i and t dont split into the next line of the other side of the border
function checkRotatedPosition() {
  //get current position.  Then, check if the piece is near the left side.
  if ((currentPosition + 1) % width < 4) {
    //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
    if (isAtRight()) {
      console.log("is it right is true");
      //use actual position to check if it's flipped over to right side
      currentPosition += 1; //if so, add one to wrap it back around
      checkRotatedPosition(); //check again.  Pass position from start, since long block might need to move more.
    }
  } else if (currentPosition % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1;
      checkRotatedPosition();
    }
  } else if (currentPosition % width > 184) {
    if (isAtBottom()) {
      currentPosition -= width;
      checkRotatedPosition();
    }
  }
  console.log(isAtBottom());
}
/* } else if ((currentPosition + index) % width < numberOfBoxes) {
    currentPosition -= width;
    checkRotatedPosition(P);
  }*/

//Function that rotates the object adding +1 each time to the current rotation which starts from 0. The rotations are 3 arrays, if we try after the third rotation we go back to the first one with index 0.
function rotate() {
  removeTetromino();
  currentRotation++;
  sound5.src = "mixkit-arcade-game-jump-coin-216.mp3";
  sound5.play();
  if (currentRotation > 3) {
    currentRotation = 0;
  }
  current = tetrominos[random][currentRotation];
  checkRotatedPosition();
  createTetromino();
}

//Event listener for the play and pause button
const playPause = document.querySelector(".playPausebtn");
playPause.addEventListener("click", () => {
  if (timerId) {
    sound.src = "mixkit-positive-interface-beep-221.wav";
    sound.play();
    clearInterval(timerId);
    timerId = null;
    document.removeEventListener("keyup", keyRotate);
    document.removeEventListener("keydown", movement);
  } else {
    sound.src = "mixkit-arcade-score-interface-217.wav";
    sound.play();
    createTetromino();
    displayTetromino();
    timerId = setInterval(goDown, 1000);
    document.addEventListener("keyup", keyRotate);
    document.addEventListener("keydown", movement);
  }
});

//Function to remove the last line if its filled with tetromino blocks
function removeLine() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      //The row array is every row on the grid
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];
    console.log(row);
    if (row.every((index) => boxes[index].classList.contains("taken"))) {
      //if each of the squares of that row include the class taken the it does the following
      row.forEach((index) => {
        boxes[index].classList.remove("taken");
        boxes[index].classList.remove("tetromino");
        boxes[index].style.backgroundColor = "";
      });
      sound2.src = "mixkit-retro-arcade-casino-notification-211.wav";
      sound2.play();
      lines++;
      linesSel.innerText = lines;
      if (lines === 5) {
        level.innerText = "Level 2";
        sound3.src = "mixkit-arcade-retro-changing-tab-206.wav";
        sound3.play();
        timerId = setInterval(goDown, 500);
      } else if (lines === 10) {
        sound3.src = "mixkit-arcade-retro-changing-tab-206.wav";
        sound3.play();
        level.innerText = "Level 3";
        timerId = setInterval(goDown, 200);
      }
      const boxesRemoved = boxes.splice(i, width); //With splice we get just the 10 last divs that contain the tetromino class
      boxes = boxesRemoved.concat(boxes); //With the concant method the array boxesremove is merged with the boxes array
      boxes.forEach((cell) => grid.appendChild(cell)); //The row that was deleted is appended on top of the grid so that the grid doesn't appear smaller
      console.log(boxesRemoved);
    }
  }
}

const footer = document.querySelector("footer");
//Function which checks if the next line contains the class taken. If it does it clears the interval and removes the keys event listeners.
function gameOver() {
  if (
    current.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    clearInterval(timerId);
    sound4.src = "mixkit-arcade-retro-game-over-213.wav";
    sound4.play();
    const h1 = document.createElement("h1");
    h1.innerText = "GAME OVER";
    h1.style.color = "red";
    footer.appendChild(h1);
    document.removeEventListener("keyup", keyRotate);
    document.removeEventListener("keydown", movement);
  }
}

const reset = document.querySelector(".resetBtn");
reset.addEventListener("click", () => {
  window.location.reload();
  /*if (timerId) {
      goDown();
      clearInterval(timerId);
      timerId = null;
      boxes.forEach((index) => {
        index.classList.remove("tetromino");
        index.style.backgroundColor = "";
      });*/
});

//Added an event listener so that when I clicked the down key the page wouldnt scroll down
window.addEventListener(
  "keydown",
  function (e) {
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  },
  false
);
