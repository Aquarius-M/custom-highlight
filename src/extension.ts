// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { languages } from 'vscode';
import Type2ColorShow from './Type2ColorShow';
import Type1ColorShow from './Type1ColorShow';
import { on } from 'events';
import { EXTENSION_ENABLE } from './constant';
import NoneColorShow from './NoneColorShow';
import Type3ColorShow from './Type3ColorShow';

const enable_key = EXTENSION_ENABLE;

let allFileSelector = {
	pattern: "**/*",
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let isEnable = vscode.workspace.getConfiguration().get(enable_key);

	context.subscriptions.push(
		vscode.commands.registerCommand(enable_key, () => {
			vscode.workspace.getConfiguration().update(enable_key, !isEnable, true);
		})
	);
	context.subscriptions.push(

		vscode.workspace.onDidChangeConfiguration(() => {
			const changeEnable = vscode.workspace.getConfiguration().get(enable_key);
			if (isEnable !== changeEnable) {
				isEnable = changeEnable;
				let result = "";
				if (isEnable) {
					result = "已开启";
				} else {
					result = "已关闭";
				}
				vscode.window.showInformationMessage(`Custom Highlight：${result}`);
				deactivate();
			}
		})
	);
	onOpen(context);
}



// This method is called when your extension is deactivated
export function deactivate() {
	languages.registerColorProvider(
		allFileSelector,
		new NoneColorShow(),
	);
}


function onOpen(context: vscode.ExtensionContext) {
	// 类型1为#开头的颜色
	let type1ColorShowDisposable = languages.registerColorProvider(
		allFileSelector,
		new Type1ColorShow(),
	);

	// 类型2为0x开头的颜色
	let type2ColorShowDisposable = languages.registerColorProvider(
		allFileSelector,
		new Type2ColorShow(),
	);

	// 类型3为rgb颜色
	let type3ColorShowDisposable = languages.registerColorProvider(
		allFileSelector,
		new Type3ColorShow(),
	);
	context.subscriptions.push(type1ColorShowDisposable);
	context.subscriptions.push(type2ColorShowDisposable);
	context.subscriptions.push(type3ColorShowDisposable);
}