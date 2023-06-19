import "./editor_main_styles.css";
import { useSelector } from "react-redux";
import ChiselStoneBlock from "./ChiselStoneBlockv2";
import { getCurrentPage } from "../../../features/pagesSlice";
import EmptyPage from "./EmptyPage";

const EditorMain = () => {
	const currentPage = useSelector(getCurrentPage);

	return (
		<main className="editor__main">
			{/* Render the blocks */}
			{currentPage && currentPage.content && currentPage.content.length > 0 ? (
				currentPage.content.map((block, idx) => (
					<ChiselStoneBlock key={block.id} block={block} blockIdx={idx} />
				))
			) : (
				<EmptyPage />
			)}
		</main>
	);
};

export default EditorMain;
