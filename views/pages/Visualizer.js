import BubbleSort from "../components/BubbleSort.js";
import SelectionSort from "../components/SelectionSort.js";
import LinearSearch from "../components/LinearSearch.js";
import BinarySearch from "../components/BinarySearch.js";
import { checkIfAlreadyMounted, insertComponent } from "../../utils/common.js";

const Visualizer = {
  render: async function() {
    let view = `
        <div class="visualizer" data-component="${this.name}" data-name="page">
          <div class="wrapper">
                  <div class="types">
                          <div class="title">Select Algorithm Here</div>
                          <button data-algo="bubble" class="active-algo-type">Bubble Sort</button>
                          <button data-algo="selection" class="">Selection Sort</button>
                          <button data-algo="linearSearch" class="">Linear Search</button>
                          <button data-algo="binarySearch" class="">Binary Search</button>
                  </div>
                  <div class="algo-container">
                        <div class="wrapper">
                                
                        </div>
                  </div>
          </div>
        <div>`;
    return view;
  },
  componentDidMount: function() {
    // global so that we can access it anywhere
    window.selectedAlgo = "bubbleSort";
    mountSelectedAlgo(BubbleSort);
    let algoButtons = document.querySelectorAll(".types button");
    for (let i = 0; i < algoButtons.length; i++) {
      algoButtons[i].addEventListener("click", changeAlgo);
    }
  },
  name: "visualizer"
};

function changeAlgo(e) {
  let selectedButton = e.target;
  let selectedAlgo = selectedButton.dataset.algo;
  let oldButton = document.querySelector(".active-algo-type");
  oldButton.classList.remove("active-algo-type");
  selectedButton.classList.add("active-algo-type");
  let algoContainer = document.querySelector(".algo-container .wrapper");
  switch (selectedAlgo) {
    case "bubble": {
      // render bubble sort component
      insertComponent(algoContainer, BubbleSort);
      break;
    }
    case "selection": {
      // render selection sort component
      insertComponent(algoContainer, SelectionSort);
      break;
    }
    case "linearSearch": {
      // render linear search component
      insertComponent(algoContainer, LinearSearch);
      break;
    }
    case "binarySearch": {
      // render linear search component
      insertComponent(algoContainer, BinarySearch);
      break;
    }
    default: {
      console.error("Invalid algo type");
      break;
    }
  }
}

async function mountSelectedAlgo(algoComponent) {
  if (!checkIfAlreadyMounted(algoComponent.name)) {
    let algoContainer = document.querySelector(".algo-container .wrapper");
    algoContainer.innerHTML = await algoComponent.render();
    algoComponent.componentDidMount();
  }
}

export default Visualizer;
