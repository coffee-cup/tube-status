import { createModel } from "@prodo/core";
import loggerPlugin from "@prodo/logger";

export interface Line {
  id: string;
  name: string;
  colour: string;
  status?: string;
}

export const line = (id: string, name: string, colour: string): Line => ({
  id,
  name,
  colour,
});

export interface State {
  lines: { [id: string]: Line };
}

export const model = createModel<State>().with(loggerPlugin);
export const { state, watch, dispatch } = model.ctx;
