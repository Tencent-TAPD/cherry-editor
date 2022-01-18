declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-alignment',
  toolbar: 'ch-alignment',
  height: 600
});

export {};