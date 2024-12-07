import { Plugin } from 'obsidian';

export default class TodoHidePlugin extends Plugin {
	async onload() {
		console.log('TodoHidePlugin loaded!');

		// 监听笔记内容变化
		this.app.workspace.on('document-change', this.handleDocumentChange.bind(this));
	}

	handleDocumentChange(event: any) {
		const { document } = event;
		if (document instanceof MarkdownDocument) {
			this.hideCompletedTodos(document);
		}
	}

	hideCompletedTodos(document: any) {
		const lines = document.getText().split('\n');
		let newContent = '';
		let inCodeBlock = false;

		for (const line of lines) {
			if (line.trim().startsWith('```')) {
				inCodeBlock = !inCodeBlock;
			}

			if (!inCodeBlock && line.trim().startsWith('- [x] ')) {
				// 如果是已完成的 todo，跳过这一行
				continue;
			}

			newContent += line + '\n';
		}

		if (newContent !== document.getText()) {
			this.app.vault.modify(document.file, newContent);
		}
	}
}
