import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { model, line } from "./model";

import "./styles.css";

const { Provider } = model.createStore({
  logger: process.env.NODE_ENV === "production" ? false : true,
  initState: {
    lines: {
      bakerloo: line("bakerloo", "Bakerloo", "#b36305"),
      central: line("central", "Central", "#e32017"),
      circle: line("circle", "Circle", "#ffd300"),
      district: line("district", "District", "#00782a"),
      "hammersmith-city": line(
        "hammersmith-city",
        "Hammersmith and City",
        "#f3a9bb",
      ),
      jubilee: line("jubilee", "Jubliee", "#a0a5a9"),
      metropolitan: line("metropolitan", "Metropolitan", "#9b0056"),
      Northern: line("northern", "Northern", "#000000"),
      Piccadilly: line("piccadilly", "Piccadilly", "#003688"),
      victoria: line("victoria", "Victoria", "#0098d4"),
      "waterloo-city": line("waterloo-city", "Waterloo and City", "#95cdba"),
    },
  },
});

const render = () => {
  ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
    document.getElementById("root"),
  );
};

if (module.hot) {
  module.hot.accept("./App", () => {
    render();
  });
}

render();
