import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons,
  getDelayTime,
  setDelayTime,
  startAnimation,
  stopAnimation,
  isAnimating,
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

const LinearSearch = {
  render: async function() {
    let view = `
          <div class="linearSearch" data-component="${this.name}" data-name="component">
            <div class="wrapper">
              <div class="title">
                Linear Search: Loop through each element of the array and return the match.
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
      executionLog("linear-search", "Visualization stopped...", "error");
      stopAnimation();
    }
    executionLog("linear-search", "Linear search mounted", "normal");
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
      executionLog("linear-search", "Dataset randomized", "success");
    });
    smallDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "small") {
        return;
      }
      setDatasetSize("small");
      generateRandomElements(getElementWidth());
      executionLog("linear-search", "Dataset changed to small", "success");
    });
    largeDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "large") {
        return;
      }
      setDatasetSize("large");
      generateRandomElements(getElementWidth());
      executionLog("linear-search", "Dataset changed to large", "success");
    });
  },
  name: "linearSearch"
};

async function* searchGenerator(arr, elToFind) {
  let awaitTime = getDelayTime();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == elToFind) {
      awaitTime = yield {
        found: true,
        isPresent: true,
        el: arr[i],
        i: i
      };
      return;
    } else {
      awaitTime = yield {
        found: false,
        isPresent: true,
        el: arr[i],
        i: i
      };
    }
    await delay(awaitTime);
  }
  awaitTime = yield {
    found: false,
    isPresent: false,
    i: i - 1,
    el: arr[i - 1]
  };
}

function generateRandomElements(width) {
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  boxesContainer.innerHTML = "";
  window.randomArray = generateRandomArray(getDatasetSize(), 40);
  window.randomArray.forEach((v, i) => {
    createAndInsertElement(boxesContainer, width, v, i);
  });
}

function removePointer() {
  let parent = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  let oldChild = document.querySelector("#pointer");
  if (oldChild && parent) parent.removeChild(oldChild);
}

function getElementPosition(i) {
  let parentPosition = document
    .querySelector(".algo-container .bars-container .wrapper")
    .getBoundingClientRect();
  let childPosition = document
    .querySelector(`.algo-container .linearSearch .box${i}`)
    .getBoundingClientRect();
  return {
    left: childPosition.left - parentPosition.left,
    bottom: childPosition.bottom - parentPosition.bottom
  };
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
  executionLog("linear-search", "Visualization started...", "success");
  startAnimation();
  disableActionButtons();
  let sorter = searchGenerator(window.randomArray, elToFind);
  removePointer();
  let pointer = createAndInsertPointer(
    `${elToFind}?`,
    getElementPosition(0).left,
    getElementPosition(0).bottom
  );
  let v = await sorter.next(getDelayTime());
  while (!v.done) {
    if (!isAnimating()) {
      return;
    }
    let { found, isPresent, el, i } = v.value;
    let { left, bottom } = getElementPosition(i);
    startBlinkingRed(pointer);
    movePointer(pointer, left, bottom);
    await delay(getDelayTime());
    if (isPresent) {
      executionLog("linear-search", `is ${el} equal to ${elToFind}?`);
    }
    if (found) {
      startBlinkingGreen(pointer);
      executionLog(
        "linear-search",
        `${elToFind} found at index: ${i}`,
        "success"
      );
    } else {
      startBlinkingRed(pointer);
    }
    v = await sorter.next(getDelayTime());
    if (!isPresent) {
      executionLog("linear-search", `${elToFind} is not in the array`, "error");
    }
  }
  enableActionButtons();
}

export default LinearSearch;
