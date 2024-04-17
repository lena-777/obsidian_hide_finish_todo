import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	autoHide: boolean;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	styleEl: HTMLStyleElement

	async onload() {
		await this.loadSettings()

		this.styleEl = document.createElement('style');
		this.styleEl.innerHTML = `
				.HyperMD-task-line[data-task="x"] {
						display: none!important;
				}
			`;

		if (this.settings.autoHide) {
			this.show()
		}


		this.addSettingTab(new MySetting(this.app, this))
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	show() {
		document.head.appendChild(this.styleEl);
	}

	hide() {
		if(this.styleEl) {
			document.head.removeChild(this.styleEl)
		}
	}

	onunload() {
		this.hide()
	}

	async loadSettings() {
		this.settings = Object.assign(
			{ autoHide: true },
			await this.loadData()
		)
	}
}

class MySetting extends PluginSettingTab {
	plugin: MyPlugin

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display() {
		const { containerEl } = this
		containerEl.empty()

		new Setting(containerEl)
			.setName('启用完成隐藏')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.autoHide)
				toggle.onChange(bool => {
					this.plugin.settings.autoHide = bool
					this.plugin.saveSettings()
					bool ? this.plugin.show() : this.plugin.hide()
				})
			})
	}
}