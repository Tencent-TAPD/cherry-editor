declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-video',
  toolbar: 'ch-video',
  height: 600
});

export {};