import "./block_styles.css";
import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import React, {
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../Button";
import { RootState } from "../../../../app/store";
import {
	addNewBlock,
	removeBlock,
	updateBlock,
} from "../../../../features/pagesSlice";
import {
	StringContentBlockTypes,
	isTextTypeBlock,
	textBlockTypes,
} from "../../../../config/constants";

const ChiselStoneBlock: React.FC<{ block: Block }> = ({ block }) => {
	const [blockText, setBlockText] = useState(() =>
		isTextTypeBlock(block) && textBlockTypes.includes(block.type)
			? block.content
			: ""
	);
	const { newBlockId } = useSelector((state: RootState) => ({
		newBlockId: state.page.newBlock,
	}));
	const blockEditorRef = useRef<HTMLElement | null>(null);
	const dispatch = useDispatch();

	// Handle new block add
	const handleAddBlock = (e: MouseEvent<HTMLButtonElement>) => {
		if (e.altKey) {
			dispatch(addNewBlock({ blockId: block.id, insertMode: "before" }));
		} else dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
	};

	// Handle Keydown
	const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
		if (!blockEditorRef.current) return;

		if (ev.key === "Enter") {
			if (!ev.shiftKey) {
				ev.preventDefault();
				blockEditorRef.current.blur();
				const newText = blockEditorRef.current.innerHTML || "";
				setBlockText(newText);
				dispatch(updateBlock({ block, content: newText }));
			}
		}
		// Remove the block if the block has no content and the event key is Backspace
		if (ev.key === "Backspace") {
			if (blockEditorRef.current.textContent === "") {
				dispatch(removeBlock(block));
				// Todo add history functionality
			}
		}
	};
	// Add "Add functionality" for keyboard navigators
	const handleAddButtonKeyDown = (
		ev: React.KeyboardEvent<HTMLButtonElement>
	) => {
		if (ev.key === "Tab") return;
		ev.preventDefault();
		if (ev.key === "Enter") {
			if (ev.altKey)
				dispatch(addNewBlock({ blockId: block.id, insertMode: "before" }));
			else dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
		}
	};

	// Update state when out of focus
	const handleOnBlur = () => {
		if (!blockEditorRef.current) {
			return;
		}
		const newText = blockEditorRef.current.innerHTML || "";
		setBlockText(newText);
		dispatch(updateBlock({ block, content: newText }));
	};

	// Handle text input
	const handleTextBlockInput = useCallback(
		(e: ContentEditableEvent) => {
			if (blockEditorRef.current) {
				const newText = blockEditorRef.current.innerHTML || "";
				setBlockText(newText);
			}
		},
		[setBlockText, blockEditorRef]
	);

	// Handle focus for new blocks
	useEffect(() => {
		if (newBlockId === block.id)
			if (blockEditorRef.current && !block.content) {
				blockEditorRef.current.focus();
			}
	}, [block.id]);

	const getClassNamesForTextBlocks = useCallback(
		(blockType: StringContentBlockTypes): string => {
			switch (blockType) {
				case "text":
					return "type-text";
				case "h1":
					return "type-h1";

				case "h2":
					return "type-h2";

				case "h3":
					return "type-h3";

				default:
					return "";
			}
		},
		[]
	);
	const getPlaceHolderTextForTextBlocks = useCallback(
		(blockType: StringContentBlockTypes): string => {
			switch (blockType) {
				case "text":
					return "Press '/' for commands...";
				case "h1":
					return "Heading 1";

				case "h2":
					return "Heading 2";

				case "h3":
					return "Heading 3";

				default:
					return "";
			}
		},
		[]
	);

	return (
		<div className="page__block" tabIndex={0} data-block-id={block.id}>
			<div className="page__block__actions">
				<Button onClick={handleAddBlock} onKeyDown={handleAddButtonKeyDown}>
					<PlusIcon width={17} />
				</Button>
				<div className="page__block__actions-move">
					<Squares2X2Icon width={17} />
				</div>
			</div>

			{/*  For Text Block */}
			{isTextTypeBlock(block) && textBlockTypes.includes(block.type) && (
				<ContentEditable
					onBlur={handleOnBlur}
					onKeyDown={handleKeyDown}
					data-placeholder={getPlaceHolderTextForTextBlocks(block.type)}
					onChange={handleTextBlockInput}
					html={blockText}
					innerRef={blockEditorRef}
					className={`page__block__editable_div ${getClassNamesForTextBlocks(
						block.type
					)} ${blockText === "" ? "empty" : ""}`}
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
