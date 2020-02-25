import {
  generateRandomArray,
  delay,
  disableActionButtons,
  enableActionButtons,
  getDelayTime,
  setDelayTime
} from "../../utils/common.js";
import {
  createAndInsertElement,
  createAndInsertPointer,
  movePointer,
  startBlinkingGreen,
  startBlinkingRed
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
    speedButton.value = getDelayTime();
    speedButton.addEventListener("change", function(e) {
      setDelayTime(parseInt(e.target.value));
    });
    animateButton.addEventListener("click", animate);
    randomizeButton.addEventListener("click", function() {
      generateRandomElements(window.elementWidth);
    });
  },
  name: "linearSearch"
};

async function* searchGenerator(arr, elToFind) {
  let awaitTime = getDelayTime();
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
  if (!elToFind || Number.isNaN(elToFind)) {
    return;
  }
  window.animationStart = true;
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
    if (!window.animationStart) {
      return;
    }
    let { found, isPresent, el, i } = v.value;
    let { left, bottom } = getElementPosition(i);
    startBlinkingRed(pointer);
    movePointer(pointer, left, bottom);
    await delay(getDelayTime());
    if (found) {
      startBlinkingGreen(pointer);
    } else {
      startBlinkingRed(pointer);
    }
    v = await sorter.next(getDelayTime());
  }
  enableActionButtons();
}

export default LinearSearch;
