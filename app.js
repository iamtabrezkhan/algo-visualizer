import { insertComponent, getElementById } from "./utils/index.js";
import router from "./js/router.js";

let contentDiv = getElementById("content");

window.delayTime = 800;
window.barWidth = 20;
window.elementWidth = 50;
window.animationStart = false;

// init router function and pass contentDiv element in which we want to append our pages. ================
router(contentDiv);

// scroll event to
document.addEventListener("scroll", function(e) {
  let scrollTop = e.target.scrollingElement.scrollTop;
  let scrollHeight = e.target.scrollingElement.scrollHeight;
  let navbar = document.getElementsByTagName("nav")[0];
  if (scrollHeight - window.innerHeight > scrollTop) {
    if (scrollTop > 110) {
      if (!navbar.classList.contains("nav-scroll")) {
        navbar.classList.add("nav-scroll");
      }
    } else {
      if (navbar.classList.contains("nav-scroll")) {
        navbar.classList.remove("nav-scroll");
      }
    }
  }
});
