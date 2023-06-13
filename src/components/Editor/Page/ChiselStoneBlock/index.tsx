import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import Button from "../../../../Button";
import "./block_styles.css";
import ContentEditable from "react-contenteditable";
const ChiselStoneBlock: React.FC<{ block: Block }> = ({ block }) => {
	const blockEditorRef = useRef<HTMLElement | null>(null);

	return (
		<div className="page__block" tabIndex={0}>
			<div className="page__block__actions">
				<Button>
					<PlusIcon width={17} />
				</Button>
				<div className="page__block__actions-move">
					<Squares2X2Icon width={17} />
				</div>
			</div>
			{block.type === "text" && (
				<ContentEditable
					data-placeholder="Press '/' for commands"
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
