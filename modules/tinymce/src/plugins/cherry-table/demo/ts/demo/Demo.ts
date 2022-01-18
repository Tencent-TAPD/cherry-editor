declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-table table',
  toolbar: 'ch-table table',
  table_toolbar: 'tableprops tabledelete | tablemergecells tablesplitcells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
  height: 600
});

export {};