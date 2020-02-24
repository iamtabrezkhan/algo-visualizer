const Error404 = {
  render: async function() {
    let view = `
        <div class="error404" data-component="${this.name}" data-name="page">
          Error404
        <div>
      `;
    return view;
  },
  componentDidMount: function() {
    console.log(`Mounted Error404`);
  },
  name: "error"
};

export default Error404;
