import "./editor_main_styles.css";
import { useSelector } from "react-redux";
import ChiselStoneBlock from "./ChiselStoneBlock";
import { getCurrentPage } from "../../../features/pagesSlice";
import EmptyPage from "./EmptyPage";

const EditorMain = () => {
	const currentPage = useSelector(getCurrentPage);

	return (
		<main className="editor__main">
			{/* Render the blocks */}
			{currentPage && currentPage.content && currentPage.content.length > 0 ? (
				currentPage.content.map((block) => (
					<ChiselStoneBlock key={block.id} block={block} />
				))
			) : (
				<EmptyPage />
			)}
		</main>
	);
};

export default EditorMain;
