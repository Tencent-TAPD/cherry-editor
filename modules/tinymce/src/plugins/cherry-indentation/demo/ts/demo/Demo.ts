declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-indentation',
  toolbar: 'ch-right-indentation ch-left-indentation',
  height: 600
});

export {};