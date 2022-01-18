declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-toc',
  toolbar: 'ch-toc formatselect',
  skin_url: '../../../../../js/tinymce/skins/ui/oxide',
  height: 600
});

export {};