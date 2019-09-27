import * as React from "react";
import { dispatch, state, watch } from "./model";

const appId = "d4de3372";
const apiKey = "1096e5b7b95740b7ab964f4248d3297b";

const getDistruptionForLine = async (id: string) => {
  const url = `https://api.tfl.gov.uk/Line/${id}/Disruption?app_id=${appId}&app_key=${apiKey}`;
  const data = await fetch(url).then(res => res.json());

  if (data.length === 0) {
    state.lines[id].status = "Good Service";
  } else {
    const words = [];
    const text: string = data[0].closureText;
    let s = text[0].toUpperCase();

    for (let i = 1; i < text.length; i += 1) {
      const c = text[i];
      if (c === c.toUpperCase()) {
        // new word
        words.push(s);
        s = "";
      }
      s += c;
    }

    words.push(s);
    state.lines[id].status = words.join(" ");
  }
};

const getDisruptions = async () => {
  Object.keys(state.lines).forEach(id => {
    dispatch(getDistruptionForLine)(id);
  });
};

const Line: React.FC<{ id: string }> = ({ id }) => {
  const line = watch(state.lines[id]);

  return (
    <div className="line" style={{ backgroundColor: line.colour }}>
      <h2>{line.name}</h2>
      {line.status != null ? <p>{line.status}</p> : <div className="loader" />}
    </div>
  );
};

const Lines = () => {
  const lines = watch(state.lines);

  return (
    <div className="lines">
      {Object.keys(lines).map(lid => (
        <Line key={lid} id={lid} />
      ))}
    </div>
  );
};

const App = () => {
  React.useEffect(() => {
    dispatch(getDisruptions)();
  }, []);

  return (
    <div className="app">
      <h1>Tube Lines</h1>

      <Lines />
    </div>
  );
};

export default App;
