/*
=============================================================================
utilities functions that are common to sorting algorithms
*/

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