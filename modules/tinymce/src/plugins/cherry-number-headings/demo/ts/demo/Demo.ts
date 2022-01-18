declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-number-headings',
  toolbar: 'ch-number-headings',
  height: 600
});

export {};