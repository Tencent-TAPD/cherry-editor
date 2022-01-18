declare let tinymce: any;

tinymce.init({
  body_class: 'cherry-editor-body',
  selector: 'textarea.tinymce',
  plugins: 'cherry-panel',
  toolbar: 'ch-panel',
  height: 600
});

export {};