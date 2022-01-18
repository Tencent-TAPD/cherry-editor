declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-codeblock code',
  toolbar: 'cherry-codeblock code',
  height: 600,
  content_css: ['../../main/ts/extern/css/prism-line-numbers.css','../../main/ts/extern/css/code-block-themes.css'],
});

export {};
