/*
=============================================================================
utilities functions that are common to multiple components
*/

/**
 * animation speed in milliseconds
 */
let delayTime = 800;

export function getElementById(id) {
  return document.getElementById(id);
}

/**
 * inserts a page dynamically into a html container element
 * @param {HTMLElement} routerOutlet
 * @param {see --> /views/pages} page
 * @author Tabrez Khan
 */
export async function insertPage(routerOutlet, page) {
  if (page) {
    if (!checkIfAlreadyMounted(page.name)) {
      let view = await page.render();
      routerOutlet.innerHTML = view;
      page.componentDidMount();
      scrollToTop();
    }
  }
}

/**
 * inserts a component dynamically into a html container element
 * @param {HTMLElement} parent
 * @param {see --> /views/components} component
 * @author Tabrez Khan
 */
export async function insertComponent(parent, component) {
  if (component) {
    if (!checkIfAlreadyMounted(component.name)) {
      let view = await component.render();
      parent.innerHTML = view;
      component.componentDidMount();
    }
  }
}

/**
 * scrolls window to the top
 * @author Tabrez Khan
 */
function scrollToTop() {
  window.scrollTo(0, 0);
}

/**
 * checks if component is already present in the DOM
 * @param {string} name see --> /views/components
 * @author Tabrez Khan
 */
export function checkIfAlreadyMounted(name) {
  let currentComponent = document.querySelector(
    `div[data-component="${name}"]`
  );
  if (currentComponent) {
    return true;
  }
  return false;
}

/**
 * generate a random array of given length and each element is between 1 and the given max value
 * @param {number} length
 * @param {number} max
 * @author Tabrez Khan
 */
export function generateRandomArray(length, max) {
  let temp = Array.from({ length: length }, function() {
    return Math.floor(Math.random() * max) + 1;
  });
  return temp;
}

/**
 * returns a fulfilled promise after given time in milliseconds
 * @param {number} ms
 * @author Tabrez Khan
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * set the delay time for animation speed
 * @param {number} ms
 * @author Tabrez Khan
 */
export function setDelayTime(ms) {
  delayTime = ms;
}

/**
 * return the delay time for animation speed
 * @author Tabrez Khan
 */
export function getDelayTime() {
  return delayTime;
}

/**
 * disable all action buttons, set their disabled property to true
 */
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

/**
 * enable action buttons, set their disabled property to false
 */
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
