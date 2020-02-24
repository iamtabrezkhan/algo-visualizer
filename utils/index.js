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
