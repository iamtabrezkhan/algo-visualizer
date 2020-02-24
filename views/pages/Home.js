const Home = {
  render: async function() {
    let view = `
      <div class="home" data-component="${this.name}" data-name="page">
        <div class="section-1">
          <img src="./assets/home-bg-1.svg">
          <div class="wrapper">
            <div class="left">
              <h2>Understanding algorithms has never been so easier</h2>
              <div class="text">
                Learn different algorithms with the visualization tool.
              </div>
              <div class="get-started">
                <a href="#/visualizer" class="font-tomorrow">Get started</a>
              </div>
            </div>
            <div class="right">
              <img src="./assets/algo-bg.png" alt="ALGORITHMS">
            </div>
          </div>
        </div>
        <div class="section-2">
          <div class="wrapper">
            <div class="left">
              <div class="text">
                Simple animations for complex algorithms
              </div>
              <img src="./assets/simple.png" alt="SIMPLE">
            </div>
            <div class="right">
              Simple
            </div>
          </div>
        </div>
      <div>
    `;
    return view;
  },
  componentDidMount: function() {
    console.log(`Mounted Home`);
  },
  name: "home"
};

export default Home;
