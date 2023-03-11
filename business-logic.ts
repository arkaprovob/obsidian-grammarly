import {
	ViewUpdate,
	PluginValue,
	EditorView,
	ViewPlugin,
} from "@codemirror/view";
import * as Grammarly from "@grammarly/editor-sdk";
import { MyPluginSettings } from "./main";

const initializeGrammarly = async (view: EditorView, settings: MyPluginSettings) =>{
	const grammarly = await Grammarly.init(settings.client_id);
	grammarly.addPlugin(
		view.contentDOM,
		{
			documentDialect: "american",
			documentDomain: "creative",
			activation: "immediate"
		},
		view.scrollDOM
		);
	const host = document.querySelector("grammarly-editor-plugin");
	const style = document.createElement("style");
	let inner_html = `
	.nvqxur1>:nth-child(2):not(article)
	{
		left: 80px !important;
	}

	div:has(div[aria-label="Grammarly Settings"])
	{
		left: 80px !important;
	}

	div[role="tooltip"] {
		left: 80px !important;
	}
	`;

	if (settings.left_offset != "0") {
		inner_html =
			inner_html +
			`
			.nvqxur1 div[role=dialog]
			{
				left: ` +
			settings.left_offset +
			`px !important;
			}`;
	}
	if (settings.top_offset != "0") {
		inner_html =
			inner_html +
			`
			.nvqxur1 div[role=dialog]
			{
				top: ` +
			settings.top_offset +
			`px !important;
			}`;
	}
	style.innerHTML = inner_html;
	host?.shadowRoot?.appendChild(style);
	host?.setAttribute("config.oauthRedirectUri", "obsidian://grammarly-auth");
}

const authenticateGrammarlyUser = async (
	url: string,
	settings: MyPluginSettings
) =>{
	const grammarly = await Grammarly.init(settings.client_id);
	grammarly.handleOAuthCallback(url);
}




class GrammarlyPlugin implements PluginValue {
	constructor(view: EditorView) {}
	update(update: ViewUpdate) {}
	destroy() {
		console.log("GrammarlyPlugin destroyed");
	}

	initialize(view: EditorView, settings: MyPluginSettings) {
		return initializeGrammarly(view, settings);
	}
	authenticateUser(url: string, settings: MyPluginSettings){
		return authenticateGrammarlyUser(url, settings);
	}

}
export const grammarlyPlugin = ViewPlugin.fromClass(GrammarlyPlugin);
