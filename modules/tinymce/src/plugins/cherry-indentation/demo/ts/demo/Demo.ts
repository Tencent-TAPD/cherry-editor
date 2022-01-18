declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-indentation',
  toolbar: 'ch-indentation',
  height: 600
});

export {};