import { Plugin } from 'obsidian';

export default class TodoHidePlugin extends Plugin {
	private hideCompletedTodos: boolean = false;

	async onload() {
		// 添加设置选项
		this.addSettingTab(new TodoHideSettingTab(this.app, this));

		// 监听文件变化
		this.registerEvent(this.app.vault.on('modify', this.updateTodos.bind(this)));
		this.registerEvent(this.app.vault.on('create', this.updateTodos.bind(this)));
		this.registerEvent(this.app.vault.on('delete', this.updateTodos.bind(this)));
	}

	updateTodos() {
		if (this.hideCompletedTodos) {
			const todos = document.querySelectorAll('.task-list-item');
			todos.forEach(todo => {
				const checkbox = todo.querySelector('input[type="checkbox"]');
				if (checkbox && checkbox.checked) {
					todo.style.display = 'none'; // 隐藏已完成的待办事项
				} else {
					todo.style.display = ''; // 显示未完成的待办事项
				}
			});
		}
	}

	// 其他方法...
}

class TodoHideSettingTab extends PluginSettingTab {
	private plugin: TodoHidePlugin;

	constructor(app: App, plugin: TodoHidePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Todo Hide Settings' });

		new Setting(containerEl)
			.setName('Hide Completed Todos')
			.setDesc('Hide completed todos when checked.')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.hideCompletedTodos)
					.onChange(async (value) => {
						this.plugin.hideCompletedTodos = value;
						this.plugin.updateTodos(); // 更新待办事项显示
					})
			);
	}
}
