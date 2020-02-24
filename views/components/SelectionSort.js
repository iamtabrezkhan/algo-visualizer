import { generateRandomArray, delay } from "../../utils/index.js";

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
    console.log(`Selection Sort Mounted`);
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
      console.log("stop selection sort animation");
      break;
    }
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      console.log(`min is: ${min}`);
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
  window.randomArray.forEach((v, i) => {
    let barsWrapper = document.querySelector(".bars-container .wrapper");
    let maxHeight = Math.max(...randomArray);
    barsWrapper.style.height = `${maxHeight * 4 + 20}px`;
    let barContainer = document.createElement("div");
    barContainer.className = "bar-container";
    barContainer.style.width = `${width}px`;
    barContainer.style.left = `${i * width + 10}px`;
    let bar = document.createElement("div");
    bar.className = `bar${i} bar`;
    bar.style.height = `${v * 4}px`;
    let elementValue = document.createElement("div");
    elementValue.className = "value";
    elementValue.innerText = v;
    barContainer.appendChild(bar);
    barContainer.appendChild(elementValue);
    barsContainer.appendChild(barContainer);
  });
  let minPointer = generateMinPointerElement();
  barsContainer.appendChild(minPointer);
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

async function animate() {
  window.animationStart = true;
  disableActionButtons();
  let sorter = sortGenerator(window.randomArray);
  let v = await sorter.next(window.delayTime);
  while (!v.done) {
    if (!window.animationStart) {
      return;
    }
    let { min, y, canSwap, changeMin } = v.value;
    removeSwappingColors();
    console.log(v.value);
    let minPointer = document.querySelector(".min-pointer");
    if (y < window.randomArray.length) {
      let barX = document.querySelector(`.selectionSort .bar${min}`);
      let barY = document.querySelector(`.selectionSort .bar${y}`);
      let barXContainer = barX.parentElement;
      let barYContainer = barY.parentElement;
      barXContainer.style.transitionDuration = `${window.delayTime}ms`;
      barYContainer.style.transitionDuration = `${window.delayTime}ms`;
      barX.classList.add("swapping");
      barY.classList.add("swapping");
      if (canSwap) {
        let barXContainerLeft = barXContainer.style.left;
        let barYContainerLeft = barYContainer.style.left;
        barXContainer.style.left = barYContainerLeft;
        barYContainer.style.left = barXContainerLeft;
        await delay(window.delayTime);
        barX.className = `bar${y} bar swapping`;
        barY.className = `bar${min} bar swapping`;
        minPointer.style.left = `${window.barWidth * y + 20}px`;
        await delay(window.delayTime);
      }
      if (changeMin) {
        minPointer.style.transitionDuration = `${window.delayTime}ms`;
        minPointer.style.left = `${parseInt(barYContainer.style.left) - 10}px`;
        await delay(window.delayTime);
      }
    }
    v = await sorter.next(window.delayTime);
  }
  enableActionButtons();
  removeSwappingColors();
}

function removeSwappingColors() {
  let activeBars = document.querySelectorAll(".swapping");
  for (let i = 0; i < activeBars.length; i++) {
    activeBars[i].classList.remove("swapping");
  }
}

function disableActionButtons() {
  let animateButton = document.querySelector(".animateBtn");
  let randomizeButton = document.querySelector(".randomizeBtn");
  animateButton.disabled = true;
  randomizeButton.disabled = true;
}

function enableActionButtons() {
  let animateButton = document.querySelector(".animateBtn");
  let randomizeButton = document.querySelector(".randomizeBtn");
  animateButton.disabled = false;
  randomizeButton.disabled = false;
}

export default SelectionSort;
