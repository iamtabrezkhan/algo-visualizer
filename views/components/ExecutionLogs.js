import { getTime, clearLogs } from "../../utils/common.js";
import {} from "../../utils/searching.js";

const ExecutionLogs = {
  render: async function() {
    let view = `
            <div class="executionLogs" data-component="${this.name}" data-name="component">
              <div class="title">
                Execution Logs
                <button>Clear Logs</button>
              </div>
              <div class="execution-container font-source-code">
              </div>
            <div>
          `;
    return view;
  },
  componentDidMount: async function() {
    let clearLogsButton = document.querySelector(
      "#execution-logs-container .executionLogs > .title > button"
    );
    clearLogsButton.addEventListener("click", function() {
      clearLogs();
    });
  },
  name: "executionLogs"
};

export default ExecutionLogs;
