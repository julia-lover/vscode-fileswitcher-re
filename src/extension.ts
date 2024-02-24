import * as vscode from "vscode";
import {
  switchFile,
  switchFileSplit,
  createTargetFile,
  createAndSwitchFile,
  createAndSwitchFileSplit,
  displayMappings,
} from "./api";

export function activate(context: vscode.ExtensionContext): void {
  const switcher = vscode.commands.registerCommand(
    "fileswitcher-re.switchFile",
    switchFile
  );

  context.subscriptions.push(switcher);

  const switchSplit = vscode.commands.registerCommand(
    "fileswitcher-re.switchFileSplit",
    switchFileSplit
  );

  context.subscriptions.push(switchSplit);

  const listMappings = vscode.commands.registerCommand(
    "fileswitcher-re.listMappings",
    displayMappings
  );

  context.subscriptions.push(listMappings);

  const createFileCommand = vscode.commands.registerCommand(
    "fileswitcher-re.createFile",
    createTargetFile
  );

  context.subscriptions.push(createFileCommand);

  const createAndSwitchFileCommand = vscode.commands.registerCommand(
    "fileswitcher-re.createAndSwitchFile",
    createAndSwitchFile
  );

  context.subscriptions.push(createAndSwitchFileCommand);

  const createAndSwitchFileSplitCommand = vscode.commands.registerCommand(
    "fileswitcher-re.createAndSwitchFileSplit",
    createAndSwitchFileSplit
  );

  context.subscriptions.push(createAndSwitchFileSplitCommand);
}

export function deactivate(): void {
  // intentionally empty
}
