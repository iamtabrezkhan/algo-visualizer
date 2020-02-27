/*
=============================================================================
utilities functions that are common to multiple components
*/

/**
 * animation speed in milliseconds
 */
let delayTime = 800;
let animationStart = false;

let colors = {
  textNormal: "#ffffff",
  textSuccess: "#00ff04",
  textError: "#ff3a3a"
};

export function isAnimating() {
  return animationStart !== false;
}

export function startAnimation() {
  animationStart = true;
}

export function stopAnimation() {
  animationStart = false;
}

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
    let smallDatasetButton = document.querySelector(".smallDatasetBtn");
    let largeDatasetButton = document.querySelector(".largeDatasetBtn");
    if (animateButton) animateButton.disabled = true;
    if (randomizeButton) randomizeButton.disabled = true;
    if (searchInput) searchInput.disabled = true;
    if (smallDatasetButton) smallDatasetButton.disabled = true;
    if (largeDatasetButton) largeDatasetButton.disabled = true;
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
    let smallDatasetButton = document.querySelector(".smallDatasetBtn");
    let largeDatasetButton = document.querySelector(".largeDatasetBtn");
    if (animateButton) animateButton.disabled = false;
    if (randomizeButton) randomizeButton.disabled = false;
    if (searchInput) searchInput.disabled = false;
    if (smallDatasetButton) smallDatasetButton.disabled = false;
    if (largeDatasetButton) largeDatasetButton.disabled = false;
  } catch (error) {
    console.warn(error);
  }
}

export function getTime(currentTimestamp = Date.now(), type = "24") {
  switch (type) {
    case "24": {
      let today = new Date(currentTimestamp);
      let hours = today.getHours();
      let minutes = today.getMinutes();
      let seconds = today.getSeconds();
      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${hours}:${minutes}:${seconds}`;
    }
    default: {
      break;
    }
  }
}

export function generateLogElement(hostName, logText, type = "normal") {
  let log = document.createElement("div");
  log.className = "log";
  let host = document.createElement("span");
  host.className = "host";
  host.innerText = `@${hostName}:`;
  let time = document.createElement("span");
  time.className = "time";
  time.innerText = getTime();
  let text = document.createElement("span");
  text.innerText = logText;
  text.className = "log-text";
  text.style.color =
    type === "normal"
      ? colors.textNormal
      : type === "success"
      ? colors.textSuccess
      : type === "error"
      ? colors.textError
      : "white";
  log.appendChild(host);
  log.appendChild(time);
  log.appendChild(text);
  return log;
}

export function executionLog(hostName, logText, type) {
  let logContainer = document.querySelector(
    ".executionLogs .execution-container"
  );
  let logEl = generateLogElement(hostName, logText, type);
  logContainer.appendChild(logEl);
  scrollContainerToBottom(logContainer);
}

export function clearLogs() {
  let logContainer = document.querySelector(
    ".executionLogs .execution-container"
  );
  logContainer.innerHTML = "";
}

export function userHasScrolledUp(container) {
  let scrollTop = container.scrollTop;
  let scrollHeight = container.scrollHeight;
  if (scrollHeight - scrollTop - scrollTop > 20) {
    return true;
  } else {
    return false;
  }
}

export function scrollContainerToBottom(container) {
  if (!userHasScrolledUp(container)) {
    container.scrollTo(0, container.scrollHeight);
  }
}
