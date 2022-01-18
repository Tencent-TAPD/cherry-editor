import * as CodeMirror from 'codemirror/lib/codemirror';
import * as DOMPurify from 'dompurify';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/xml-fold';

window.CodeMirror = CodeMirror;
window.DOMPurify = DOMPurify;

declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'cherry-code',
  toolbar: 'ch-code',
  height: 600
});

export {};