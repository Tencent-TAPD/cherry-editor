declare let tinymce: any;

tinymce.init({
  selector: "textarea.tinymce",
  plugins: "cherry-app",
  toolbar: "cherryApp",
  height: 600,
  getCherryAppConfig(cb) {
    const res = [{ "name": "编辑器扩展名称", "avatarUrl": "", "url": "", "height": 400, "width": 600, "app_id": "test00001" }, { "name": "编辑器扩展名称", "avatarUrl": "", "url": "", "height": 400, "width": 600, "app_id": "ff111sf" }];
    cb(res);
  },
});

export {};
