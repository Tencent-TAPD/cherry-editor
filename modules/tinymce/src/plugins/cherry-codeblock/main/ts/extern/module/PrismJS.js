/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

var exports = {}, module = { exports: exports }, global = {};
(function (define, exports, module, require) {
	// preserve the global if it has already been loaded
	var oldprism = window.Prism;
	window.Prism = { manual: true };
	(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.EphoxContactWrapper = f() } })(function () {
		var define, module, exports; return (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
			1: [function (require, module, exports) {
				Prism.languages.c = Prism.languages.extend('clike', {
					'comment': {
						pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
						greedy: true
					},
					'class-name': {
						pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+/,
						lookbehind: true
					},
					'keyword': /\b(?:__attribute__|_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
					'function': /[a-z_]\w*(?=\s*\()/i,
					'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
					'number': /(?:\b0x(?:[\da-f]+\.?[\da-f]*|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
				});

				Prism.languages.insertBefore('c', 'string', {
					'macro': {
						// allow for multiline macro definitions
						// spaces after the # character compile fine with gcc
						pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
						lookbehind: true,
						greedy: true,
						alias: 'property',
						inside: {
							'string': [
								{
									// highlight the path of the include statement as a string
									pattern: /^(#\s*include\s*)<[^>]+>/,
									lookbehind: true
								},
								Prism.languages.c['string']
							],
							'comment': Prism.languages.c['comment'],
							// highlight macro directives as keywords
							'directive': {
								pattern: /^(#\s*)[a-z]+/,
								lookbehind: true,
								alias: 'keyword'
							},
							'directive-hash': /^#/,
							'punctuation': /##|\\(?=[\r\n])/,
							'expression': {
								pattern: /\S[\s\S]*/,
								inside: Prism.languages.c
							}
						}
					},
					// highlight predefined macros as constants
					'constant': /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
				});

				delete Prism.languages.c['boolean'];

			}, {}], 2: [function (require, module, exports) {
				Prism.languages.clike = {
					'comment': [
						{
							pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
							lookbehind: true
						},
						{
							pattern: /(^|[^\\:])\/\/.*/,
							lookbehind: true,
							greedy: true
						}
					],
					'string': {
						pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
						greedy: true
					},
					'class-name': {
						pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
						lookbehind: true,
						inside: {
							'punctuation': /[.\\]/
						}
					},
					'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
					'boolean': /\b(?:true|false)\b/,
					'function': /\w+(?=\()/,
					'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
					'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
					'punctuation': /[{}[\];(),.:]/
				};

			}, {}], 3: [function (require, module, exports) {
				(function (global) {
					(function () {
						/// <reference lib="WebWorker"/>

						var _self = (typeof window !== 'undefined')
							? window   // if in browser
							: (
								(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
									? self // if in worker
									: {}   // if in node js
							);

						/**
						 * Prism: Lightweight, robust, elegant syntax highlighting
						 *
						 * @license MIT <https://opensource.org/licenses/MIT>
						 * @author Lea Verou <https://lea.verou.me>
						 * @namespace
						 * @public
						 */
						var Prism = (function (_self) {

							// Private helper vars
							var lang = /\blang(?:uage)?-([\w-]+)\b/i;
							var uniqueId = 0;


							var _ = {
								/**
								 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
								 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
								 * additional languages or plugins yourself.
								 *
								 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
								 *
								 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
								 * empty Prism object into the global scope before loading the Prism script like this:
								 *
								 * ```js
								 * window.Prism = window.Prism || {};
								 * Prism.manual = true;
								 * // add a new <script> to load Prism's script
								 * ```
								 *
								 * @default false
								 * @type {boolean}
								 * @memberof Prism
								 * @public
								 */
								manual: _self.Prism && _self.Prism.manual,
								disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

								/**
								 * A namespace for utility methods.
								 *
								 * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
								 * change or disappear at any time.
								 *
								 * @namespace
								 * @memberof Prism
								 */
								util: {
									encode: function encode(tokens) {
										if (tokens instanceof Token) {
											return new Token(tokens.type, encode(tokens.content), tokens.alias);
										} else if (Array.isArray(tokens)) {
											return tokens.map(encode);
										} else {
											return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
										}
									},

									/**
									 * Returns the name of the type of the given value.
									 *
									 * @param {any} o
									 * @returns {string}
									 * @example
									 * type(null)      === 'Null'
									 * type(undefined) === 'Undefined'
									 * type(123)       === 'Number'
									 * type('foo')     === 'String'
									 * type(true)      === 'Boolean'
									 * type([1, 2])    === 'Array'
									 * type({})        === 'Object'
									 * type(String)    === 'Function'
									 * type(/abc+/)    === 'RegExp'
									 */
									type: function (o) {
										return Object.prototype.toString.call(o).slice(8, -1);
									},

									/**
									 * Returns a unique number for the given object. Later calls will still return the same number.
									 *
									 * @param {Object} obj
									 * @returns {number}
									 */
									objId: function (obj) {
										if (!obj['__id']) {
											Object.defineProperty(obj, '__id', { value: ++uniqueId });
										}
										return obj['__id'];
									},

									/**
									 * Creates a deep clone of the given object.
									 *
									 * The main intended use of this function is to clone language definitions.
									 *
									 * @param {T} o
									 * @param {Record<number, any>} [visited]
									 * @returns {T}
									 * @template T
									 */
									clone: function deepClone(o, visited) {
										visited = visited || {};

										var clone, id;
										switch (_.util.type(o)) {
											case 'Object':
												id = _.util.objId(o);
												if (visited[id]) {
													return visited[id];
												}
												clone = /** @type {Record<string, any>} */ ({});
												visited[id] = clone;

												for (var key in o) {
													if (o.hasOwnProperty(key)) {
														clone[key] = deepClone(o[key], visited);
													}
												}

												return /** @type {any} */ (clone);

											case 'Array':
												id = _.util.objId(o);
												if (visited[id]) {
													return visited[id];
												}
												clone = [];
												visited[id] = clone;

												(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
													clone[i] = deepClone(v, visited);
												});

												return /** @type {any} */ (clone);

											default:
												return o;
										}
									},

									/**
									 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
									 *
									 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
									 *
									 * @param {Element} element
									 * @returns {string}
									 */
									getLanguage: function (element) {
										while (element && !lang.test(element.className)) {
											element = element.parentElement;
										}
										if (element) {
											return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
										}
										return 'none';
									},

									/**
									 * Returns the script element that is currently executing.
									 *
									 * This does __not__ work for line script element.
									 *
									 * @returns {HTMLScriptElement | null}
									 */
									currentScript: function () {
										if (typeof document === 'undefined') {
											return null;
										}
										if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
											return /** @type {any} */ (document.currentScript);
										}

										// IE11 workaround
										// we'll get the src of the current script by parsing IE11's error stack trace
										// this will not work for inline scripts

										try {
											throw new Error();
										} catch (err) {
											// Get file src url from stack. Specifically works with the format of stack traces in IE.
											// A stack will look like this:
											//
											// Error
											//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
											//    at Global code (http://localhost/components/prism-core.js:606:1)

											var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
											if (src) {
												var scripts = document.getElementsByTagName('script');
												for (var i in scripts) {
													if (scripts[i].src == src) {
														return scripts[i];
													}
												}
											}
											return null;
										}
									},

									/**
									 * Returns whether a given class is active for `element`.
									 *
									 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
									 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
									 * given class is just the given class with a `no-` prefix.
									 *
									 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
									 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
									 * ancestors have the given class or the negated version of it, then the default activation will be returned.
									 *
									 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
									 * version of it, the class is considered active.
									 *
									 * @param {Element} element
									 * @param {string} className
									 * @param {boolean} [defaultActivation=false]
									 * @returns {boolean}
									 */
									isActive: function (element, className, defaultActivation) {
										var no = 'no-' + className;

										while (element) {
											var classList = element.classList;
											if (classList.contains(className)) {
												return true;
											}
											if (classList.contains(no)) {
												return false;
											}
											element = element.parentElement;
										}
										return !!defaultActivation;
									}
								},

								/**
								 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
								 *
								 * @namespace
								 * @memberof Prism
								 * @public
								 */
								languages: {
									/**
									 * Creates a deep copy of the language with the given id and appends the given tokens.
									 *
									 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
									 * will be overwritten at its original position.
									 *
									 * ## Best practices
									 *
									 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
									 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
									 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
									 *
									 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
									 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
									 *
									 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
									 * @param {Grammar} redef The new tokens to append.
									 * @returns {Grammar} The new language created.
									 * @public
									 * @example
									 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
									 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
									 *     // at its original position
									 *     'comment': { ... },
									 *     // CSS doesn't have a 'color' token, so this token will be appended
									 *     'color': /\b(?:red|green|blue)\b/
									 * });
									 */
									extend: function (id, redef) {
										var lang = _.util.clone(_.languages[id]);

										for (var key in redef) {
											lang[key] = redef[key];
										}

										return lang;
									},

									/**
									 * Inserts tokens _before_ another token in a language definition or any other grammar.
									 *
									 * ## Usage
									 *
									 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
									 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
									 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
									 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
									 * this:
									 *
									 * ```js
									 * Prism.languages.markup.style = {
									 *     // token
									 * };
									 * ```
									 *
									 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
									 * before existing tokens. For the CSS example above, you would use it like this:
									 *
									 * ```js
									 * Prism.languages.insertBefore('markup', 'cdata', {
									 *     'style': {
									 *         // token
									 *     }
									 * });
									 * ```
									 *
									 * ## Special cases
									 *
									 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
									 * will be ignored.
									 *
									 * This behavior can be used to insert tokens after `before`:
									 *
									 * ```js
									 * Prism.languages.insertBefore('markup', 'comment', {
									 *     'comment': Prism.languages.markup.comment,
									 *     // tokens after 'comment'
									 * });
									 * ```
									 *
									 * ## Limitations
									 *
									 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
									 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
									 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
									 * deleting properties which is necessary to insert at arbitrary positions.
									 *
									 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
									 * Instead, it will create a new object and replace all references to the target object with the new one. This
									 * can be done without temporarily deleting properties, so the iteration order is well-defined.
									 *
									 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
									 * you hold the target object in a variable, then the value of the variable will not change.
									 *
									 * ```js
									 * var oldMarkup = Prism.languages.markup;
									 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
									 *
									 * assert(oldMarkup !== Prism.languages.markup);
									 * assert(newMarkup === Prism.languages.markup);
									 * ```
									 *
									 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
									 * object to be modified.
									 * @param {string} before The key to insert before.
									 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
									 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
									 * object to be modified.
									 *
									 * Defaults to `Prism.languages`.
									 * @returns {Grammar} The new grammar object.
									 * @public
									 */
									insertBefore: function (inside, before, insert, root) {
										root = root || /** @type {any} */ (_.languages);
										var grammar = root[inside];
										/** @type {Grammar} */
										var ret = {};

										for (var token in grammar) {
											if (grammar.hasOwnProperty(token)) {

												if (token == before) {
													for (var newToken in insert) {
														if (insert.hasOwnProperty(newToken)) {
															ret[newToken] = insert[newToken];
														}
													}
												}

												// Do not insert token which also occur in insert. See #1525
												if (!insert.hasOwnProperty(token)) {
													ret[token] = grammar[token];
												}
											}
										}

										var old = root[inside];
										root[inside] = ret;

										// Update references in other language definitions
										_.languages.DFS(_.languages, function (key, value) {
											if (value === old && key != inside) {
												this[key] = ret;
											}
										});

										return ret;
									},

									// Traverse a language definition with Depth First Search
									DFS: function DFS(o, callback, type, visited) {
										visited = visited || {};

										var objId = _.util.objId;

										for (var i in o) {
											if (o.hasOwnProperty(i)) {
												callback.call(o, i, o[i], type || i);

												var property = o[i],
													propertyType = _.util.type(property);

												if (propertyType === 'Object' && !visited[objId(property)]) {
													visited[objId(property)] = true;
													DFS(property, callback, null, visited);
												}
												else if (propertyType === 'Array' && !visited[objId(property)]) {
													visited[objId(property)] = true;
													DFS(property, callback, i, visited);
												}
											}
										}
									}
								},

								plugins: {},

								/**
								 * This is the most high-level function in Prism’s API.
								 * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
								 * each one of them.
								 *
								 * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
								 *
								 * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
								 * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
								 * @memberof Prism
								 * @public
								 */
								highlightAll: function (async, callback) {
									_.highlightAllUnder(document, async, callback);
								},

								/**
								 * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
								 * {@link Prism.highlightElement} on each one of them.
								 *
								 * The following hooks will be run:
								 * 1. `before-highlightall`
								 * 2. `before-all-elements-highlight`
								 * 3. All hooks of {@link Prism.highlightElement} for each element.
								 *
								 * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
								 * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
								 * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
								 * @memberof Prism
								 * @public
								 */
								highlightAllUnder: function (container, async, callback) {
									var env = {
										callback: callback,
										container: container,
										selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
									};

									_.hooks.run('before-highlightall', env);

									env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

									_.hooks.run('before-all-elements-highlight', env);

									for (var i = 0, element; element = env.elements[i++];) {
										_.highlightElement(element, async === true, env.callback);
									}
								},

								/**
								 * Highlights the code inside a single element.
								 *
								 * The following hooks will be run:
								 * 1. `before-sanity-check`
								 * 2. `before-highlight`
								 * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
								 * 4. `before-insert`
								 * 5. `after-highlight`
								 * 6. `complete`
								 *
								 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
								 * the element's language.
								 *
								 * @param {Element} element The element containing the code.
								 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
								 * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
								 * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
								 * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
								 *
								 * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
								 * asynchronous highlighting to work. You can build your own bundle on the
								 * [Download page](https://prismjs.com/download.html).
								 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
								 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
								 * @memberof Prism
								 * @public
								 */
								highlightElement: function (element, async, callback) {
									// Find language
									var language = _.util.getLanguage(element);
									var grammar = _.languages[language];

									// Set language on the element, if not present
									element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

									// Set language on the parent, for styling
									var parent = element.parentElement;
									if (parent && parent.nodeName.toLowerCase() === 'pre') {
										parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
									}

									var code = element.textContent;

									var env = {
										element: element,
										language: language,
										grammar: grammar,
										code: code
									};

									function insertHighlightedCode(highlightedCode) {
										env.highlightedCode = highlightedCode;

										_.hooks.run('before-insert', env);

										env.element.innerHTML = env.highlightedCode;

										_.hooks.run('after-highlight', env);
										_.hooks.run('complete', env);
										callback && callback.call(env.element);
									}

									_.hooks.run('before-sanity-check', env);

									if (!env.code) {
										_.hooks.run('complete', env);
										callback && callback.call(env.element);
										return;
									}

									_.hooks.run('before-highlight', env);

									if (!env.grammar) {
										insertHighlightedCode(_.util.encode(env.code));
										return;
									}

									if (async && _self.Worker) {
										var worker = new Worker(_.filename);

										worker.onmessage = function (evt) {
											insertHighlightedCode(evt.data);
										};

										worker.postMessage(JSON.stringify({
											language: env.language,
											code: env.code,
											immediateClose: true
										}));
									}
									else {
										insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
									}
								},

								/**
								 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
								 * and the language definitions to use, and returns a string with the HTML produced.
								 *
								 * The following hooks will be run:
								 * 1. `before-tokenize`
								 * 2. `after-tokenize`
								 * 3. `wrap`: On each {@link Token}.
								 *
								 * @param {string} text A string with the code to be highlighted.
								 * @param {Grammar} grammar An object containing the tokens to use.
								 *
								 * Usually a language definition like `Prism.languages.markup`.
								 * @param {string} language The name of the language definition passed to `grammar`.
								 * @returns {string} The highlighted HTML.
								 * @memberof Prism
								 * @public
								 * @example
								 * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
								 */
								highlight: function (text, grammar, language) {
									var env = {
										code: text,
										grammar: grammar,
										language: language
									};
									_.hooks.run('before-tokenize', env);
									env.tokens = _.tokenize(env.code, env.grammar);
									_.hooks.run('after-tokenize', env);
									return Token.stringify(_.util.encode(env.tokens), env.language);
								},

								/**
								 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
								 * and the language definitions to use, and returns an array with the tokenized code.
								 *
								 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
								 *
								 * This method could be useful in other contexts as well, as a very crude parser.
								 *
								 * @param {string} text A string with the code to be highlighted.
								 * @param {Grammar} grammar An object containing the tokens to use.
								 *
								 * Usually a language definition like `Prism.languages.markup`.
								 * @returns {TokenStream} An array of strings and tokens, a token stream.
								 * @memberof Prism
								 * @public
								 * @example
								 * let code = `var foo = 0;`;
								 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
								 * tokens.forEach(token => {
								 *     if (token instanceof Prism.Token && token.type === 'number') {
								 *         console.log(`Found numeric literal: ${token.content}`);
								 *     }
								 * });
								 */
								tokenize: function (text, grammar) {
									var rest = grammar.rest;
									if (rest) {
										for (var token in rest) {
											grammar[token] = rest[token];
										}

										delete grammar.rest;
									}

									var tokenList = new LinkedList();
									addAfter(tokenList, tokenList.head, text);

									matchGrammar(text, tokenList, grammar, tokenList.head, 0);

									return toArray(tokenList);
								},

								/**
								 * @namespace
								 * @memberof Prism
								 * @public
								 */
								hooks: {
									all: {},

									/**
									 * Adds the given callback to the list of callbacks for the given hook.
									 *
									 * The callback will be invoked when the hook it is registered for is run.
									 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
									 *
									 * One callback function can be registered to multiple hooks and the same hook multiple times.
									 *
									 * @param {string} name The name of the hook.
									 * @param {HookCallback} callback The callback function which is given environment variables.
									 * @public
									 */
									add: function (name, callback) {
										var hooks = _.hooks.all;

										hooks[name] = hooks[name] || [];

										hooks[name].push(callback);
									},

									/**
									 * Runs a hook invoking all registered callbacks with the given environment variables.
									 *
									 * Callbacks will be invoked synchronously and in the order in which they were registered.
									 *
									 * @param {string} name The name of the hook.
									 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
									 * @public
									 */
									run: function (name, env) {
										var callbacks = _.hooks.all[name];

										if (!callbacks || !callbacks.length) {
											return;
										}

										for (var i = 0, callback; callback = callbacks[i++];) {
											callback(env);
										}
									}
								},

								Token: Token
							};
							_self.Prism = _;


							// Typescript note:
							// The following can be used to import the Token type in JSDoc:
							//
							//   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

							/**
							 * Creates a new token.
							 *
							 * @param {string} type See {@link Token#type type}
							 * @param {string | TokenStream} content See {@link Token#content content}
							 * @param {string|string[]} [alias] The alias(es) of the token.
							 * @param {string} [matchedStr=""] A copy of the full string this token was created from.
							 * @class
							 * @global
							 * @public
							 */
							function Token(type, content, alias, matchedStr) {
								/**
								 * The type of the token.
								 *
								 * This is usually the key of a pattern in a {@link Grammar}.
								 *
								 * @type {string}
								 * @see GrammarToken
								 * @public
								 */
								this.type = type;
								/**
								 * The strings or tokens contained by this token.
								 *
								 * This will be a token stream if the pattern matched also defined an `inside` grammar.
								 *
								 * @type {string | TokenStream}
								 * @public
								 */
								this.content = content;
								/**
								 * The alias(es) of the token.
								 *
								 * @type {string|string[]}
								 * @see GrammarToken
								 * @public
								 */
								this.alias = alias;
								// Copy of the full string this token was created from
								this.length = (matchedStr || '').length | 0;
							}

							/**
							 * A token stream is an array of strings and {@link Token Token} objects.
							 *
							 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
							 * them.
							 *
							 * 1. No adjacent strings.
							 * 2. No empty strings.
							 *
							 *    The only exception here is the token stream that only contains the empty string and nothing else.
							 *
							 * @typedef {Array<string | Token>} TokenStream
							 * @global
							 * @public
							 */

							/**
							 * Converts the given token or token stream to an HTML representation.
							 *
							 * The following hooks will be run:
							 * 1. `wrap`: On each {@link Token}.
							 *
							 * @param {string | Token | TokenStream} o The token or token stream to be converted.
							 * @param {string} language The name of current language.
							 * @returns {string} The HTML representation of the token or token stream.
							 * @memberof Token
							 * @static
							 */
							Token.stringify = function stringify(o, language) {
								if (typeof o == 'string') {
									return o;
								}
								if (Array.isArray(o)) {
									var s = '';
									o.forEach(function (e) {
										s += stringify(e, language);
									});
									return s;
								}

								var env = {
									type: o.type,
									content: stringify(o.content, language),
									tag: 'span',
									classes: ['token', o.type],
									attributes: {},
									language: language
								};

								var aliases = o.alias;
								if (aliases) {
									if (Array.isArray(aliases)) {
										Array.prototype.push.apply(env.classes, aliases);
									} else {
										env.classes.push(aliases);
									}
								}

								_.hooks.run('wrap', env);

								var attributes = '';
								for (var name in env.attributes) {
									attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
								}

								return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
							};

							/**
							 * @param {string} text
							 * @param {LinkedList<string | Token>} tokenList
							 * @param {any} grammar
							 * @param {LinkedListNode<string | Token>} startNode
							 * @param {number} startPos
							 * @param {RematchOptions} [rematch]
							 * @returns {void}
							 * @private
							 *
							 * @typedef RematchOptions
							 * @property {string} cause
							 * @property {number} reach
							 */
							function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
								for (var token in grammar) {
									if (!grammar.hasOwnProperty(token) || !grammar[token]) {
										continue;
									}

									var patterns = grammar[token];
									patterns = Array.isArray(patterns) ? patterns : [patterns];

									for (var j = 0; j < patterns.length; ++j) {
										if (rematch && rematch.cause == token + ',' + j) {
											return;
										}

										var patternObj = patterns[j],
											inside = patternObj.inside,
											lookbehind = !!patternObj.lookbehind,
											greedy = !!patternObj.greedy,
											lookbehindLength = 0,
											alias = patternObj.alias;

										if (greedy && !patternObj.pattern.global) {
											// Without the global flag, lastIndex won't work
											var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
											patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
										}

										/** @type {RegExp} */
										var pattern = patternObj.pattern || patternObj;

										for ( // iterate the token list and keep track of the current token/string position
											var currentNode = startNode.next, pos = startPos;
											currentNode !== tokenList.tail;
											pos += currentNode.value.length, currentNode = currentNode.next
										) {

											if (rematch && pos >= rematch.reach) {
												break;
											}

											var str = currentNode.value;

											if (tokenList.length > text.length) {
												// Something went terribly wrong, ABORT, ABORT!
												return;
											}

											if (str instanceof Token) {
												continue;
											}

											var removeCount = 1; // this is the to parameter of removeBetween

											if (greedy && currentNode != tokenList.tail.prev) {
												pattern.lastIndex = pos;
												var match = pattern.exec(text);
												if (!match) {
													break;
												}

												var from = match.index + (lookbehind && match[1] ? match[1].length : 0);
												var to = match.index + match[0].length;
												var p = pos;

												// find the node that contains the match
												p += currentNode.value.length;
												while (from >= p) {
													currentNode = currentNode.next;
													p += currentNode.value.length;
												}
												// adjust pos (and p)
												p -= currentNode.value.length;
												pos = p;

												// the current node is a Token, then the match starts inside another Token, which is invalid
												if (currentNode.value instanceof Token) {
													continue;
												}

												// find the last node which is affected by this match
												for (
													var k = currentNode;
													k !== tokenList.tail && (p < to || typeof k.value === 'string');
													k = k.next
												) {
													removeCount++;
													p += k.value.length;
												}
												removeCount--;

												// replace with the new match
												str = text.slice(pos, p);
												match.index -= pos;
											} else {
												pattern.lastIndex = 0;

												var match = pattern.exec(str);
											}

											if (!match) {
												continue;
											}

											if (lookbehind) {
												lookbehindLength = match[1] ? match[1].length : 0;
											}

											var from = match.index + lookbehindLength,
												matchStr = match[0].slice(lookbehindLength),
												to = from + matchStr.length,
												before = str.slice(0, from),
												after = str.slice(to);

											var reach = pos + str.length;
											if (rematch && reach > rematch.reach) {
												rematch.reach = reach;
											}

											var removeFrom = currentNode.prev;

											if (before) {
												removeFrom = addAfter(tokenList, removeFrom, before);
												pos += before.length;
											}

											removeRange(tokenList, removeFrom, removeCount);

											var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
											currentNode = addAfter(tokenList, removeFrom, wrapped);

											if (after) {
												addAfter(tokenList, currentNode, after);
											}

											if (removeCount > 1) {
												// at least one Token object was removed, so we have to do some rematching
												// this can only happen if the current pattern is greedy
												matchGrammar(text, tokenList, grammar, currentNode.prev, pos, {
													cause: token + ',' + j,
													reach: reach
												});
											}
										}
									}
								}
							}

							/**
							 * @typedef LinkedListNode
							 * @property {T} value
							 * @property {LinkedListNode<T> | null} prev The previous node.
							 * @property {LinkedListNode<T> | null} next The next node.
							 * @template T
							 * @private
							 */

							/**
							 * @template T
							 * @private
							 */
							function LinkedList() {
								/** @type {LinkedListNode<T>} */
								var head = { value: null, prev: null, next: null };
								/** @type {LinkedListNode<T>} */
								var tail = { value: null, prev: head, next: null };
								head.next = tail;

								/** @type {LinkedListNode<T>} */
								this.head = head;
								/** @type {LinkedListNode<T>} */
								this.tail = tail;
								this.length = 0;
							}

							/**
							 * Adds a new node with the given value to the list.
							 * @param {LinkedList<T>} list
							 * @param {LinkedListNode<T>} node
							 * @param {T} value
							 * @returns {LinkedListNode<T>} The added node.
							 * @template T
							 */
							function addAfter(list, node, value) {
								// assumes that node != list.tail && values.length >= 0
								var next = node.next;

								var newNode = { value: value, prev: node, next: next };
								node.next = newNode;
								next.prev = newNode;
								list.length++;

								return newNode;
							}
							/**
							 * Removes `count` nodes after the given node. The given node will not be removed.
							 * @param {LinkedList<T>} list
							 * @param {LinkedListNode<T>} node
							 * @param {number} count
							 * @template T
							 */
							function removeRange(list, node, count) {
								var next = node.next;
								for (var i = 0; i < count && next !== list.tail; i++) {
									next = next.next;
								}
								node.next = next;
								next.prev = node;
								list.length -= i;
							}
							/**
							 * @param {LinkedList<T>} list
							 * @returns {T[]}
							 * @template T
							 */
							function toArray(list) {
								var array = [];
								var node = list.head.next;
								while (node !== list.tail) {
									array.push(node.value);
									node = node.next;
								}
								return array;
							}


							if (!_self.document) {
								if (!_self.addEventListener) {
									// in Node.js
									return _;
								}

								if (!_.disableWorkerMessageHandler) {
									// In worker
									_self.addEventListener('message', function (evt) {
										var message = JSON.parse(evt.data),
											lang = message.language,
											code = message.code,
											immediateClose = message.immediateClose;

										_self.postMessage(_.highlight(code, _.languages[lang], lang));
										if (immediateClose) {
											_self.close();
										}
									}, false);
								}

								return _;
							}

							// Get current script and highlight
							var script = _.util.currentScript();

							if (script) {
								_.filename = script.src;

								if (script.hasAttribute('data-manual')) {
									_.manual = true;
								}
							}

							function highlightAutomaticallyCallback() {
								if (!_.manual) {
									_.highlightAll();
								}
							}

							if (!_.manual) {
								// If the document state is "loading", then we'll use DOMContentLoaded.
								// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
								// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
								// might take longer one animation frame to execute which can create a race condition where only some plugins have
								// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
								// See https://github.com/PrismJS/prism/issues/2102
								var readyState = document.readyState;
								if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
									document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
								} else {
									if (window.requestAnimationFrame) {
										window.requestAnimationFrame(highlightAutomaticallyCallback);
									} else {
										window.setTimeout(highlightAutomaticallyCallback, 16);
									}
								}
							}

							return _;

						})(_self);

						if (typeof module !== 'undefined' && module.exports) {
							module.exports = Prism;
						}

						// hack for components to work correctly in node.js
						if (typeof global !== 'undefined') {
							global.Prism = Prism;
						}

						// some additional documentation/types

						/**
						 * The expansion of a simple `RegExp` literal to support additional properties.
						 *
						 * @typedef GrammarToken
						 * @property {RegExp} pattern The regular expression of the token.
						 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
						 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
						 * @property {boolean} [greedy=false] Whether the token is greedy.
						 * @property {string|string[]} [alias] An optional alias or list of aliases.
						 * @property {Grammar} [inside] The nested grammar of this token.
						 *
						 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
						 *
						 * This can be used to make nested and even recursive language definitions.
						 *
						 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
						 * each another.
						 * @global
						 * @public
						*/

						/**
						 * @typedef Grammar
						 * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
						 * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
						 * @global
						 * @public
						 */

						/**
						 * A function which will invoked after an element was successfully highlighted.
						 *
						 * @callback HighlightCallback
						 * @param {Element} element The element successfully highlighted.
						 * @returns {void}
						 * @global
						 * @public
						*/

						/**
						 * @callback HookCallback
						 * @param {Object<string, any>} env The environment variables of the hook.
						 * @returns {void}
						 * @global
						 * @public
						 */

					}).call(this)
				}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
			}, {}], 4: [function (require, module, exports) {
				(function (Prism) {

					var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;

					Prism.languages.cpp = Prism.languages.extend('c', {
						'class-name': [
							{
								pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source
									.replace(/<keyword>/g, function () { return keyword.source; })),
								lookbehind: true
							},
							// This is intended to capture the class name of method implementations like:
							//   void foo::bar() const {}
							// However! The `foo` in the above example could also be a namespace, so we only capture the class name if
							// it starts with an uppercase letter. This approximation should give decent results.
							/\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
							// This will capture the class name before destructors like:
							//   Foo::~Foo() {}
							/\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
							// This also intends to capture the class name of method implementations but here the class has template
							// parameters, so it can't be a namespace (until C++ adds generic namespaces).
							/\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
						],
						'keyword': keyword,
						'number': {
							pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+\.?[\da-f']*|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+\.?[\d']*|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]*/i,
							greedy: true
						},
						'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
						'boolean': /\b(?:true|false)\b/
					});

					Prism.languages.insertBefore('cpp', 'string', {
						'raw-string': {
							pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
							alias: 'string',
							greedy: true
						}
					});

					Prism.languages.insertBefore('cpp', 'class-name', {
						// the base clause is an optional list of parent classes
						// https://en.cppreference.com/w/cpp/language/class
						'base-clause': {
							pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)(?:[^;{}"'])+?(?=\s*[;{])/,
							lookbehind: true,
							greedy: true,
							inside: Prism.languages.extend('cpp', {})
						}
					});
					Prism.languages.insertBefore('inside', 'operator', {
						// All untokenized words that are not namespaces should be class names
						'class-name': /\b[a-z_]\w*\b(?!\s*::)/i
					}, Prism.languages.cpp['base-clause']);

				}(Prism));

			}, {}], 5: [function (require, module, exports) {
				(function (Prism) {

					/**
					 * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
					 *
					 * Note: This is a simple text based replacement. Be careful when using backreferences!
					 *
					 * @param {string} pattern the given pattern.
					 * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
					 * @returns {string} the pattern with all placeholders replaced with their corresponding replacements.
					 * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
					 */
					function replace(pattern, replacements) {
						return pattern.replace(/<<(\d+)>>/g, function (m, index) {
							return '(?:' + replacements[+index] + ')';
						});
					}
					/**
					 * @param {string} pattern
					 * @param {string[]} replacements
					 * @param {string} [flags]
					 * @returns {RegExp}
					 */
					function re(pattern, replacements, flags) {
						return RegExp(replace(pattern, replacements), flags || '');
					}

					/**
					 * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
					 *
					 * @param {string} pattern
					 * @param {number} depthLog2
					 * @returns {string}
					 */
					function nested(pattern, depthLog2) {
						for (var i = 0; i < depthLog2; i++) {
							pattern = pattern.replace(/<<self>>/g, function () { return '(?:' + pattern + ')'; });
						}
						return pattern.replace(/<<self>>/g, '[^\\s\\S]');
					}

					// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
					var keywordKinds = {
						// keywords which represent a return or variable type
						type: 'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
						// keywords which are used to declare a type
						typeDeclaration: 'class enum interface struct',
						// contextual keywords
						// ("var" and "dynamic" are missing because they are used like types)
						contextual: 'add alias and ascending async await by descending from get global group into join let nameof not notnull on or orderby partial remove select set unmanaged value when where where',
						// all other keywords
						other: 'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield'
					};

					// keywords
					function keywordsToPattern(words) {
						return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
					}
					var typeDeclarationKeywords = keywordsToPattern(keywordKinds.typeDeclaration);
					var keywords = RegExp(keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other));
					var nonTypeKeywords = keywordsToPattern(keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other);
					var nonContextualKeywords = keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.other);

					// types
					var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2); // the idea behind the other forbidden characters is to prevent false positives. Same for tupleElement.
					var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
					var name = /@?\b[A-Za-z_]\w*\b/.source;
					var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
					var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [nonTypeKeywords, genericName]);
					var array = /\[\s*(?:,\s*)*\]/.source;
					var typeExpressionWithoutTuple = replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [identifier, array]);
					var tupleElement = replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [generic, nestedRound, array])
					var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
					var typeExpression = replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [tuple, identifier, array]);

					var typeInside = {
						'keyword': keywords,
						'punctuation': /[<>()?,.:[\]]/
					};

					// strings & characters
					// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#character-literals
					// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#string-literals
					var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source; // simplified pattern
					var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
					var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;


					Prism.languages.csharp = Prism.languages.extend('clike', {
						'string': [
							{
								pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
								lookbehind: true,
								greedy: true
							},
							{
								pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
								lookbehind: true,
								greedy: true
							},
							{
								pattern: RegExp(character),
								greedy: true,
								alias: 'character'
							}
						],
						'class-name': [
							{
								// Using static
								// using static System.Math;
								pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [identifier]),
								lookbehind: true,
								inside: typeInside
							},
							{
								// Using alias (type)
								// using Project = PC.MyCompany.Project;
								pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [name, typeExpression]),
								lookbehind: true,
								inside: typeInside
							},
							{
								// Using alias (alias)
								// using Project = PC.MyCompany.Project;
								pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
								lookbehind: true
							},
							{
								// Type declarations
								// class Foo<A, B>
								// interface Foo<out A, B>
								pattern: re(/(\b<<0>>\s+)<<1>>/.source, [typeDeclarationKeywords, genericName]),
								lookbehind: true,
								inside: typeInside
							},
							{
								// Single catch exception declaration
								// catch(Foo)
								// (things like catch(Foo e) is covered by variable declaration)
								pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
								lookbehind: true,
								inside: typeInside
							},
							{
								// Name of the type parameter of generic constraints
								// where Foo : class
								pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
								lookbehind: true
							},
							{
								// Casts and checks via as and is.
								// as Foo<A>, is Bar<B>
								// (things like if(a is Foo b) is covered by variable declaration)
								pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [typeExpressionWithoutTuple]),
								lookbehind: true,
								inside: typeInside
							},
							{
								// Variable, field and parameter declaration
								// (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
								pattern: re(/\b<<0>>(?=\s+(?!<<1>>)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [typeExpression, nonContextualKeywords, name]),
								inside: typeInside
							}
						],
						'keyword': keywords,
						// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
						'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:ul|lu|[dflmu])?\b/i,
						'operator': />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
						'punctuation': /\?\.?|::|[{}[\];(),.:]/
					});

					Prism.languages.insertBefore('csharp', 'number', {
						'range': {
							pattern: /\.\./,
							alias: 'operator'
						}
					});

					Prism.languages.insertBefore('csharp', 'punctuation', {
						'named-parameter': {
							pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
							lookbehind: true,
							alias: 'punctuation'
						}
					});

					Prism.languages.insertBefore('csharp', 'class-name', {
						'namespace': {
							// namespace Foo.Bar {}
							// using Foo.Bar;
							pattern: re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [name]),
							lookbehind: true,
							inside: {
								'punctuation': /\./
							}
						},
						'type-expression': {
							// default(Foo), typeof(Foo<Bar>), sizeof(int)
							pattern: re(/(\b(?:default|typeof|sizeof)\s*\(\s*)(?:[^()\s]|\s(?!\s*\))|<<0>>)*(?=\s*\))/.source, [nestedRound]),
							lookbehind: true,
							alias: 'class-name',
							inside: typeInside
						},
						'return-type': {
							// Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
							// int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
							// int Foo => 0; int Foo { get; set } = 0;
							pattern: re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [typeExpression, identifier]),
							inside: typeInside,
							alias: 'class-name'
						},
						'constructor-invocation': {
							// new List<Foo<Bar[]>> { }
							pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
							lookbehind: true,
							inside: typeInside,
							alias: 'class-name'
						},
						/*'explicit-implementation': {
							// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
							pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
							inside: classNameInside,
							alias: 'class-name'
						},*/
						'generic-method': {
							// foo<Bar>()
							pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
							inside: {
								'function': re(/^<<0>>/.source, [name]),
								'generic': {
									pattern: RegExp(generic),
									alias: 'class-name',
									inside: typeInside
								}
							}
						},
						'type-list': {
							// The list of types inherited or of generic constraints
							// class Foo<F> : Bar, IList<FooBar>
							// where F : Bar, IList<int>
							pattern: re(
								/\b((?:<<0>>\s+<<1>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>)(?:\s*,\s*(?:<<3>>|<<4>>))*(?=\s*(?:where|[{;]|=>|$))/.source,
								[typeDeclarationKeywords, genericName, name, typeExpression, keywords.source]
							),
							lookbehind: true,
							inside: {
								'keyword': keywords,
								'class-name': {
									pattern: RegExp(typeExpression),
									greedy: true,
									inside: typeInside
								},
								'punctuation': /,/
							}
						},
						'preprocessor': {
							pattern: /(^\s*)#.*/m,
							lookbehind: true,
							alias: 'property',
							inside: {
								// highlight preprocessor directives as keywords
								'directive': {
									pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
									lookbehind: true,
									alias: 'keyword'
								}
							}
						}
					});

					// attributes
					var regularStringOrCharacter = regularString + '|' + character;
					var regularStringCharacterOrComment = replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [regularStringOrCharacter]);
					var roundExpression = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);

					// https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/#attribute-targets
					var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source;
					var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [identifier, roundExpression]);

					Prism.languages.insertBefore('csharp', 'class-name', {
						'attribute': {
							// Attributes
							// [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
							pattern: re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [attrTarget, attr]),
							lookbehind: true,
							greedy: true,
							inside: {
								'target': {
									pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
									alias: 'keyword'
								},
								'attribute-arguments': {
									pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
									inside: Prism.languages.csharp
								},
								'class-name': {
									pattern: RegExp(identifier),
									inside: {
										'punctuation': /\./
									}
								},
								'punctuation': /[:,]/
							}
						}
					});


					// string interpolation
					var formatString = /:[^}\r\n]+/.source;
					// multi line
					var mInterpolationRound = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2)
					var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [mInterpolationRound, formatString]);
					// single line
					var sInterpolationRound = nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [regularStringOrCharacter]), 2)
					var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [sInterpolationRound, formatString]);

					function createInterpolationInside(interpolation, interpolationRound) {
						return {
							'interpolation': {
								pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
								lookbehind: true,
								inside: {
									'format-string': {
										pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [interpolationRound, formatString]),
										lookbehind: true,
										inside: {
											'punctuation': /^:/
										}
									},
									'punctuation': /^\{|\}$/,
									'expression': {
										pattern: /[\s\S]+/,
										alias: 'language-csharp',
										inside: Prism.languages.csharp
									}
								}
							},
							'string': /[\s\S]+/
						};
					}

					Prism.languages.insertBefore('csharp', 'string', {
						'interpolation-string': [
							{
								pattern: re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [mInterpolation]),
								lookbehind: true,
								greedy: true,
								inside: createInterpolationInside(mInterpolation, mInterpolationRound),
							},
							{
								pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [sInterpolation]),
								lookbehind: true,
								greedy: true,
								inside: createInterpolationInside(sInterpolation, sInterpolationRound),
							}
						]
					});

				}(Prism));

				Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;

			}, {}], 6: [function (require, module, exports) {
				(function (Prism) {

					var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

					Prism.languages.css = {
						'comment': /\/\*[\s\S]*?\*\//,
						'atrule': {
							pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
							inside: {
								'rule': /^@[\w-]+/,
								'selector-function-argument': {
									pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
									lookbehind: true,
									alias: 'selector'
								},
								'keyword': {
									pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
									lookbehind: true
								}
								// See rest below
							}
						},
						'url': {
							// https://drafts.csswg.org/css-values-3/#urls
							pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
							greedy: true,
							inside: {
								'function': /^url/i,
								'punctuation': /^\(|\)$/,
								'string': {
									pattern: RegExp('^' + string.source + '$'),
									alias: 'url'
								}
							}
						},
						'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
						'string': {
							pattern: string,
							greedy: true
						},
						'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
						'important': /!important\b/i,
						'function': /[-a-z0-9]+(?=\()/i,
						'punctuation': /[(){};:,]/
					};

					Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

					var markup = Prism.languages.markup;
					if (markup) {
						markup.tag.addInlined('style', 'css');

						Prism.languages.insertBefore('inside', 'attr-value', {
							'style-attr': {
								pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
								inside: {
									'attr-name': {
										pattern: /^\s*style/i,
										inside: markup.tag.inside
									},
									'punctuation': /^\s*=\s*['"]|['"]\s*$/,
									'attr-value': {
										pattern: /.+/i,
										inside: Prism.languages.css
									}
								},
								alias: 'language-css'
							}
						}, markup.tag);
					}

				}(Prism));

			}, {}], 7: [function (require, module, exports) {
				(function (Prism) {

					var keywords = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|null|open|opens|package|private|protected|provides|public|record|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/;

					// based on the java naming conventions
					var className = /\b[A-Z](?:\w*[a-z]\w*)?\b/;

					Prism.languages.java = Prism.languages.extend('clike', {
						'class-name': [
							className,

							// variables and parameters
							// this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
							/\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/
						],
						'keyword': keywords,
						'function': [
							Prism.languages.clike.function,
							{
								pattern: /(\:\:)[a-z_]\w*/,
								lookbehind: true
							}
						],
						'number': /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
						'operator': {
							pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
							lookbehind: true
						}
					});

					Prism.languages.insertBefore('java', 'string', {
						'triple-quoted-string': {
							// http://openjdk.java.net/jeps/355#Description
							pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
							greedy: true,
							alias: 'string'
						}
					});

					Prism.languages.insertBefore('java', 'class-name', {
						'annotation': {
							alias: 'punctuation',
							pattern: /(^|[^.])@\w+/,
							lookbehind: true
						},
						'namespace': {
							pattern: RegExp(
								/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/
									.source.replace(/<keyword>/g, function () { return keywords.source; })),
							lookbehind: true,
							inside: {
								'punctuation': /\./,
							}
						},
						'generics': {
							pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
							inside: {
								'class-name': className,
								'keyword': keywords,
								'punctuation': /[<>(),.:]/,
								'operator': /[?&|]/
							}
						}
					});
				}(Prism));

			}, {}], 8: [function (require, module, exports) {
				Prism.languages.javascript = Prism.languages.extend('clike', {
					'class-name': [
						Prism.languages.clike['class-name'],
						{
							pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
							lookbehind: true
						}
					],
					'keyword': [
						{
							pattern: /((?:^|})\s*)(?:catch|finally)\b/,
							lookbehind: true
						},
						{
							pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
							lookbehind: true
						},
					],
					'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
					// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
					'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
					'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
				});

				Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

				Prism.languages.insertBefore('javascript', 'keyword', {
					'regex': {
						pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
						lookbehind: true,
						greedy: true,
						inside: {
							'regex-source': {
								pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
								lookbehind: true,
								alias: 'language-regex',
								inside: Prism.languages.regex
							},
							'regex-flags': /[a-z]+$/,
							'regex-delimiter': /^\/|\/$/
						}
					},
					// This must be declared before keyword because we use "function" inside the look-forward
					'function-variable': {
						pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
						alias: 'function'
					},
					'parameter': [
						{
							pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
							lookbehind: true,
							inside: Prism.languages.javascript
						},
						{
							pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
							inside: Prism.languages.javascript
						},
						{
							pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
							lookbehind: true,
							inside: Prism.languages.javascript
						},
						{
							pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
							lookbehind: true,
							inside: Prism.languages.javascript
						}
					],
					'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
				});

				Prism.languages.insertBefore('javascript', 'string', {
					'template-string': {
						pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
						greedy: true,
						inside: {
							'template-punctuation': {
								pattern: /^`|`$/,
								alias: 'string'
							},
							'interpolation': {
								pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
								lookbehind: true,
								inside: {
									'interpolation-punctuation': {
										pattern: /^\${|}$/,
										alias: 'punctuation'
									},
									rest: Prism.languages.javascript
								}
							},
							'string': /[\s\S]+/
						}
					}
				});

				if (Prism.languages.markup) {
					Prism.languages.markup.tag.addInlined('script', 'javascript');
				}

				Prism.languages.js = Prism.languages.javascript;

			}, {}], 9: [function (require, module, exports) {
				(function (Prism) {

					/**
					 * Returns the placeholder for the given language id and index.
					 *
					 * @param {string} language
					 * @param {string|number} index
					 * @returns {string}
					 */
					function getPlaceholder(language, index) {
						return '___' + language.toUpperCase() + index + '___';
					}

					Object.defineProperties(Prism.languages['markup-templating'] = {}, {
						buildPlaceholders: {
							/**
							 * Tokenize all inline templating expressions matching `placeholderPattern`.
							 *
							 * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
							 * `true` will be replaced.
							 *
							 * @param {object} env The environment of the `before-tokenize` hook.
							 * @param {string} language The language id.
							 * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
							 * @param {(match: string) => boolean} [replaceFilter]
							 */
							value: function (env, language, placeholderPattern, replaceFilter) {
								if (env.language !== language) {
									return;
								}

								var tokenStack = env.tokenStack = [];

								env.code = env.code.replace(placeholderPattern, function (match) {
									if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
										return match;
									}
									var i = tokenStack.length;
									var placeholder;

									// Check for existing strings
									while (env.code.indexOf(placeholder = getPlaceholder(language, i)) !== -1)
										++i;

									// Create a sparse array
									tokenStack[i] = match;

									return placeholder;
								});

								// Switch the grammar to markup
								env.grammar = Prism.languages.markup;
							}
						},
						tokenizePlaceholders: {
							/**
							 * Replace placeholders with proper tokens after tokenizing.
							 *
							 * @param {object} env The environment of the `after-tokenize` hook.
							 * @param {string} language The language id.
							 */
							value: function (env, language) {
								if (env.language !== language || !env.tokenStack) {
									return;
								}

								// Switch the grammar back
								env.grammar = Prism.languages[language];

								var j = 0;
								var keys = Object.keys(env.tokenStack);

								function walkTokens(tokens) {
									for (var i = 0; i < tokens.length; i++) {
										// all placeholders are replaced already
										if (j >= keys.length) {
											break;
										}

										var token = tokens[i];
										if (typeof token === 'string' || (token.content && typeof token.content === 'string')) {
											var k = keys[j];
											var t = env.tokenStack[k];
											var s = typeof token === 'string' ? token : token.content;
											var placeholder = getPlaceholder(language, k);

											var index = s.indexOf(placeholder);
											if (index > -1) {
												++j;

												var before = s.substring(0, index);
												var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar), 'language-' + language, t);
												var after = s.substring(index + placeholder.length);

												var replacement = [];
												if (before) {
													replacement.push.apply(replacement, walkTokens([before]));
												}
												replacement.push(middle);
												if (after) {
													replacement.push.apply(replacement, walkTokens([after]));
												}

												if (typeof token === 'string') {
													tokens.splice.apply(tokens, [i, 1].concat(replacement));
												} else {
													token.content = replacement;
												}
											}
										} else if (token.content /* && typeof token.content !== 'string' */) {
											walkTokens(token.content);
										}
									}

									return tokens;
								}

								walkTokens(env.tokens);
							}
						}
					});

				}(Prism));

			}, {}], 10: [function (require, module, exports) {
				Prism.languages.markup = {
					'comment': /<!--[\s\S]*?-->/,
					'prolog': /<\?[\s\S]+?\?>/,
					'doctype': {
						// https://www.w3.org/TR/xml/#NT-doctypedecl
						pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
						greedy: true,
						inside: {
							'internal-subset': {
								pattern: /(\[)[\s\S]+(?=\]>$)/,
								lookbehind: true,
								greedy: true,
								inside: null // see below
							},
							'string': {
								pattern: /"[^"]*"|'[^']*'/,
								greedy: true
							},
							'punctuation': /^<!|>$|[[\]]/,
							'doctype-tag': /^DOCTYPE/,
							'name': /[^\s<>'"]+/
						}
					},
					'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
					'tag': {
						pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
						greedy: true,
						inside: {
							'tag': {
								pattern: /^<\/?[^\s>\/]+/,
								inside: {
									'punctuation': /^<\/?/,
									'namespace': /^[^\s>\/:]+:/
								}
							},
							'attr-value': {
								pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
								inside: {
									'punctuation': [
										{
											pattern: /^=/,
											alias: 'attr-equals'
										},
										/"|'/
									]
								}
							},
							'punctuation': /\/?>/,
							'attr-name': {
								pattern: /[^\s>\/]+/,
								inside: {
									'namespace': /^[^\s>\/:]+:/
								}
							}

						}
					},
					'entity': [
						{
							pattern: /&[\da-z]{1,8};/i,
							alias: 'named-entity'
						},
						/&#x?[\da-f]{1,8};/i
					]
				};

				Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
					Prism.languages.markup['entity'];
				Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

				// Plugin to make entity title show the real entity, idea by Roman Komarov
				Prism.hooks.add('wrap', function (env) {

					if (env.type === 'entity') {
						env.attributes['title'] = env.content.replace(/&amp;/, '&');
					}
				});

				Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
					/**
					 * Adds an inlined language to markup.
					 *
					 * An example of an inlined language is CSS with `<style>` tags.
					 *
					 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
					 * case insensitive.
					 * @param {string} lang The language key.
					 * @example
					 * addInlined('style', 'css');
					 */
					value: function addInlined(tagName, lang) {
						var includedCdataInside = {};
						includedCdataInside['language-' + lang] = {
							pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
							lookbehind: true,
							inside: Prism.languages[lang]
						};
						includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

						var inside = {
							'included-cdata': {
								pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
								inside: includedCdataInside
							}
						};
						inside['language-' + lang] = {
							pattern: /[\s\S]+/,
							inside: Prism.languages[lang]
						};

						var def = {};
						def[tagName] = {
							pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
							lookbehind: true,
							greedy: true,
							inside: inside
						};

						Prism.languages.insertBefore('markup', 'cdata', def);
					}
				});

				Prism.languages.html = Prism.languages.markup;
				Prism.languages.mathml = Prism.languages.markup;
				Prism.languages.svg = Prism.languages.markup;

				Prism.languages.xml = Prism.languages.extend('markup', {});
				Prism.languages.ssml = Prism.languages.xml;
				Prism.languages.atom = Prism.languages.xml;
				Prism.languages.rss = Prism.languages.xml;

			}, {}], 11: [function (require, module, exports) {
				/**
				 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
				 * Modified by Miles Johnson: http://milesj.me
				 *
				 * Supports the following:
				 * 		- Extends clike syntax
				 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
				 * 		- Smarter constant and function matching
				 *
				 * Adds the following new token classes:
				 * 		constant, delimiter, variable, function, package
				 */
				(function (Prism) {
					Prism.languages.php = Prism.languages.extend('clike', {
						'keyword': /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|parent|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
						'boolean': {
							pattern: /\b(?:false|true)\b/i,
							alias: 'constant'
						},
						'constant': [
							/\b[A-Z_][A-Z0-9_]*\b/,
							/\b(?:null)\b/i,
						],
						'comment': {
							pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
							lookbehind: true
						}
					});

					Prism.languages.insertBefore('php', 'string', {
						'shell-comment': {
							pattern: /(^|[^\\])#.*/,
							lookbehind: true,
							alias: 'comment'
						}
					});

					Prism.languages.insertBefore('php', 'comment', {
						'delimiter': {
							pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
							alias: 'important'
						}
					});

					Prism.languages.insertBefore('php', 'keyword', {
						'variable': /\$+(?:\w+\b|(?={))/i,
						'package': {
							pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
							lookbehind: true,
							inside: {
								punctuation: /\\/
							}
						}
					});

					// Must be defined after the function pattern
					Prism.languages.insertBefore('php', 'operator', {
						'property': {
							pattern: /(->)[\w]+/,
							lookbehind: true
						}
					});

					var string_interpolation = {
						pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)*)/,
						lookbehind: true,
						inside: Prism.languages.php
					};

					Prism.languages.insertBefore('php', 'string', {
						'nowdoc-string': {
							pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
							greedy: true,
							alias: 'string',
							inside: {
								'delimiter': {
									pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
									alias: 'symbol',
									inside: {
										'punctuation': /^<<<'?|[';]$/
									}
								}
							}
						},
						'heredoc-string': {
							pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
							greedy: true,
							alias: 'string',
							inside: {
								'delimiter': {
									pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
									alias: 'symbol',
									inside: {
										'punctuation': /^<<<"?|[";]$/
									}
								},
								'interpolation': string_interpolation // See below
							}
						},
						'single-quoted-string': {
							pattern: /'(?:\\[\s\S]|[^\\'])*'/,
							greedy: true,
							alias: 'string'
						},
						'double-quoted-string': {
							pattern: /"(?:\\[\s\S]|[^\\"])*"/,
							greedy: true,
							alias: 'string',
							inside: {
								'interpolation': string_interpolation // See below
							}
						}
					});
					// The different types of PHP strings "replace" the C-like standard string
					delete Prism.languages.php['string'];

					Prism.hooks.add('before-tokenize', function (env) {
						if (!/<\?/.test(env.code)) {
							return;
						}

						var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#)(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|\/\*[\s\S]*?(?:\*\/|$))*?(?:\?>|$)/ig;
						Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
					});

					Prism.hooks.add('after-tokenize', function (env) {
						Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
					});

				}(Prism));

				(function (Prism) {

					if (typeof Prism === 'undefined' || typeof document === 'undefined') {
						return;
					}

					/**
					 * Plugin name which is used as a class name for <pre> which is activating the plugin
					 *
					 * @type {string}
					 */
					var PLUGIN_NAME = 'line-numbers';

					/**
					 * Regular expression used for determining line breaks
					 *
					 * @type {RegExp}
					 */
					var NEW_LINE_EXP = /\n(?!$)/g;


					/**
					 * Global exports
					 */
					var config = Prism.plugins.lineNumbers = {
						/**
						 * Get node for provided line number
						 *
						 * @param {Element} element pre element
						 * @param {number} number line number
						 * @returns {Element|undefined}
						 */
						getLine: function (element, number) {
							if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
								return;
							}

							var lineNumberRows = element.querySelector('.line-numbers-rows');
							if (!lineNumberRows) {
								return;
							}
							var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
							var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

							if (number < lineNumberStart) {
								number = lineNumberStart;
							}
							if (number > lineNumberEnd) {
								number = lineNumberEnd;
							}

							var lineIndex = number - lineNumberStart;

							return lineNumberRows.children[lineIndex];
						},

						/**
						 * Resizes the line numbers of the given element.
						 *
						 * This function will not add line numbers. It will only resize existing ones.
						 *
						 * @param {HTMLElement} element A `<pre>` element with line numbers.
						 * @returns {void}
						 */
						resize: function (element) {
							resizeElements([element]);
						},

						/**
						 * Whether the plugin can assume that the units font sizes and margins are not depended on the size of
						 * the current viewport.
						 *
						 * Setting this to `true` will allow the plugin to do certain optimizations for better performance.
						 *
						 * Set this to `false` if you use any of the following CSS units: `vh`, `vw`, `vmin`, `vmax`.
						 *
						 * @type {boolean}
						 */
						assumeViewportIndependence: true
					};

					/**
					 * Resizes the given elements.
					 *
					 * @param {HTMLElement[]} elements
					 */
					function resizeElements(elements) {
						elements = elements.filter(function (e) {
							var codeStyles = getStyles(e);
							var whiteSpace = codeStyles['white-space'];
							return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
						});

						if (elements.length == 0) {
							return;
						}

						var infos = elements.map(function (element) {
							var codeElement = element.querySelector('code');
							var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
							if (!codeElement || !lineNumbersWrapper) {
								return undefined;
							}

							/** @type {HTMLElement} */
							var lineNumberSizer = element.querySelector('.line-numbers-sizer');
							var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

							if (!lineNumberSizer) {
								lineNumberSizer = document.createElement('span');
								lineNumberSizer.className = 'line-numbers-sizer';

								codeElement.appendChild(lineNumberSizer);
							}

							lineNumberSizer.innerHTML = '0';
							lineNumberSizer.style.display = 'block';

							var oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
							lineNumberSizer.innerHTML = '';

							return {
								element: element,
								lines: codeLines,
								lineHeights: [],
								oneLinerHeight: oneLinerHeight,
								sizer: lineNumberSizer,
							};
						}).filter(Boolean);

						infos.forEach(function (info) {
							var lineNumberSizer = info.sizer;
							var lines = info.lines;
							var lineHeights = info.lineHeights;
							var oneLinerHeight = info.oneLinerHeight;

							lineHeights[lines.length - 1] = undefined;
							lines.forEach(function (line, index) {
								if (line && line.length > 1) {
									var e = lineNumberSizer.appendChild(document.createElement('span'));
									e.style.display = 'block';
									e.textContent = line;
								} else {
									lineHeights[index] = oneLinerHeight;
								}
							});
						});

						infos.forEach(function (info) {
							var lineNumberSizer = info.sizer;
							var lineHeights = info.lineHeights;

							var childIndex = 0;
							for (var i = 0; i < lineHeights.length; i++) {
								if (lineHeights[i] === undefined) {
									lineHeights[i] = lineNumberSizer.children[childIndex++].getBoundingClientRect().height;
								}
							}
						});

						infos.forEach(function (info) {
							var lineNumberSizer = info.sizer;
							var wrapper = info.element.querySelector('.line-numbers-rows');

							lineNumberSizer.style.display = 'none';
							lineNumberSizer.innerHTML = '';

							info.lineHeights.forEach(function (height, lineNumber) {
								wrapper.children[lineNumber].style.height = height + 'px';
							});
						});
					}

					/**
					 * Returns style declarations for the element
					 *
					 * @param {Element} element
					 */
					function getStyles(element) {
						if (!element) {
							return null;
						}

						return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
					}

					var lastWidth = undefined;
					window.addEventListener('resize', function () {
						if (config.assumeViewportIndependence && lastWidth === window.innerWidth) {
							return;
						}
						lastWidth = window.innerWidth;

						resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.' + PLUGIN_NAME)));
					});

					Prism.hooks.add('complete', function (env) {
						if (!env.code) {
							return;
						}

						var code = /** @type {Element} */ (env.element);
						var pre = /** @type {HTMLElement} */ (env.element);
						// var codeText = pre.innerHTML;
						// var code = document.createElement('code');
						// code.innerHTML = codeText;
						// pre.appendChild(code);

						// works only for <code> wrapped inside <pre> (not inline)
						if (!pre || !/pre/i.test(pre.nodeName)) {
							return;
						}

						// Abort if line numbers already exists
						if (code.querySelector('.line-numbers-rows')) {
							return;
						}

						// only add line numbers if <code> or one of its ancestors has the `line-numbers` class
						if (!Prism.util.isActive(code, PLUGIN_NAME)) {
							return;
						}

						// Remove the class 'line-numbers' from the <code>
						// code.classList.remove(PLUGIN_NAME);
						// Add the class 'line-numbers' to the <pre>
						// pre.classList.add(PLUGIN_NAME);

						var match = env.code.match(NEW_LINE_EXP);
						var linesNum = match ? match.length + 1 : 1;
						var lineNumbersWrapper;

						var lines = new Array(linesNum + 1).join('<span></span>');

						lineNumbersWrapper = document.createElement('span');
						lineNumbersWrapper.setAttribute('aria-hidden', 'true');
						lineNumbersWrapper.className = 'line-numbers-rows';
						lineNumbersWrapper.innerHTML = lines;

						if (pre.hasAttribute('data-start')) {
							pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
						}

						env.element.appendChild(lineNumbersWrapper);

						// resizeElements([pre]);

						Prism.hooks.run('line-numbers', env);
					});

					Prism.hooks.add('line-numbers', function (env) {
						env.plugins = env.plugins || {};
						env.plugins.lineNumbers = true;
					});

				}(Prism));

			}, {}], 12: [function (require, module, exports) {
				Prism.languages.python = {
					'comment': {
						pattern: /(^|[^\\])#.*/,
						lookbehind: true
					},
					'string-interpolation': {
						pattern: /(?:f|rf|fr)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
						greedy: true,
						inside: {
							'interpolation': {
								// "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
								pattern: /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
								lookbehind: true,
								inside: {
									'format-spec': {
										pattern: /(:)[^:(){}]+(?=}$)/,
										lookbehind: true
									},
									'conversion-option': {
										pattern: /![sra](?=[:}]$)/,
										alias: 'punctuation'
									},
									rest: null
								}
							},
							'string': /[\s\S]+/
						}
					},
					'triple-quoted-string': {
						pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]*?\1/i,
						greedy: true,
						alias: 'string'
					},
					'string': {
						pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
						greedy: true
					},
					'function': {
						pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
						lookbehind: true
					},
					'class-name': {
						pattern: /(\bclass\s+)\w+/i,
						lookbehind: true
					},
					'decorator': {
						pattern: /(^\s*)@\w+(?:\.\w+)*/im,
						lookbehind: true,
						alias: ['annotation', 'punctuation'],
						inside: {
							'punctuation': /\./
						}
					},
					'keyword': /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
					'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
					'boolean': /\b(?:True|False|None)\b/,
					'number': /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
					'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
					'punctuation': /[{}[\];(),.:]/
				};

				Prism.languages.python['string-interpolation'].inside['interpolation'].inside.rest = Prism.languages.python;

				Prism.languages.py = Prism.languages.python;

			}, {}], 13: [function (require, module, exports) {
				/**
				 * Original by Samuel Flores
				 *
				 * Adds the following new token classes:
				 *     constant, builtin, variable, symbol, regex
				 */
				(function (Prism) {
					Prism.languages.ruby = Prism.languages.extend('clike', {
						'comment': [
							/#.*/,
							{
								pattern: /^=begin\s[\s\S]*?^=end/m,
								greedy: true
							}
						],
						'class-name': {
							pattern: /(\b(?:class)\s+|\bcatch\s+\()[\w.\\]+/i,
							lookbehind: true,
							inside: {
								'punctuation': /[.\\]/
							}
						},
						'keyword': /\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/
					});

					var interpolation = {
						pattern: /#\{[^}]+\}/,
						inside: {
							'delimiter': {
								pattern: /^#\{|\}$/,
								alias: 'tag'
							},
							rest: Prism.languages.ruby
						}
					};

					delete Prism.languages.ruby.function;

					Prism.languages.insertBefore('ruby', 'keyword', {
						'regex': [
							{
								pattern: RegExp(/%r/.source + '(?:' + [
									/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[gim]{0,3}/.source,
									/\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/.source,
									// Here we need to specifically allow interpolation
									/\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/.source,
									/\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/.source,
									/<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/.source
								].join('|') + ')'),
								greedy: true,
								inside: {
									'interpolation': interpolation
								}
							},
							{
								pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[gim]{0,3}(?=\s*(?:$|[\r\n,.;})]))/,
								lookbehind: true,
								greedy: true
							}
						],
						'variable': /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
						'symbol': {
							pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/,
							lookbehind: true
						},
						'method-definition': {
							pattern: /(\bdef\s+)[\w.]+/,
							lookbehind: true,
							inside: {
								'function': /\w+$/,
								rest: Prism.languages.ruby
							}
						}
					});

					Prism.languages.insertBefore('ruby', 'number', {
						'builtin': /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
						'constant': /\b[A-Z]\w*(?:[?!]|\b)/
					});

					Prism.languages.ruby.string = [
						{
							pattern: RegExp(/%[qQiIwWxs]?/.source + '(?:' + [
								/([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,
								/\((?:[^()\\]|\\[\s\S])*\)/.source,
								// Here we need to specifically allow interpolation
								/\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/.source,
								/\[(?:[^\[\]\\]|\\[\s\S])*\]/.source,
								/<(?:[^<>\\]|\\[\s\S])*>/.source
							].join('|') + ')'),
							greedy: true,
							inside: {
								'interpolation': interpolation
							}
						},
						{
							pattern: /("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
							greedy: true,
							inside: {
								'interpolation': interpolation
							}
						}
					];

					Prism.languages.rb = Prism.languages.ruby;
				}(Prism));

			}, {}], 14: [function (require, module, exports) {
				var Prism = require('prismjs/components/prism-core');

				require('prismjs/components/prism-clike');
				require('prismjs/components/prism-markup-templating');

				require('prismjs/components/prism-c');
				require('prismjs/components/prism-cpp');
				require('prismjs/components/prism-csharp');
				require('prismjs/components/prism-css');
				require('prismjs/components/prism-java');
				require('prismjs/components/prism-javascript');
				require('prismjs/components/prism-markup');
				require('prismjs/components/prism-php');
				require('prismjs/components/prism-python');
				require('prismjs/components/prism-ruby');

				module.exports = {
					boltExport: Prism
				};

			}, { "prismjs/components/prism-c": 1, "prismjs/components/prism-clike": 2, "prismjs/components/prism-core": 3, "prismjs/components/prism-cpp": 4, "prismjs/components/prism-csharp": 5, "prismjs/components/prism-css": 6, "prismjs/components/prism-java": 7, "prismjs/components/prism-javascript": 8, "prismjs/components/prism-markup": 10, "prismjs/components/prism-markup-templating": 9, "prismjs/components/prism-php": 11, "prismjs/components/prism-python": 12, "prismjs/components/prism-ruby": 13 }]
		}, {}, [14])(14)
	});
	// grab the now-global Prism and restore the backup
	var prism = window.Prism;
	window.Prism = oldprism;

	return prism;
})(undefined, exports, module, undefined);
export default module.exports.boltExport;
