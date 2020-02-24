export function getElementById(id) {
  return document.getElementById(id);
}

export async function insertComponent(parent, component) {
  if (component) {
    let view = await component.render();
    parent.innerHTML = view;
    component.componentDidMount();
    scrollToTop();
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

export function checkIfAlreadyMounted(name) {
  let currentComponent = document.querySelector(
    `div[data-component="${name}"]`
  );
  if (currentComponent) {
    return true;
  }
  return false;
}

export function generateRandomArray(length, max) {
  let temp = Array.from({ length: length }, function() {
    return Math.floor(Math.random() * max) + 1;
  });
  return temp;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function disableActionButtons() {
  try {
    let animateButton = document.querySelector(".animateBtn");
    let randomizeButton = document.querySelector(".randomizeBtn");
    let searchInput = document.querySelector("#searchElement");
    animateButton.disabled = true;
    randomizeButton.disabled = true;
    searchInput.disabled = true;
  } catch (error) {
    console.warn(error);
  }
}

export function enableActionButtons() {
  try {
    let animateButton = document.querySelector(".animateBtn");
    let randomizeButton = document.querySelector(".randomizeBtn");
    let searchInput = document.querySelector("#searchElement");
    animateButton.disabled = false;
    randomizeButton.disabled = false;
    searchInput.disabled = false;
  } catch (error) {
    console.warn(error);
  }
}

export function addSwappingColors(barX, barY) {
  barX.classList.add("swapping");
  barY.classList.add("swapping");
}

export function removeSwappingColors() {
  let activeBars = document.querySelectorAll(".swapping");
  for (let i = 0; i < activeBars.length; i++) {
    activeBars[i].classList.remove("swapping");
  }
}

export function swapBars(barX, barY, x, y) {
  let barXContainer = barX.parentElement;
  let barYContainer = barY.parentElement;
  barXContainer.style.transitionDuration = `${window.delayTime}ms`;
  barYContainer.style.transitionDuration = `${window.delayTime}ms`;
  let barXContainerLeft = barXContainer.style.left;
  let barYContainerLeft = barYContainer.style.left;
  barXContainer.style.left = barYContainerLeft;
  barYContainer.style.left = barXContainerLeft;
  barX.className = `bar${y} bar swapping`;
  barY.className = `bar${x} bar swapping`;
}

export function createAndInsertBar(container, width, value, index) {
  let barContainer = document.createElement("div");
  barContainer.className = "bar-container";
  barContainer.style.width = `${width}px`;
  barContainer.style.left = `${index * width + 10}px`;
  let bar = document.createElement("div");
  bar.className = `bar${index} bar`;
  bar.style.height = `${value * 4}px`;
  let elementValue = document.createElement("div");
  elementValue.className = "value";
  elementValue.innerText = value;
  barContainer.appendChild(bar);
  barContainer.appendChild(elementValue);
  container.appendChild(barContainer);
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
  pointer.style.width = `${window.elementWidth}px`;
  pointer.style.left = `${left}px`;
  pointer.style.bottom = `${bottom + 35}px`;
  pointer.childNodes[0].innerText = text;
  boxesContainer.appendChild(pointer);
  return pointer;
}

export function movePointer(pointer, x, y) {
  pointer.style.transitionDuration = `${window.delayTime}ms`;
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
