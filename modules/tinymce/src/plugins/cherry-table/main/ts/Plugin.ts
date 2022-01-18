/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from "tinymce/core/api/PluginManager";
import registryPlugin from "./api/Commands";

export default () => {
  PluginManager.add("cherry-table", registryPlugin);
};
