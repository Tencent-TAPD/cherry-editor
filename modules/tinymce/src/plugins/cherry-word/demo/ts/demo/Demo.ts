declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-word',
  toolbar: 'ch-word',
  height: 600
});

export {};