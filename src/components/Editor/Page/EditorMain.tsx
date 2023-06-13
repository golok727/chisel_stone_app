import ChiselStoneBlock from "./ChiselStoneBlock";
import "./editor_main_styles.css";

const EditorMain = () => {
	return (
		<main className="editor__main">
			<ChiselStoneBlock
				block={{ content: "", id: "adfnakjsfn", type: "text" }}
			/>
		</main>
	);
};

export default EditorMain;
