import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons
} from "../../utils/common.js";
import {
  addSwappingColors,
  removeSwappingColors,
  swapBars,
  createAndInsertBar
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
              </div>
            </div>
          <div>
        `;
    return view;
  },
  componentDidMount: async function() {
    window.animationStart = false;
    console.log(`Bubble Sort Mounted`);
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
  name: "bubbleSort"
};

async function* sortGenerator(arr) {
  let swapped;
  do {
    if (!window.animationStart) {
      console.log("stop bubble sort animation");
      break;
    }
    swapped = false;
    let awaitTime = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > arr[i + 1]) {
        let tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        swapped = true;
        awaitTime = yield { x: i, y: i + 1, canSwap: true };
      } else {
        awaitTime = yield { x: i, y: i + 1, canSwap: false };
      }
      await delay(awaitTime);
    }
  } while (swapped);
}

function generateRandomBars(width) {
  window.randomArray = generateRandomArray(5, 40);
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
  window.animationStart = true;
  disableActionButtons();
  let sorter = sortGenerator(window.randomArray);
  let v = await sorter.next(window.delayTime);
  while (!v.done) {
    if (!window.animationStart) {
      return;
    }
    let { x, y, canSwap } = v.value;
    removeSwappingColors();
    if (y < window.randomArray.length) {
      let barX = document.querySelector(`.bubbleSort .bar${x}`);
      let barY = document.querySelector(`.bubbleSort .bar${y}`);
      addSwappingColors(barX, barY);
      if (canSwap) {
        await delay(window.delayTime);
        swapBars(barX, barY, x, y);
        await delay(window.delayTime);
      } else {
        await delay(window.delayTime);
      }
    }
    v = await sorter.next(window.delayTime);
  }
  enableActionButtons();
}

export default BubbleSort;
