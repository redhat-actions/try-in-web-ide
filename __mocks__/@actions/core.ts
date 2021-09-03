// eslint-disable-next-line @typescript-eslint/no-explicit-any
const core: any = jest.genMockFromModule('@actions/core');

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

core.getInput = getInput;
core.__setInput = __setInput;

module.exports = core;
