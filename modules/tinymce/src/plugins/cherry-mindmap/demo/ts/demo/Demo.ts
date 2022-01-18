declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-mindmap',
  toolbar: 'ch-mindmap',
  height: 600
});

export {};