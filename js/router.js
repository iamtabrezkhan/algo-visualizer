import Home from "../views/pages/Home.js";
import About from "../views/pages/About.js";
import Visualizer from "../views/pages/Visualizer.js";
import Error404 from "../views/pages/Error404.js";
import { insertPage } from "../utils/common.js";

const routes = {
  // "/": Home,
  "/visualizer": Visualizer
  // "/about": About
};

export default function router(contentDiv) {
  async function hashRouter(e) {
    console.log("hash");
    let pathname = e.newURL.split("#")[1];
    let url = window.location.origin + pathname;
    let oldPathname = window.location.pathname;
    window.history.replaceState({}, pathname, `${url}`);
    if (oldPathname !== pathname) {
      let page = routes[pathname];
      insertPage(contentDiv, page ? page : Error404);
    }
  }

  async function router(e) {
    let pathname = window.location.pathname;
    let page = routes[pathname];
    if (!page) {
      insertPage(contentDiv, Error404);
      return;
    }
    insertPage(contentDiv, page ? page : Error404);
  }

  window.addEventListener("load", function() {
    let page = routes[window.location.pathname];
    insertPage(contentDiv, page ? page : Error404);
  });

  window.addEventListener("hashchange", hashRouter);
  window.addEventListener("popstate", router);
}
