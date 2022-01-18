declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'lists cherry-checklist',
  toolbar: 'ch-checklist',
  height: 600
});

export {};