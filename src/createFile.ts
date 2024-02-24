import * as vscode from "vscode";

import { generateFilePaths, Match, selectFile } from "./findFile";
import { currentFile } from "./utils";
import {
    createFileIfNotExists,
    displayStatusBarMessage,
    fileExists
} from "./utils";

export async function createFile(): Promise<vscode.Uri> {
    return new Promise((resolve) => {
        const filePath = currentFile();
        if (filePath === undefined) return;

        generateFilePaths(filePath).then((matches: Match[]) => {
            const ms = new Array<Match>();
            matches.forEach((match) => {
                if (!fileExists(match.path)) {
                    ms.push(match);
                }
            });

            if (ms.length === 0) {
                if (vscode.workspace.getConfiguration().get("fileswitcher-re.switch-to-exists")) {
                    selectFile(matches).then((file: vscode.Uri) => {
                        resolve(file);
                    });
                    displayStatusBarMessage("All matching files already exist, so switch files instead.");
                } else {
                    displayStatusBarMessage("All matching files already exist.");
                }
            } else {
                selectFile(ms, "Create File").then((file: vscode.Uri) => {
                    createFileIfNotExists(file.path);
                    resolve(file);
                });
            }
        });
    });
}
