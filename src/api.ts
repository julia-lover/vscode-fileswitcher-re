import * as vscode from "vscode";

import { findFile, generateFilePaths, Match } from "./findFile";
import { createFile } from "./createFile";
import { currentFile } from "./utils";
import {
  openFile,
  openFileSplit
} from "./utils";

export async function switchFile(): Promise<void> {
  findFile().then((file) => openFile(file));
}

export async function switchFileSplit(): Promise<void> {
  findFile().then((file) => openFileSplit(file));
}

export async function displayMappings(): Promise<void> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  generateFilePaths(filePath).then((matches: Match[]) => {
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = "Generated Mappings";
    quickPick.items = matches.map((match) => ({
      label: match.formatted,
      detail: `From ${match.from} — To ${match.to}`,
    }));

    quickPick.show();
  });
}

export async function createTargetFile(): Promise<void> {
  createFile();
}

export async function createAndSwitchFile(): Promise<void> {
  createFile().then((file) => openFile(file));
}

export async function createAndSwitchFileSplit(): Promise<void> {
  createFile().then((file) => openFileSplit(file));
}
