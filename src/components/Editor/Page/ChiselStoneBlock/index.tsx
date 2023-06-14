import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import React, { MouseEvent, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { useDispatch } from "react-redux";
import Button from "../../../../Button";
import "./block_styles.css";
import { addNewBlock } from "../../../../features/pagesSlice";
const ChiselStoneBlock: React.FC<{ block: Block }> = ({ block }) => {
	const blockEditorRef = useRef<HTMLElement | null>(null);
	const dispatch = useDispatch();

	const handleAddBlock = (e: MouseEvent<HTMLButtonElement>) => {
		console.log(e.altKey);
		if (e.altKey)
			dispatch(addNewBlock({ blockId: block.id, insertMode: "before" }));
		else dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
	};

	return (
		<div className="page__block" tabIndex={0}>
			<div className="page__block__actions">
				<Button onClick={handleAddBlock}>
					<PlusIcon width={17} />
				</Button>
				<div className="page__block__actions-move">
					<Squares2X2Icon width={17} />
				</div>
			</div>
			{block.type === "text" && (
				<ContentEditable
					data-placeholder="Press '/' for commands..."
					onChange={() => {}}
					html={block.content}
					innerRef={blockEditorRef}
					className={`page__block__editable_div ${
						block.content === "" ? "empty" : ""
					}`}
				/>
			)}
		</div>
	);
};

export default ChiselStoneBlock;

// <ContentEditable
// 			innerRef={titleEditorRef}
// 			className={`page__title_editor ${
// 				!currentPage?.title || currentPage.title === "Untitled" ? "empty" : ""
// 			}`}
// 			html={
// 				currentPage?.title && currentPage.title.toLowerCase() !== "untitled"
// 					? currentPage.title
// 					: ""
// 			}
// 			disabled={false}
// 			onKeyDown={handleKeyDown}
// 			onChange={pageTitleHandler}
// 			tagName="div"
// 			data-placeholder="Untitled"
// 		/>
