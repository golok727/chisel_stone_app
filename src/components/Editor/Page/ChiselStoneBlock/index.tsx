import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import React, { MouseEvent, useCallback, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDispatch } from "react-redux";
import Button from "../../../../Button";
import "./block_styles.css";
import { addNewBlock, updateBlock } from "../../../../features/pagesSlice";

const ChiselStoneBlock: React.FC<{ block: Block }> = ({ block }) => {
	const [blockText, setBlockText] = useState(() =>
		block.type === "text" ? block.content : ""
	);

	const blockEditorRef = useRef<HTMLElement | null>(null);
	const dispatch = useDispatch();

	const handleAddBlock = (e: MouseEvent<HTMLButtonElement>) => {
		console.log(e.altKey);
		if (e.altKey)
			dispatch(addNewBlock({ blockId: block.id, insertMode: "before" }));
		else dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
	};
	const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
		if (!blockEditorRef.current) {
			return;
		}
		console.log(ev.key === "Enter" && ev.shiftKey);

		if (ev.key === "Enter") {
			if (ev.shiftKey) {
				ev.preventDefault();
				blockEditorRef.current.blur();
				const newText = blockEditorRef.current.innerHTML || "";
				setBlockText(newText);
				dispatch(updateBlock({ block, content: newText }));
			} else {
			}
		}
	};
	const handleOnBlur = () => {
		if (!blockEditorRef.current) {
			return;
		}
		const newText = blockEditorRef.current.innerHTML || "";
		setBlockText(newText);
		dispatch(updateBlock({ block, content: newText }));
	};
	const handleTextBlockInput = useCallback(
		(e: ContentEditableEvent) => {
			console.log("change");
			if (blockEditorRef.current) {
				const newText = blockEditorRef.current.innerHTML || "";
				setBlockText(newText);
			}
		},
		[setBlockText, blockEditorRef]
	);

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
					onBlur={handleOnBlur}
					onKeyDown={handleKeyDown}
					data-placeholder="Press '/' for commands..."
					onChange={handleTextBlockInput}
					html={blockText}
					innerRef={blockEditorRef}
					className={`page__block__editable_div ${
						blockText === "" ? "empty" : ""
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
