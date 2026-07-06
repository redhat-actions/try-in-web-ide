// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inputs: Map<string, any> = new Map();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function __setInput(inputName: string, inputValue: any): void {
  inputs.set(inputName, inputValue);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getInput(paramName: string): any {
  return inputs.get(paramName);
}

export const info = jest.fn();
export const debug = jest.fn();
export const warning = jest.fn();
export const error = jest.fn();
export const setFailed = jest.fn();
export const setOutput = jest.fn();
export const getState = jest.fn();
export const saveState = jest.fn();
export const exportVariable = jest.fn();
export const addPath = jest.fn();
export const setCommandEcho = jest.fn();
export const isDebug = jest.fn();
export const startGroup = jest.fn();
export const endGroup = jest.fn();
export { getInput, __setInput };
