import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons
} from "../../utils/common.js";
import {
  createAndInsertElement,
  createAndInsertPointer,
  movePointer,
  startBlinkingGreen,
  startBlinkingRed
} from "../../utils/searching.js";

const BinarySearch = {
  render: async function() {
    let view = `
          <div class="binarySearch" data-component="${this.name}" data-name="component">
            <div class="wrapper">
              <div class="title">
                Binary Search: A binary search takes in a sorted array and looks for a specific element. If the element is present in the array, the search returns the index of the element; otherwise it returns null.
              </div>
              <div class="bars-container">
                <div class="wrapper">
                  
                </div>
              </div>
              <div class="actions">
                <button class="animateBtn">Search</button>
                <button class="randomizeBtn">Randomize</button>
                <input type="range" name="speed" id="speedBtn" min="100" max="5000">
                <input type="text" name="searchElement" id="searchElement" placeholder="Search element here...">
              </div>
            </div>
          <div>
        `;
    return view;
  },
  componentDidMount: async function() {
    window.animationStart = false;
    console.log(`Binary Search Mounted`);
    generateRandomElements(window.elementWidth);
    let animateButton = document.querySelector(".animateBtn");
    let randomizeButton = document.querySelector(".randomizeBtn");
    let speedButton = document.querySelector("#speedBtn");
    speedButton.value = window.delayTime;
    speedButton.addEventListener("change", function(e) {
      window.delayTime = parseInt(e.target.value);
    });
    animateButton.addEventListener("click", animate);
    randomizeButton.addEventListener("click", function() {
      generateRandomElements(window.elementWidth);
    });
  },
  name: "binarySearch"
};

async function* searchGenerator(sortedArray, elToFind) {
  let awaitTime = window.delayTime;
  var lowIndex = 0;
  var highIndex = sortedArray.length - 1;
  while (lowIndex <= highIndex) {
    var midIndex = Math.floor((lowIndex + highIndex) / 2);
    if (sortedArray[midIndex] == elToFind) {
      awaitTime = yield {
        found: true,
        low: lowIndex,
        high: highIndex,
        mid: midIndex,
        moveLow: false,
        moveHigh: false
      };
      return;
    } else if (sortedArray[midIndex] < elToFind) {
      awaitTime = yield {
        found: false,
        low: midIndex + 1,
        high: highIndex,
        mid: Math.floor((midIndex + 1 + highIndex) / 2),
        moveLow: true,
        moveHigh: false
      };
      lowIndex = midIndex + 1;
    } else {
      awaitTime = yield {
        found: false,
        low: lowIndex,
        high: midIndex - 1,
        mid: Math.floor((lowIndex + midIndex - 1) / 2),
        moveLow: false,
        moveHigh: true
      };
      highIndex = midIndex - 1;
    }
  }
  yield {
    found: false,
    moveHigh: false,
    moveLow: false
  };
}

function generateRandomElements(width) {
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  boxesContainer.innerHTML = "";
  window.randomArray = generateRandomArray(12, 40);
  window.randomArray = window.randomArray.sort((a, b) => a - b);
  window.randomArray.forEach((v, i) => {
    createAndInsertElement(boxesContainer, width, v, i);
  });
}

function getElementPosition(i) {
  let parentPosition = document
    .querySelector(".algo-container .bars-container .wrapper")
    .getBoundingClientRect();
  let childPosition = document
    .querySelector(`.algo-container .binarySearch .box${i}`)
    .getBoundingClientRect();
  let temp = {
    left: childPosition.left - parentPosition.left,
    bottom: childPosition.bottom - parentPosition.bottom + 35
  };
  return temp;
}

function generateThreePointers() {
  let midElPos = getElementPosition(
    Math.floor((0 + (window.randomArray.length - 1)) / 2)
  );
  let lowElPos = getElementPosition(0);
  let highElPos = getElementPosition(window.randomArray.length - 1);
  let midPointer = createAndInsertPointer(
    "",
    midElPos.left,
    midElPos.bottom - 35
  );
  midPointer.className = "mid";
  let lowPointer = createAndInsertPointer(
    "low",
    lowElPos.left,
    lowElPos.bottom - 35
  );
  lowPointer.className = "low";
  let highPointer = createAndInsertPointer(
    "high",
    highElPos.left,
    highElPos.bottom - 35
  );
  highPointer.className = "high";
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  boxesContainer.appendChild(midPointer);
  boxesContainer.appendChild(lowPointer);
  boxesContainer.appendChild(highPointer);
  return {
    midPointer,
    lowPointer,
    highPointer
  };
}

function removeOldThreePointers() {
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  let oldThreePointers = document.querySelectorAll("#pointer");
  for (let i = 0; i < oldThreePointers.length; i++) {
    boxesContainer.removeChild(oldThreePointers[i]);
  }
}

function getElementToSearch() {
  let searchInput = document.querySelector("#searchElement");
  return parseInt(searchInput.value);
}

async function animate() {
  let elToFind = getElementToSearch();
  if (!elToFind || Number.isNaN(elToFind)) {
    return;
  }
  removeOldThreePointers();
  let { midPointer, lowPointer, highPointer } = generateThreePointers();
  window.animationStart = true;
  disableActionButtons();
  let sorter = searchGenerator(window.randomArray, elToFind);
  midPointer.childNodes[0].innerText = `${elToFind}?`;
  let v = await sorter.next(window.delayTime);
  while (!v.done) {
    if (!window.animationStart) {
      return;
    }
    let { found, low, high, mid, moveLow, moveHigh } = v.value;
    if (
      low >= 0 &&
      low <= window.randomArray.length - 1 &&
      high >= 0 &&
      high <= window.randomArray.length - 1
    ) {
      let lowPos = getElementPosition(low);
      let highPos = getElementPosition(high);
      let midPos = getElementPosition(mid);
      await delay(window.delayTime);
      if (moveLow) {
        startBlinkingRed(midPointer);
        movePointer(lowPointer, lowPos.left, lowPos.bottom - 35);
        await delay(window.delayTime);
        await delay(window.delayTime / 2);
        movePointer(midPointer, midPos.left, midPos.bottom - 35);
        await delay(window.delayTime);
      } else if (moveHigh) {
        startBlinkingRed(midPointer);
        await delay(window.delayTime);
        movePointer(highPointer, highPos.left, highPos.bottom - 35);
        await delay(window.delayTime);
        await delay(window.delayTime / 2);
        movePointer(midPointer, midPos.left, midPos.bottom - 35);
        await delay(window.delayTime);
      } else if (found) {
        movePointer(lowPointer, lowPos.left, lowPos.bottom - 35);
        movePointer(highPointer, highPos.left, highPos.bottom - 35);
        movePointer(midPointer, midPos.left, midPos.bottom - 35);
        startBlinkingGreen(midPointer);
        await delay(window.delayTime);
        lowPointer.style.display = "none";
        highPointer.style.display = "none";
      } else {
        await delay(window.delayTime);
      }
    } else {
      console.log("not found");
      lowPointer.style.display = "none";
      highPointer.style.display = "none";
      startBlinkingRed(midPointer);
      midPointer.style.width = "auto";
      midPointer.childNodes[0].innerText = `${elToFind} is not present in array!`;
    }
    v = await sorter.next(window.delayTime);
  }
  enableActionButtons();
}

export default BinarySearch;
