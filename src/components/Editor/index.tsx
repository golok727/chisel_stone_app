import EditorNavbar from "./EditorNavbar";
import Page from "./Page";
import "./editor_styles.css";

const Editor = () => {
	return (
		<div className="app_editor">
			<EditorNavbar />
			<Page />
		</div>
	);
};

export default Editor;
