import * as path from "path"

import * as vscode from "vscode";

import * as fs from "fs";

export function unformatPath(filePath: string): string {
  if (vscode.workspace.getConfiguration().get("fileswitcher-re.force-posix")) {
    return filePath.split(path.posix.sep).join(path.sep);
  } else {
    return filePath;
  }
}

export function formatPath(filePath: string): string {
  if (vscode.workspace.getConfiguration().get("fileswitcher-re.force-posix")) {
    return filePath.split(path.sep).join(path.posix.sep);
  } else {
    return filePath;
  }
}

export function workspaceRootPath(): string {
  return vscode.workspace.workspaceFolders[0].uri.fsPath;
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

  return stripRootPath(currentFile.document.uri.fsPath);
}

export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(path.join(workspaceRootPath(), filePath));
};

export const createFile = (uri: vscode.Uri): Promise<void> => {
  return new Promise((resolve) => {
    const edit = new vscode.WorkspaceEdit();
    edit.createFile(uri);
    displayStatusBarMessage("file created!");
    vscode.workspace.applyEdit(edit).then(() => {
      resolve();
    });
  });
};

export const createFileIfNotExists = (uri: vscode.Uri): Promise<void> => {
  return new Promise((resolve) => {
    if (!fileExists(uri.path)) {
      createFile(uri).then(() => {
        resolve();
      });
    }
  });
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
