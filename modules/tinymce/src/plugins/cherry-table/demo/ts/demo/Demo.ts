declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-table table',
  toolbar: 'fullscreen switchMarkdown ch-code fontselect fontsizeselect formatselect ch-number-headings | ch-alignment ch-right-indentation ch-left-indentation ch-lineheight | bold italic underline strikethrough | ch-text-color ch-back-color removeformat | numlist bullist ch-checklist | ch-table image ch-video ch-panel ch-toc cherry-codeblock emoji link |  ch-tencent-docs ch-choose-workitem ch-drawio ch-mindmap ch-app0 ch-app1 ch-app2 ch-app3 ch-app4 ch-app5 ch-app6 ch-app7 ch-app8 ch-app9| ch-splitline blockquote ch-word ch-table table',
  table_toolbar: 'tableprops tabledelete | tablemergecells tablesplitcells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
  height: 600
});

export {};