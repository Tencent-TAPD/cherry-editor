declare let tinymce: any;

tinymce.init({
  body_class: 'cherry-editor-body',
  selector: 'textarea.tinymce',
  plugins: 'cherry-tencent-docs',
  toolbar: 'ch-tencent-docs',
  height: 600
});

export {};