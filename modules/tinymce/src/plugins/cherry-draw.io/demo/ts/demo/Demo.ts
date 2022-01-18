declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-draw.io',
  toolbar: 'ch-drawio',
  height: 600
});

export {};