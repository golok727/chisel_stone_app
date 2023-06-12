import React from "react";
import "./editor_styles.css";
import EditorNavbar from "./EditorNavbar";
import Page from "./Page";

const Editor = () => {
	return (
		<div className="app_editor">
			<EditorNavbar />
			<Page />
		</div>
	);
};

export default Editor;
