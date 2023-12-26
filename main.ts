import { Plugin } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	styleEl: HTMLStyleElement

	async onload() {
		this.styleEl = document.createElement('style');
		this.styleEl.innerHTML = `
						.HyperMD-task-line[data-task="x"] {
                display: none!important;
            }
        `;
		document.head.appendChild(this.styleEl);
	}

	onunload() {
		document.head.removeChild(this.styleEl)
	}
}