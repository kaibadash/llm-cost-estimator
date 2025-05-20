declare module '*.csv' {
  const content: string;
  export default content;
}

declare module 'js-tiktoken' {
  export class Tiktoken {
    constructor(model: string);
    encode(text: string): number[];
  }
} 