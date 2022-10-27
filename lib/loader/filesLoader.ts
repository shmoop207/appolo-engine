"use strict";

import fs = require('fs');
import    path = require('path');
import {Objects, Promises} from '@appolo/utils';
import {Dir} from "fs";

export class FilesLoader {

    public static async* load(root: string, filesPath: string | string[]) {
        if (!Array.isArray(filesPath)) {
            filesPath = [filesPath];
        }

        for await (let filePath of filesPath) {

            yield* this._walk(path.join(root, filePath));
        }
    }

    private static async* _walk(dir: string) {

        let [err, dirs] = await Promises.to<string[], Error>(fs.promises.readdir(dir))

        if (err) {
            return;
        }

        for await (const d of dirs) {
            const file = path.join(dir, d);

          let stat = await fs.promises.stat(file)

            if (stat.isDirectory() && !file.startsWith("~")) {
                yield* await this._walk(file);
            } else if (stat.isFile() && file.endsWith(".js") && !file.startsWith("~")) {
                yield file;
            }
        }
    }
}

