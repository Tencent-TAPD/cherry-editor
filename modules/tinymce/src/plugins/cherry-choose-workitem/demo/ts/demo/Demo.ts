declare let tinymce: any;

tinymce.init({
  body_class: 'cherry-editor-body',
  selector: 'textarea.tinymce',
  plugins: 'cherry-choose-workitem',
  toolbar: 'ch-choose-workitem',
  height: 600
});

export {};