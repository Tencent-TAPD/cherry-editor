/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

/// <reference lib="dom" />

interface PrismMatch {
  alias?: string;
  greedy?: boolean;
  inside?: PrismLanguage & { rest?: PrismLanguage };
  lookbehind?: boolean;
  pattern: RegExp;
}

interface PrismUtils {
  clone<T>(o: T, visited?: any): T;
  currentScript(): string;
  encode<T extends string | PrismToken>(tokens: T[]): T[];
  encode<T extends string | PrismToken>(tokens: T): T;
  getLanguage(element: Element): string;
  objId(obj: any): number;
  type(o: any): string;
}

interface PrismHooks {
  all: Record<string, any>;

  add(name: string, callback: (env: any) => void): void;
  run(name: string, env: any): void;
}

export interface PrismLanguage {
  [name: string]: Function | RegExp | PrismMatch | PrismMatch[];
}

export interface PrismLanguages {
  insertBefore(inside: string, before: string, insert: Record<string, PrismMatch | PrismMatch[]>, root?: any): void;
  DFS(o: any, callback: Function, type: any, visited: any): void;
  [name: string]: Function | PrismLanguage;
}

export interface PrismTokenConstructor {
  new (type: string, content: string | PrismToken[], alias: string, matchedStr: string, greedy: boolean): PrismToken;

  stringify(token: PrismToken, language: string): string;
}

export interface PrismToken {
  alias: string;
  content: string | PrismToken[];
  greedy: boolean;
  length: number;
  type: string;
}

interface Prism {
  disableWorkerMessageHandler: boolean;
  filename: string;
  hooks: PrismHooks;
  languages: PrismLanguages;
  manual: boolean;
  plugins: Record<string, any>;
  util: PrismUtils;

  highlightAll(async?: boolean, callback?: (element: Element) => void): void;
  highlightAllUnder(element: Element, async?: boolean, callback?: (element: Element) => void): void;
  highlightElement(element: Element, async?: boolean, callback?: (element: Element) => void): void;
  highlight(text: string, grammar: PrismLanguage, language: string): string;
  matchGrammar(text: string, strarr: Array<string | PrismToken>, grammar: PrismLanguage, index: number, startPos: number, oneshot: boolean, target: string): void;
  tokenize(text: string, grammar: PrismLanguage): Array<string | PrismToken>[];

  Token: PrismTokenConstructor;
}

declare const Prism: Prism;
export default Prism;