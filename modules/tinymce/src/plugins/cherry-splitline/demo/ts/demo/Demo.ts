declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-splitline',
  toolbar: 'ch-splitline',
  height: 600
});

export {};