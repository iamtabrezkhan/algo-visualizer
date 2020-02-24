const About = {
  render: async function() {
    let view = `
        <div class="about" data-component="${this.name}" data-name="page">
          About
        <div>
      `;
    return view;
  },
  componentDidMount: function() {
    console.log(`Mounted About`);
  },
  name: "about"
};

export default About;
