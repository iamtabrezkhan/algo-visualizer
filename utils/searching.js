import { getDelayTime } from "./common.js";

/*
=============================================================================
utilities functions that are common to searching algorithms
*/

let elementWidth = 50;
let dataset = {
  small: 6,
  large: 12,
  selected: "small"
};

export function getDatasetSize() {
  return dataset[dataset.selected];
}

export function setDatasetSize(v) {
  dataset.selected = v;
}

export function getSelectedDatasetType() {
  return dataset.selected;
}

export function setElementWidth(width) {
  elementWidth = width;
}

export function getElementWidth() {
  return elementWidth;
}

export function createAndInsertElement(container, width, value, index) {
  let elementBox = document.createElement("div");
  elementBox.className = `box${index} el-box`;
  elementBox.style.width = `${width}px`;
  elementBox.style.height = `${width}px`;
  elementBox.innerText = value;
  container.appendChild(elementBox);
}

export function createAndInsertPointer(text, left, bottom) {
  let boxesContainer = document.querySelector(
    ".algo-container .bars-container .wrapper"
  );
  let pointer = document.createElement("div");
  pointer.id = "pointer";
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  pointer.appendChild(wrapper);
  pointer.style.width = `${getElementWidth()}px`;
  pointer.style.left = `${left}px`;
  pointer.style.bottom = `${bottom + 35}px`;
  pointer.childNodes[0].innerText = text;
  boxesContainer.appendChild(pointer);
  return pointer;
}

export function movePointer(pointer, x, y) {
  pointer.style.transitionDuration = `${getDelayTime()}ms`;
  pointer.style.left = `${x}px`;
  pointer.style.bottom = `${y + 35}px`;
}

export function startBlinkingGreen(el) {
  el.classList.add("blinkSuccess");
  el.classList.remove("blinkError");
}

export function startBlinkingRed(el) {
  el.classList.add("blinkError");
  el.classList.remove("blinkSuccess");
}
