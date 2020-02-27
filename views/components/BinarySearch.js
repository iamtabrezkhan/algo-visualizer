import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons,
  getDelayTime,
  setDelayTime,
  startAnimation,
  isAnimating,
  stopAnimation,
  executionLog
} from "../../utils/common.js";
import {
  createAndInsertElement,
  createAndInsertPointer,
  movePointer,
  startBlinkingGreen,
  startBlinkingRed,
  getElementWidth,
  getSelectedDatasetType,
  getDatasetSize,
  setDatasetSize
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
                <button class="smallDatasetBtn">Small Dataset</button>
                <button class="largeDatasetBtn">Large Dataset</button>
              </div>
            </div>
          <div>
        `;
    return view;
  },
  componentDidMount: async function() {
    if (isAnimating()) {
      executionLog("binary-search", "Visualization stopped...", "error");
      stopAnimation();
    }
    executionLog("binary-search", "Binary search mounted", "normal");
    generateRandomElements(getElementWidth());
    let animateButton = document.querySelector(".animateBtn");
    let randomizeButton = document.querySelector(".randomizeBtn");
    let speedButton = document.querySelector("#speedBtn");
    let smallDatasetButton = document.querySelector(".smallDatasetBtn");
    let largeDatasetButton = document.querySelector(".largeDatasetBtn");
    speedButton.value = getDelayTime();
    speedButton.addEventListener("change", function(e) {
      setDelayTime(parseInt(e.target.value));
    });
    animateButton.addEventListener("click", animate);
    randomizeButton.addEventListener("click", function() {
      generateRandomElements(getElementWidth());
      executionLog("binary-search", "Dataset randomized", "success");
    });
    smallDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "small") {
        return;
      }
      setDatasetSize("small");
      generateRandomElements(getElementWidth());
      executionLog("binary-search", "Dataset changed to small", "success");
    });
    largeDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "large") {
        return;
      }
      setDatasetSize("large");
      generateRandomElements(getElementWidth());
      executionLog("binary-search", "Dataset changed to large", "success");
    });
  },
  name: "binarySearch"
};

async function* searchGenerator(sortedArray, elToFind) {
  let awaitTime = getDelayTime();
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
        moveHigh: false,
        lowIndex: lowIndex,
        midIndex: midIndex,
        highIndex: highIndex
      };
      lowIndex = midIndex + 1;
    } else {
      awaitTime = yield {
        found: false,
        low: lowIndex,
        high: midIndex - 1,
        mid: Math.floor((lowIndex + midIndex - 1) / 2),
        moveLow: false,
        moveHigh: true,
        lowIndex: lowIndex,
        midIndex: midIndex,
        highIndex: highIndex
      };
      highIndex = midIndex - 1;
    }
  }
  // yield {
  //   found: false,
  //   moveHigh: false,
  //   moveLow: false
  // };
}

function generateRandomElements(width) {
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  boxesContainer.innerHTML = "";
  window.randomArray = generateRandomArray(getDatasetSize(), 40);
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
  if (Number.isNaN(elToFind)) {
    return;
  }
  removeOldThreePointers();
  executionLog("binary-search", "Visualization started...", "success");
  let { midPointer, lowPointer, highPointer } = generateThreePointers();
  startAnimation();
  disableActionButtons();
  let sorter = searchGenerator(window.randomArray, elToFind);
  midPointer.childNodes[0].innerText = `${elToFind}?`;
  let v = await sorter.next(getDelayTime());
  while (!v.done) {
    if (!isAnimating()) {
      return;
    }
    let {
      found,
      low,
      high,
      mid,
      moveLow,
      moveHigh,
      lowIndex,
      midIndex,
      highIndex
    } = v.value;
    if (
      low >= 0 &&
      low <= window.randomArray.length - 1 &&
      high >= 0 &&
      high <= window.randomArray.length - 1
    ) {
      let lowPos = getElementPosition(low);
      let highPos = getElementPosition(high);
      let midPos = getElementPosition(mid);
      await delay(getDelayTime());
      if (moveLow) {
        executionLog("binary-search", `low index is ${lowIndex}`);
        executionLog("binary-search", `mid index is ${midIndex}`);
        executionLog("binary-search", `high index is ${highIndex}`);
        startBlinkingRed(midPointer);
        movePointer(lowPointer, lowPos.left, lowPos.bottom - 35);
        await delay(getDelayTime());
        await delay(getDelayTime() / 2);
        movePointer(midPointer, midPos.left, midPos.bottom - 35);
        await delay(getDelayTime());
        executionLog("binary-search", `low index is ${low}`);
        executionLog("binary-search", `mid index is ${mid}`);
        executionLog("binary-search", `high index is ${highIndex}`);
      } else if (moveHigh) {
        executionLog("binary-search", `low index is ${lowIndex}`);
        executionLog("binary-search", `mid index is ${midIndex}`);
        executionLog("binary-search", `high index is ${highIndex}`);
        startBlinkingRed(midPointer);
        await delay(getDelayTime());
        movePointer(highPointer, highPos.left, highPos.bottom - 35);
        await delay(getDelayTime());
        await delay(getDelayTime() / 2);
        movePointer(midPointer, midPos.left, midPos.bottom - 35);
        await delay(getDelayTime());
        executionLog("binary-search", `low index is ${lowIndex}`);
        executionLog("binary-search", `mid index is ${mid}`);
        executionLog("binary-search", `high index is ${high}`);
      } else if (found) {
        movePointer(lowPointer, lowPos.left, lowPos.bottom - 35);
        movePointer(highPointer, highPos.left, highPos.bottom - 35);
        movePointer(midPointer, midPos.left, midPos.bottom - 35);
        startBlinkingGreen(midPointer);
        executionLog(
          "binary-search",
          `${elToFind} found at index ${mid}`,
          "success"
        );
        await delay(getDelayTime());
        lowPointer.style.display = "none";
        highPointer.style.display = "none";
      } else {
        await delay(getDelayTime());
      }
    } else {
      lowPointer.style.display = "none";
      highPointer.style.display = "none";
      startBlinkingRed(midPointer);
      executionLog(
        "binary-search",
        `${elToFind} is not present in the array`,
        "error"
      );
    }
    v = await sorter.next(getDelayTime());
  }
  enableActionButtons();
}

export default BinarySearch;
