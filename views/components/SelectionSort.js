import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons,
  getDelayTime,
  setDelayTime,
  startAnimation,
  stopAnimation,
  isAnimating
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

const SelectionSort = {
  render: async function() {
    let view = `
            <div class="selectionSort" data-component="${this.name}" data-name="component">
              <div class="warpper">
                <div class="title">
                  Selection Sort: Loop through the input array linearly, selecting the first smallest element, and then swap it to the first position. Then you loop through the array again using a linear scan and get the second smallest element, swap it to the second position, and so on and so forth until your array is completely sorted.
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
  componentDidMount: function() {
    stopAnimation();
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
    });
    smallDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "small") {
        return;
      }
      setDatasetSize("small");
      generateRandomBars(getBarWidth());
    });
    largeDatasetButton.addEventListener("click", function() {
      if (getSelectedDatasetType() === "large") {
        return;
      }
      setDatasetSize("large");
      generateRandomBars(getBarWidth());
    });
  },
  name: "selectionSort"
};

async function* sortGenerator(arr) {
  let awaitTime = getDelayTime();
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        awaitTime = yield {
          min: min,
          y: j,
          canSwap: false,
          changeMin: true
        };
        min = j;
      } else {
        awaitTime = yield {
          min: min,
          y: j,
          canSwap: false,
          changeMin: false
        };
      }
      await delay(awaitTime);
    }
    if (min !== i) {
      let tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
      awaitTime = yield {
        min: min,
        y: i,
        canSwap: true,
        changeMin: false
      };
    } else {
      awaitTime = yield {
        min: min,
        y: i + 1,
        canSwap: false,
        changeMin: true
      };
    }
    await delay(awaitTime);
  }
}

function generateRandomBars(width) {
  window.randomArray = generateRandomArray(getDatasetSize(), 40);
  let barsContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  barsContainer.innerHTML = "";
  let barsWrapper = document.querySelector(".bars-container .wrapper");
  let maxHeight = Math.max(...window.randomArray);
  barsWrapper.style.height = `${maxHeight * 4 + 20}px`;
  window.randomArray.forEach((v, i) => {
    createAndInsertBar(barsContainer, width, v, i);
  });
}

function generateMinPointerElement() {
  let minPointer = document.createElement("div");
  minPointer.className = "min-pointer";
  let minPointerWrapper = document.createElement("div");
  minPointerWrapper.innerText = "min";
  minPointerWrapper.className = "wrapper";
  minPointer.style.transitionDuration = `${getDelayTime()}ms`;
  minPointer.appendChild(minPointerWrapper);
  return minPointer;
}

function removeMinPointer() {
  let parent = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  let oldChild = document.querySelector(".min-pointer");
  if (oldChild) parent.removeChild(oldChild);
}

async function animate() {
  startAnimation();
  disableActionButtons();
  removeMinPointer();
  let minPointer = generateMinPointerElement();
  let barsContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  barsContainer.appendChild(minPointer);
  let sorter = sortGenerator(window.randomArray);
  let v = await sorter.next(getDelayTime());
  while (!v.done) {
    if (!isAnimating()) {
      return;
    }
    let { min, y, canSwap, changeMin } = v.value;
    removeSwappingColors();
    if (y < window.randomArray.length) {
      let barX = document.querySelector(`.selectionSort .bar${min}`);
      let barY = document.querySelector(`.selectionSort .bar${y}`);
      addSwappingColors(barX, barY);
      if (canSwap) {
        swapBars(barX, barY, min, y);
        await delay(getDelayTime());
        minPointer.style.left = `${getBarWidth() * y + 20}px`;
        await delay(getDelayTime());
      } else {
        await delay(getDelayTime());
      }
      if (changeMin) {
        minPointer.style.transitionDuration = `${getDelayTime()}ms`;
        minPointer.style.left = `${parseInt(barY.parentElement.style.left) -
          10}px`;
        await delay(getDelayTime());
      }
    }
    v = await sorter.next(getDelayTime());
  }
  enableActionButtons();
  removeSwappingColors();
}

export default SelectionSort;
