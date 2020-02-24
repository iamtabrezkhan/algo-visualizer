import { generateRandomArray, delay } from "../../utils/index.js";

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
              </div>
            </div>
          <div>
        `;
    return view;
  },
  componentDidMount: async function() {
    window.animationStart = false;
    console.log(`Linear Search Mounted`);
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
  name: "linearSearch"
};

async function* searchGenerator(arr, elToFind) {
  let awaitTime = window.delayTime;
  for (var i = 0; i < arr.length; i++) {
    if (!window.animationStart) {
      break;
    }
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
  window.randomArray = generateRandomArray(5, 40);
  window.randomArray.forEach((v, i) => {
    let elementBox = document.createElement("div");
    elementBox.className = `box${i} el-box`;
    elementBox.style.width = `${width}px`;
    elementBox.style.height = `${width}px`;
    elementBox.innerText = v;
    boxesContainer.appendChild(elementBox);
  });
  let pointer = generatePointer();
  boxesContainer.appendChild(pointer);
}

function generatePointer() {
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  let pointer = document.createElement("div");
  pointer.id = "pointer";
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  pointer.appendChild(wrapper);
  pointer.style.width = `${window.elementWidth}px`;
  pointer.style.left = `${getElementPosition(0).left}px`;
  pointer.style.bottom = `${getElementPosition(0).bottom + 35}px`;
  console.log(pointer);
  return pointer;
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
  if (!elToFind || Number.isNaN(elToFind)) {
    return;
  }
  window.animationStart = true;
  disableActionButtons();
  let sorter = searchGenerator(window.randomArray, elToFind);
  let pointer = document.querySelector("#pointer");
  pointer.childNodes[0].innerText = `${elToFind}?`;
  let v = await sorter.next(window.delayTime);
  while (!v.done) {
    if (!window.animationStart) {
      return;
    }
    pointer.style.opacity = "1";
    let { found, isPresent, el, i } = v.value;
    pointer.style.transitionDuration = `${window.delayTime}ms`;
    let { left, bottom } = getElementPosition(i);
    pointer.style.left = `${left}px`;
    pointer.style.bottom = `${bottom + 35}px`;
    await delay(window.delayTime);
    if (found) {
      pointer.classList.add("blinkSuccess");
      pointer.classList.remove("blinkError");
    } else {
      pointer.classList.add("blinkError");
      pointer.classList.remove("blinkSuccess");
    }
    v = await sorter.next(window.delayTime);
  }
  enableActionButtons();
}

function disableActionButtons() {
  let animateButton = document.querySelector(".animateBtn");
  let randomizeButton = document.querySelector(".randomizeBtn");
  let searchInput = document.querySelector("#searchElement");
  animateButton.disabled = true;
  randomizeButton.disabled = true;
  searchInput.disabled = true;
}

function enableActionButtons() {
  let animateButton = document.querySelector(".animateBtn");
  let randomizeButton = document.querySelector(".randomizeBtn");
  let searchInput = document.querySelector("#searchElement");
  animateButton.disabled = false;
  randomizeButton.disabled = false;
  searchInput.disabled = false;
}

export default LinearSearch;
