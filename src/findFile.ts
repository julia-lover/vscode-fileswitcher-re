import * as vscode from "vscode";
import * as path from "path"

import {
  formatPath,
  unformatPath,
  currentFile,
  displayStatusBarMessage,
  stripRootPath,
  workspaceRootPath,
  fileExists,
} from "./utils";

type Mapping = {
  from: string;
  to: string;
};

export type Match = {
  path: string;
  formatted: string;
} & Mapping;

export function generateFilePaths(filePath: string): Promise<Match[]> {
  return new Promise((resolve) => {
    const mappings: Mapping[] = vscode.workspace
      .getConfiguration()
      .get("fileswitcher-re.mappings");
    const symbol: string = vscode.workspace.getConfiguration().get("fileswitcher-re.capture-symbol");

    const matches = [];

    mappings.forEach((mapping) => {
      const regexp = new RegExp((mapping["from"]), "i");
      const match = regexp.exec(formatPath(filePath));

      if (match === null) return;

      let newFilePath = mapping["to"];

      match.forEach((item, index) => {
        newFilePath = newFilePath.replace(
          new RegExp(symbol + index, "g"),
          item
        );
      });

      matches.push({ from: mapping.from, to: mapping.to, formatted: formatPath(newFilePath), path: unformatPath(newFilePath) });
    });

    if (matches.length === 0) {
      displayStatusBarMessage('No mappings match current file. Check the "from" of your mappings.');
    } else {
      resolve(matches);
    }
  return;
  })
}

export async function findFile(): Promise<vscode.Uri> {
  return new Promise((resolve) => {
    const filePath = currentFile();
    if (filePath === undefined) return;

    generateFilePaths(filePath).then((matches: Match[]) => {
      const ms = new Array<Match>();
      matches.forEach((match) => {
        if (fileExists(match.path)) {
          ms.push(match);
        }
      });
      if (ms.length === 0) {
        displayStatusBarMessage("No files to switch.")
        return;
      } else if (ms.length === 1) {
        resolve(vscode.Uri.file(workspaceRootPath() + ms[0].path));
        return;
      }
      selectFile(ms).then((file: vscode.Uri) => {
        resolve(file);
      });
    });
  });
}

export async function selectFile(matches: Match[], title = "Select File"): Promise<vscode.Uri> {
  return new Promise((resolve) => {
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = title;
    quickPick.items = matches.map((match) => ({
      label: stripRootPath(match.formatted),
      description: `From ${match.from} — To ${match.to}`
    }));
    quickPick.onDidChangeSelection((selectedFiles) => {
      const match = matches.find(
        (match) => stripRootPath(match.formatted) === selectedFiles[0].label
      );
      resolve(vscode.Uri.file(path.join(workspaceRootPath(), match.path)));
    });
    quickPick.show();
  });
}
