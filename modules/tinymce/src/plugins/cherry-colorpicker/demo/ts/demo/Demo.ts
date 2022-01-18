declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-colorpicker',
  toolbar: 'ch-text-color ch-back-color',
  height: 600
});

export {};