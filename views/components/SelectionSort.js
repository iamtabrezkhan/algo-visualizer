import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons,
  removeSwappingColors,
  addSwappingColors,
  swapBars,
  createAndInsertBar
} from "../../utils/index.js";

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
                </div>
              </div>
            <div>
          `;
    return view;
  },
  componentDidMount: function() {
    window.animationStart = false;
    generateRandomBars(window.barWidth);
    let animateButton = document.querySelector(".animateBtn");
    let randomizeButton = document.querySelector(".randomizeBtn");
    let speedButton = document.querySelector("#speedBtn");
    speedButton.value = window.delayTime;
    speedButton.addEventListener("change", function(e) {
      window.delayTime = parseInt(e.target.value);
    });
    animateButton.addEventListener("click", animate);
    randomizeButton.addEventListener("click", function() {
      window.randomArray = generateRandomArray(5, 40);
      generateRandomBars(window.barWidth);
    });
  },
  name: "selectionSort"
};

async function* sortGenerator(arr) {
  let awaitTime = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!window.animationStart) {
      break;
    }
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
  window.randomArray = generateRandomArray(10, 40);
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
  minPointer.style.transitionDuration = `${window.delayTime}ms`;
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
  window.animationStart = true;
  disableActionButtons();
  removeMinPointer();
  let minPointer = generateMinPointerElement();
  let barsContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  barsContainer.appendChild(minPointer);
  let sorter = sortGenerator(window.randomArray);
  let v = await sorter.next(window.delayTime);
  while (!v.done) {
    if (!window.animationStart) {
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
        await delay(window.delayTime);
        minPointer.style.left = `${window.barWidth * y + 20}px`;
        await delay(window.delayTime);
      } else {
        await delay(window.delayTime);
      }
      if (changeMin) {
        minPointer.style.transitionDuration = `${window.delayTime}ms`;
        minPointer.style.left = `${parseInt(barY.parentElement.style.left) -
          10}px`;
        await delay(window.delayTime);
      }
    }
    v = await sorter.next(window.delayTime);
  }
  enableActionButtons();
  removeSwappingColors();
}

export default SelectionSort;
