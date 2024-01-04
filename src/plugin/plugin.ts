/**
 * @fileoverview This is the entry point for your plugin.
 * @see {@link https://www.figma.com/plugin-docs/|Figma Plugin Docs}
 */

import coordinate from './coordinate';

/**
 * RECOMMENDED: ignore invisible nodes. speeds up document traversal
 * @see {@link https://www.figma.com/plugin-docs/api/properties/figma-skipinvisibleinstancechildren/|figma.skipInvisibleInstanceChildren}
 */
figma.skipInvisibleInstanceChildren = true;

/**
 * Enables you to render UI to interact with the user, or simply to access browser APIs. This function creates a modal dialog with an <iframe> containing the HTML markup in the html argument.
 * @see {@link https://www.figma.com/plugin-docs/api/properties/figma-showui/|figma.showUI}
 */
figma.showUI(__html__, { width: 560, height: 500, themeColors: true });

// message handle
figma.ui.onmessage = (message: MessageDataFromUI) => {
	if (!message.type) return;

	switch (message.type) {
		// use figma's built-in notification system
		// https://www.figma.com/plugin-docs/api/properties/figma-notify/
		case 'notify': {
			const { type, notification, options } = message;
			return figma.notify(notification as string, options);
		}

		case 'resize-window': {
			const { width = 560, height = 500 } = message.size;
			return figma.ui.resize(width, height);
		}

		case 'query': {
			const { type, query } = message;
			const results = coordinate(query);
			return results;
		}
	}
};
