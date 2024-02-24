import { sep } from "path";

import * as vscode from "vscode";

import * as fs from "fs";

export function unformatPath(filePath: string): string {
  if (vscode.workspace.getConfiguration().get("fileswitcher-re.force-posix")) {
    if (sep == "\\") {
      return filePath.replace(new RegExp("/", "g"), "\\");
    }
  } else {
    return filePath;
  }
}

export function formatPath(filePath: string): string {
  if (vscode.workspace.getConfiguration().get("fileswitcher-re.force-posix")) {
    if (sep == "\\") {
      return filePath.replace(new RegExp("\\\\", "g"), "/");
    }
  } else {
    return filePath;
  }
}

export function workspaceRootPath(): string {
  const path = unformatPath(vscode.workspace.workspaceFolders[0].uri.path) + sep;
  if (path.substring(0, 1) == sep) {
    return path.slice(1);
  } else {
    return path;
  }
}

export function stripRootPath(file: string): string {
  return file.replace(workspaceRootPath(), "");
}

export function openFile(
  file: vscode.Uri,
  column = vscode.ViewColumn.Active
): void {
  if (file === undefined) return;

  vscode.window.showTextDocument(file, { viewColumn: column });
}

export function openFileSplit(file: vscode.Uri): void {
  const column =
      vscode.window.activeTextEditor.viewColumn === 1
        ? vscode.ViewColumn.Two
        : vscode.ViewColumn.One;

  openFile(file, column);
}

export function currentFile(): string {
  const currentFile = vscode.window.activeTextEditor;

  if (currentFile === undefined) return;

  return stripRootPath(currentFile.document.fileName);
}

export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(workspaceRootPath() + filePath);
};

export const createFile = (filePath: string): void => {
  const edit = new vscode.WorkspaceEdit();
  edit.createFile(vscode.Uri.file(filePath));
  vscode.workspace.applyEdit(edit);
};

export const createFileIfNotExists = (filePath: string): void => {
  if (!fileExists(filePath)) {
    createFile(filePath);
  }
};

export function displayStatusBarMessage(message: string): void {
  vscode.window.setStatusBarMessage(
    message,
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    })
  );
}
