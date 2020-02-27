import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons,
  setDelayTime,
  getDelayTime,
  startAnimation,
  isAnimating,
  stopAnimation,
  executionLog
} from "../../utils/common.js";
import {
  addSwappingColors,
  removeSwappingColors,
  swapBars,
  createAndInsertBar,
  getBarWidth,
  getDatasetSize,
  setDatasetSize,
  getSelectedDatasetType
} from "../../utils/sorting.js";

const BubbleSort = {
  render: async function() {
    let view = `
          <div class="bubbleSort" data-component="${this.name}" data-name="component">
            <div class="warpper">
              <div class="title">
                Bubble Sort: Every pair of adjacent values is compared, and then the two values swap positions if the first value is greater than the second.
              </div>
              <div class="bars-container">
                <div class="wrapper">
                  
                </div>
              </div>
              <div class="actions">
                <button class="animateBtn">Animate</button>
                <button class="randomizeBtn">Randomize</button>
                <input type="range" name="speed" id="speedBtn" min="100" max="5000">
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
      executionLog("bubble-sort", "Visualization stopped...", "error");
      stopAnimation();
    }
    executionLog("bubble-sort", "Bubble sort mounted");
    generateRandomBars(getBarWidth());
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
      window.randomArray = generateRandomArray(getDatasetSize(), 40);
      generateRandomBars(getBarWidth());
      executionLog("bubble-sort", "Dataset randomized", "success");
    });
    smallDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "small") {
        return;
      }
      setDatasetSize("small");
      generateRandomBars(getBarWidth());
      executionLog("bubble-sort", "Dataset changed to small", "success");
    });
    largeDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "large") {
        return;
      }
      setDatasetSize("large");
      generateRandomBars(getBarWidth());
      executionLog("bubble-sort", "Dataset changed to large", "success");
    });
  },
  name: "bubbleSort"
};

async function* sortGenerator(arr) {
  let swapped;
  do {
    swapped = false;
    let awaitTime = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > arr[i + 1]) {
        let tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        swapped = true;
        awaitTime = yield {
          x: i,
          y: i + 1,
          canSwap: true,
          el1: arr[i + 1],
          el2: arr[i]
        };
      } else {
        awaitTime = yield {
          x: i,
          y: i + 1,
          canSwap: false,
          el1: arr[i],
          el2: arr[i + 1]
        };
      }
      await delay(awaitTime);
    }
  } while (swapped);
}

function generateRandomBars(width) {
  window.randomArray = generateRandomArray(getDatasetSize(), 40);
  let barsContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  barsContainer.innerHTML = "";
  let barsWrapper = document.querySelector(".bars-container .wrapper");
  let maxHeight = Math.max(...randomArray);
  barsWrapper.style.height = `${maxHeight * 4 + 20}px`;
  window.randomArray.forEach((v, i) => {
    createAndInsertBar(barsContainer, width, v, i);
  });
}

async function animate() {
  startAnimation();
  executionLog("bubble-sort", "Visualization started...", "success");
  disableActionButtons();
  let sorter = sortGenerator(window.randomArray);
  let v = await sorter.next(getDelayTime());
  while (!v.done) {
    if (!isAnimating()) {
      return;
    }
    let { x, y, canSwap, el1, el2 } = v.value;
    removeSwappingColors();
    if (y < window.randomArray.length) {
      let barX = document.querySelector(`.bubbleSort .bar${x}`);
      let barY = document.querySelector(`.bubbleSort .bar${y}`);
      executionLog("bubble-sort", `Comparing ${el1} & ${el2}`);
      addSwappingColors(barX, barY);
      await delay(getDelayTime());
      if (canSwap) {
        executionLog(
          "bubble-sort",
          `${el1} is greater than ${el2}, swapping them...`
        );
        await delay(getDelayTime());
        swapBars(barX, barY, x, y);
        await delay(getDelayTime());
      } else {
        await delay(getDelayTime());
      }
    }
    v = await sorter.next(getDelayTime());
  }
  enableActionButtons();
  executionLog("bubble-sort", "Array is now sorted", "success");
}

export default BubbleSort;
