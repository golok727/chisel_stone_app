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
	getClassNamesForTextBlocks,
	getPlaceHolderTextForTextBlocks,
	isTextTypeBlock,
	textBlockTypes,
} from "../../../../config/constants";
import {
	setCurrentFocusBlockIdx,
	setCursorPosition,
} from "../../../../features/appSlice";
import {
	addNewBlock,
	getCurrentPage,
	removeBlock,
	updateBlock,
} from "../../../../features/pagesSlice";

const ChiselStoneBlock: React.FC<{ block: Block; idx: number }> = ({
	block,
	idx,
}) => {
	const dispatch = useDispatch();
	const blockEditorRef = useRef<HTMLElement | null>(null);

	const { newBlockId, currentFocusBlockIdx, cursorPosition } = useSelector(
		(state: RootState) => ({
			newBlockId: state.page.newBlock,
			currentFocusBlockIdx: state.app.currentFocusBlockIdx,
			cursorPosition: state.app.cursorPosition,
		})
	);

	const currentPage = useSelector(getCurrentPage);

	const currentFocusBlockIdxRef = useRef<number>(currentFocusBlockIdx);
	const currentPageRef = useRef(currentPage);
	const cursorPositionRef = useRef<number>(cursorPosition);

	const [blockText, setBlockText] = useState(() =>
		isTextTypeBlock(block) && textBlockTypes.includes(block.type)
			? block.content
			: ""
	);

	// Handle new block add
	const handleAddBlock = (e: MouseEvent<HTMLButtonElement>) => {
		const insertMode = e.altKey ? "before" : "after";
		dispatch(addNewBlock({ blockId: block.id, insertMode }));
	};

	// Add "Add functionality" for keyboard navigators
	const handleAddButtonKeyDown = (
		ev: React.KeyboardEvent<HTMLButtonElement>
	) => {
		if (ev.key === "Tab") return;

		if (ev.key === "Enter") {
			ev.preventDefault();
			const insertMode = ev.altKey ? "before" : "after";
			dispatch(addNewBlock({ blockId: block.id, insertMode }));
		}
	};

	// Update state when out of focus
	const handleOnBlur = useCallback(() => {
		const newText = blockEditorRef.current?.textContent || "";
		if (block.content !== newText)
			dispatch(updateBlock({ block, content: newText }));
	}, [dispatch, block]);

	// Handle text input
	const handleTextBlockInput = useCallback(
		(e: ContentEditableEvent) => {
			const newText = blockEditorRef.current?.textContent || "";
			setBlockText(newText);
		},
		[setBlockText]
	);

	// Handle Keydown
	const handleKeyDown = useCallback(
		(ev: React.KeyboardEvent<HTMLDivElement>) => {
			if (!blockEditorRef.current) return;

			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const offset = range.startOffset;
				dispatch(setCursorPosition(offset));
			}

			if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
				ev.preventDefault();
				const blocksLength = currentPageRef.current?.content.length || 0;
				const step = ev.key === "ArrowDown" ? 1 : -1;
				const nextFocusBlock = Math.min(
					Math.max(-1, currentFocusBlockIdxRef.current + step),
					blocksLength - 1
				);

				dispatch(setCurrentFocusBlockIdx(nextFocusBlock));
			} else if (ev.key === "Enter" && !ev.shiftKey) {
				ev.preventDefault();
				blockEditorRef.current.blur();

				const newText = blockEditorRef.current.textContent || "";
				// setBlockText(newText);
				dispatch(updateBlock({ block, content: newText }));
				dispatch(addNewBlock({ blockId: block.id, insertMode: "after" }));
			} else if (ev.key === "Enter" && ev.shiftKey) {
				const newText = blockEditorRef.current.textContent + "\n";
				setBlockText(newText);
			}

			// Remove the block if the block has no content and the event key is Backspace
			else if (ev.key === "Backspace") {
				const precedingBlockIdx = Math.max(
					0,
					currentFocusBlockIdxRef.current - 1
				);
				const precedingBlock =
					currentPageRef.current?.content[precedingBlockIdx];

				if (blockEditorRef.current.textContent === "") {
					ev.preventDefault();
					dispatch(removeBlock(block));

					// Todo add history functionality
				} else {
					if (cursorPositionRef.current !== 0) return;
					ev.preventDefault();
					if (!precedingBlock || !blockEditorRef.current.previousSibling)
						return;

					if (!isTextTypeBlock(precedingBlock)) return;

					dispatch(
						updateBlock({
							block: precedingBlock,
							content: `${precedingBlock.content}${
								blockEditorRef.current.textContent ?? ""
							}`,
						})
					);
					dispatch(removeBlock(block));
				}
				if (precedingBlock && blockEditorRef.current.previousSibling) {
					dispatch(setCursorPosition(precedingBlock.content.length));
					dispatch(
						setCurrentFocusBlockIdx(
							Math.max(0, currentFocusBlockIdxRef.current - 1)
						)
					);
				}
			} else {
				// Update cursor position in state for other key events
			}
		},
		[dispatch]
	);

	const handleFocus = () => {
		if (blockEditorRef.current) {
			const selection = window.getSelection();
			if (selection) {
				const range = document.createRange();
				const contentLength = blockEditorRef.current.textContent?.length || 0;
				let startPosition = cursorPositionRef.current;
				const firstChildNode = blockEditorRef.current.firstChild;
				if (firstChildNode instanceof Node) {
					startPosition = Math.min(startPosition, contentLength);
					range.setStart(firstChildNode, startPosition);
				} else {
					startPosition = contentLength;
					range.setStart(blockEditorRef.current, startPosition);
				}
				range.collapse(true);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	};
	const handleOnClick = useCallback(() => {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const offset = range.startOffset;
			dispatch(setCursorPosition(offset));
		}
	}, [dispatch]);

	useEffect(() => {
		cursorPositionRef.current = cursorPosition;
	}, [cursorPosition]);

	useEffect(() => {
		setBlockText(() =>
			isTextTypeBlock(block) && textBlockTypes.includes(block.type)
				? block.content
				: ""
		);
	}, [block]);

	// Set the currentFocusBlockIdx
	useEffect(() => {
		currentFocusBlockIdxRef.current = currentFocusBlockIdx;
	}, [currentFocusBlockIdx, idx]);

	// Handle focus for new blocks
	useEffect(() => {
		if (newBlockId === block.id && blockEditorRef.current && !block.content) {
			blockEditorRef.current?.focus();
		}
	}, [block.id, newBlockId]);

	useEffect(() => {
		if (!blockEditorRef.current) return;
		if (currentFocusBlockIdx === idx) blockEditorRef.current.focus();
	}, [currentFocusBlockIdx, idx]);

	useEffect(() => {
		currentPageRef.current = currentPage;
	}, [currentPage]);
	console.log("idx", idx);

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
					onClick={handleOnClick}
					data-placeholder={getPlaceHolderTextForTextBlocks(block.type)}
					onChange={handleTextBlockInput}
					style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
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
