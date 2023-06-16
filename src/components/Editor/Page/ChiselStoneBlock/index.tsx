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
	StringContentBlockTypes,
	isTextTypeBlock,
	textBlockTypes,
} from "../../../../config/constants";
import { setCurrentFocusBlockIdx } from "../../../../features/appSlice";
import {
	addNewBlock,
	getCurrentPage,
	removeBlock,
	updateBlock,
} from "../../../../features/pagesSlice";
import "./block_styles.css";

// TODO only update if the block content changed

const ChiselStoneBlock: React.FC<{ block: Block; idx: number }> = ({
	block,
	idx,
}) => {
	const [blockText, setBlockText] = useState(() =>
		isTextTypeBlock(block) && textBlockTypes.includes(block.type)
			? block.content
			: ""
	);

	const { newBlockId, currentFocusBlockIdx } = useSelector(
		(state: RootState) => ({
			newBlockId: state.page.newBlock,
			currentFocusBlockIdx: state.app.currentFocusBlockIdx,
			currentPageId: state.page.currentPageId,
		})
	);

	const currentPage = useSelector(getCurrentPage);

	const blockEditorRef = useRef<HTMLElement | null>(null);
	const dispatch = useDispatch();

	// Handle new block add
	const handleAddBlock = (e: MouseEvent<HTMLButtonElement>) => {
		if (e.altKey) {
			dispatch(addNewBlock({ blockId: block.id, insertMode: "before" }));
		} else dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
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
	const handleOnBlur = useCallback(() => {
		if (!blockEditorRef.current) {
			return;
		}
		const newText = blockEditorRef.current.innerHTML || "";
		dispatch(updateBlock({ block, content: newText }));
	}, [dispatch, updateBlock]);

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

	// keyBoardNavigation For blocks

	// Handle Keydown
	const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
		if (!blockEditorRef.current) return;

		if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
			ev.preventDefault();
			if (!currentPage) return;
			const blocksLength = currentPage.content.length;

			const step = ev.key === "ArrowDown" ? 1 : -1;

			const focusBlock = Math.min(
				Math.max(0, currentFocusBlockIdx + step),
				blocksLength - 1
			);
			dispatch(setCurrentFocusBlockIdx(focusBlock));
		}

		if (ev.key === "Enter") {
			if (!ev.shiftKey) {
				ev.preventDefault();
				blockEditorRef.current.blur();
				const newText = blockEditorRef.current.innerHTML || "";
				setBlockText(newText);
				dispatch(updateBlock({ block, content: newText }));
				dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
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

	const handleFocus = () => {
		dispatch(setCurrentFocusBlockIdx(idx));
	};

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
		<div className="page__block" tabIndex={-1} data-block-id={block.id}>
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
					onFocus={handleFocus}
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
