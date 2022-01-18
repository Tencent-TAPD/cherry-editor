declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-blockquotefix',
  height: 600
});

export {};