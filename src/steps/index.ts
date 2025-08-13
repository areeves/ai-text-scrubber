export type StepResult = {
  label: string;
  input: string;
  output: string;
  message: string;
};

export type Step = (input: string) => StepResult;

export function runSteps(steps: Step[], initialInput: string): StepResult[] {
  let input = initialInput;
  const results: StepResult[] = [];

  for (const step of steps) {
    const result = step(input);
    results.push(result);
    input = result.output; // Update input for the next step
  }

  return results;
}

// step to replace em dash and en dash with plain hyphen
export const dashStep: Step = (input: string): StepResult => {
  const output = input.replace(/—/g, '-').replace(/–/g, '-');
  return {
    label: 'Replace Dashes',
    input,
    output,
    message: 'Replaced em dash and en dash with hyphen.',
  };
};

// step to remove non-printable characters
export const nonPrintableStep: Step = (input: string): StepResult => {
  const output = input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  return {
    label: 'Remove Non-Printable Characters',
    input,
    output,
    message: 'Removed non-printable characters.',
  };
};

// step to replace special quotes with standard versions
export const quoteStep: Step = (input: string): StepResult => {
  const output = input
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/‘/g, "'")
    .replace(/’/g, "'");
  return {
    label: 'Replace Special Quotes',
    input,
    output,
    message: 'Replaced special quotes with standard versions.',
  };
};

// step to replace special whitespace  characters
export const whitespaceStep: Step = (input: string): StepResult => {
  const output = input.replace(/\s+/g, ' ').trim();
  return {
    label: 'Normalize Whitespace',
    input,
    output,
    message: 'Replaced multiple spaces with a single space and trimmed.',
  };
};

// function to run all steps in sequence
export function processText(input: string): StepResult[] {
  const steps: Step[] = [dashStep, nonPrintableStep, quoteStep, whitespaceStep];
  return runSteps(steps, input);
}
