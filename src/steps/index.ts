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

function replaceWithCount(
  input: string,
  search: string | RegExp,
  replace: string,
): { result: string; count: number } {
  let count = 0;
  const result = input.replace(
    search instanceof RegExp ? search : new RegExp(search, 'g'),
    () => {
      count++;
      return replace;
    },
  );
  return { result, count };
}

// step to replace em dash and en dash with plain hyphen
export const dashStep: Step = (input: string): StepResult => {
  const { result: noEmDash, count: emDashes } = replaceWithCount(
    input,
    /\u2014/g,
    '-',
  );
  const { result: output, count: enDashes } = replaceWithCount(
    noEmDash,
    /\u2013/g,
    '-',
  );
  const message = `Replaced ${emDashes} em dashes and ${enDashes} en dashes`;
  return {
    label: 'Replace Dashes',
    input,
    output,
    message,
  };
};

// step to remove non-printable characters
export const nonPrintableStep: Step = (input: string): StepResult => {
  const { result: output, count } = replaceWithCount(
    input,
    /[\x00-\x1F\x7F-\x9F]/g,
    '',
  );
  const message = `Removed ${count} non-printable characters.`;
  return {
    label: 'Remove Non-Printable Characters',
    input,
    output,
    message,
  };
};

// step to replace special quotes with standard versions
export const quoteStep: Step = (input: string): StepResult => {
  const { result: withoutCurlySingle, count: curlySingles } = replaceWithCount(
    input,
    /[\u2018\u2019]/g,
    "'",
  ); // Curly single quotes to straight single quote
  const { result: output, count: curlyDoubles } = replaceWithCount(
    withoutCurlySingle,
    /[\u201C\u201D]/g,
    '"',
  ); // Curly double quotes to straight double quote
  const message = `Replaced ${curlySingles} single quotes and ${curlyDoubles} double quotes.`;
  return {
    label: 'Replace Special Quotes',
    input,
    output,
    message,
  };
};

// step to replace special whitespace  characters
export const whitespaceStep: Step = (input: string): StepResult => {
  // TODO: Replace with /[\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g
  // TODO: Do special space replacement and multi-space collapse seperately
  const { result: output, count } = replaceWithCount(
    input,
    /\p{White_Space}+/gu,
    ' ',
  );
  const message = `Replaced ${count} whitepace sequences`;
  return {
    label: 'Normalize Whitespace',
    input,
    output,
    message,
  };
};

// function to run all steps in sequence
export function processText(input: string): StepResult[] {
  const steps: Step[] = [dashStep, nonPrintableStep, quoteStep, whitespaceStep];
  return runSteps(steps, input);
}
