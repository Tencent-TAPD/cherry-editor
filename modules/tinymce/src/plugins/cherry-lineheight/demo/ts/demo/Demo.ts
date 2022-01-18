declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-lineheight',
  toolbar: 'ch-lineheight',
  height: 600
});

export {};