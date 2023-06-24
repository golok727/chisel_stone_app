import React, {
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";

import {
	StringContentBlockTypes,
	getClassNamesForTextBlocks,
	getPlaceHolderTextForTextBlocks,
	isTextTypeBlock,
} from "../../../../config/constants";
import editorConfig, { keyBindings } from "../../../../config/editorConfig";
import { getPagesState, setPagesState } from "../../../../features/appSlice";
import {
	addNewBlock,
	getCurrentPage,
	removeBlock,
	updateBlock,
} from "../../../../features/pagesSlice";

interface TextBlockProps {
	blockIdx: number;
	block: TextBlock;
}

const ChiselStoneTextBlock: React.FC<TextBlockProps> = ({
	block,
	blockIdx,
}) => {
	const dispatch = useDispatch();
	// Ref for the block
	const editableBlockRef = useRef<HTMLDivElement | null>(null);
	// State for the current Text
	const blockTextRef = useRef(block.content);

	// Select from state
	const currentPage = useSelector(getCurrentPage);
	const { currentFocusBlockIdx, cursorPosition } = useSelector(getPagesState);

	// Store refs of the state
	const currentPageRef = useRef(currentPage);
	const currentFocusBlockIdxRef = useRef(currentFocusBlockIdx);
	const cursorPositionRef = useRef(cursorPosition);

	// Fns
	const saveBlock = useCallback(() => {
		if (!editableBlockRef.current) return;
		dispatch(
			updateBlock({
				block: block as Block,
				content: editableBlockRef.current.textContent || "",
			})
		);
	}, [dispatch, editableBlockRef]);

	// Position the caret to the current cursor position in the state
	const positionCaret = useCallback(() => {
		const selection = window.getSelection();
		if (!editableBlockRef.current || !selection) return;

		const range = document.createRange();
		const contentLength = editableBlockRef.current.textContent?.length || 0;
		const startPos = Math.min(cursorPositionRef.current, contentLength);

		// Check if the start position is within the valid range
		if (startPos <= contentLength) {
			range.setStart(
				editableBlockRef.current.firstChild || editableBlockRef.current,
				startPos
			);
		} else {
			// Handle the case where the start position is beyond the content length
			range.setStart(
				editableBlockRef.current.lastChild || editableBlockRef.current,
				0
			);
		}

		range.collapse(true);

		selection.removeAllRanges();
		selection.addRange(range);
	}, [editableBlockRef, cursorPositionRef]);

	// to set the caret position when the caret pos is changed with the arrow keys or my click

	const setCursorPosition = useCallback(() => {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0 && currentPageRef.current?._id) {
			const range = selection.getRangeAt(0);
			const offset = range.startOffset;
			// if (offset !== cursorPositionRef.current)
			dispatch(
				setPagesState({
					pageId: currentPageRef.current._id,
					cursorPosition: offset,
				})
			);
		}
	}, [dispatch, currentPage]);

	// Handlers

	// Keydown
	const handleKeyUp = useCallback(
		(ev: KeyboardEvent<HTMLDivElement>) => {
			setCursorPosition();
			if (ev.key === "Backspace") {
				ev.preventDefault();
				setTimeout(() => {
					positionCaret();
				}, 0);
			}
		},
		[setCursorPosition, positionCaret]
	);

	//Keyup
	const handleClick = useCallback(
		(ev: MouseEvent<HTMLDivElement>) => {
			// If a block is pressed update the cursor pos and the block idx
			setCursorPosition();
			if (
				currentPageRef.current &&
				blockIdx !== currentFocusBlockIdxRef.current
			)
				dispatch(
					setPagesState({
						pageId: currentPageRef.current._id,
						currentFocusBlockIdx: blockIdx,
					})
				);
		},
		[dispatch, currentPageRef, currentFocusBlockIdxRef, blockIdx]
	);
	const handleKeyDown = useCallback(
		(ev: KeyboardEvent<HTMLDivElement>) => {
			if (!editableBlockRef.current || !currentPageRef.current) return;
			const { current: blockEditor } = editableBlockRef;
			const { current: currentPage } = currentPageRef;

			const { key } = ev;
			const { keyBindings } = editorConfig;
			const currentPageId = currentPageRef.current._id;
			const insertMode = ev.altKey ? "before" : "after";
			const blocksLength = currentPageRef.current.content.length || 0;

			switch (key) {
				case keyBindings.ARROW_UP:
				case keyBindings.ARROW_DOWN: {
					const step = key === keyBindings.ARROW_UP ? -1 : 1;

					ev.preventDefault();
					const nextFocusBlock = Math.min(
						Math.max(0, currentFocusBlockIdxRef.current + step),
						blocksLength - 1
					);
					dispatch(
						setPagesState({
							pageId: currentPageId,
							currentFocusBlockIdx: nextFocusBlock,
						})
					);
					break;
				}
				case keyBindings.ENTER: {
					ev.preventDefault();
					const step = ev.altKey ? 0 : 1;

					if (ev.shiftKey) {
						// Check for Shift key
						dispatch(
							addNewBlock({ blockId: block.id, insertMode, content: "" })
						);

						const newFocusBlockIdx = currentFocusBlockIdxRef.current + step;
						dispatch(
							setPagesState({
								pageId: currentPageId,
								currentFocusBlockIdx: newFocusBlockIdx,
								cursorPosition: 0,
							})
						);
					} else {
						const newText = blockTextRef.current || "";
						const leftText = newText.substring(0, cursorPositionRef.current);
						const rightText = newText.substring(
							cursorPositionRef.current,
							newText.length
						);

						blockTextRef.current = leftText;
						dispatch(updateBlock({ block: block as Block, content: leftText }));
						dispatch(
							addNewBlock({ blockId: block.id, insertMode, content: rightText })
						);

						const newFocusBlockIdx = currentFocusBlockIdxRef.current + step;
						const newCursorPosition =
							insertMode === "before" ? leftText.length : 0;

						dispatch(
							setPagesState({
								pageId: currentPageId,
								currentFocusBlockIdx: newFocusBlockIdx,
								cursorPosition: newCursorPosition,
							})
						);
					}
					break;
				}

				case keyBindings.BACKSPACE: {
					const precedingBlockIdx = Math.max(
						0,
						currentFocusBlockIdxRef.current - 1
					);
					const precedingBlock = currentPage.content[precedingBlockIdx];

					const selection = window.getSelection();
					const isTextSelected = selection && selection.toString().length > 0;

					if (blockEditor.textContent === "" && !isTextSelected) {
						ev.preventDefault();
						dispatch(removeBlock(block));

						if (precedingBlock === undefined) return;

						dispatch(
							setPagesState({
								pageId: currentPage._id,
								currentFocusBlockIdx: precedingBlockIdx,
								cursorPosition: precedingBlock.content.length,
							})
						);
					} else if (
						!isTextSelected &&
						cursorPositionRef.current === 0 &&
						precedingBlock !== undefined &&
						currentFocusBlockIdxRef.current !== 0 &&
						isTextTypeBlock(precedingBlock)
					) {
						ev.preventDefault();

						const currentBlockContent = blockEditor.textContent || "";
						const mergedContent = precedingBlock.content + currentBlockContent;
						const mergedCursorPos = precedingBlock.content.length;
						dispatch(
							updateBlock({ block: precedingBlock, content: mergedContent })
						);
						dispatch(removeBlock(block));
						dispatch(
							setPagesState({
								pageId: currentPageId,
								currentFocusBlockIdx: precedingBlockIdx,
								cursorPosition: mergedCursorPos,
							})
						);
					}
					break;
				}
				case keyBindings.DELETE_BLOCK: {
					if (ev.ctrlKey) {
						ev.preventDefault();
						const step =
							blocksLength - 1 === currentFocusBlockIdxRef.current ? -1 : 0;

						dispatch(removeBlock(block));

						const newFocusBlockIdx = Math.max(
							0,
							currentFocusBlockIdxRef.current + step
						);
						dispatch(
							setPagesState({
								pageId: currentPageId,
								currentFocusBlockIdx: newFocusBlockIdx,
							})
						);
					}
					break;
				}
				case keyBindings.H1:
				case keyBindings.H2:
				case keyBindings.H3: {
					if (ev.ctrlKey) {
						ev.preventDefault();
						const step = ev.altKey ? 0 : 1;
						const type = ("h" + key) as StringContentBlockTypes;
						dispatch(
							addNewBlock({
								blockId: block.id,
								insertMode,
								content: "",
								type,
							})
						);
						dispatch(
							setPagesState({
								pageId: currentPageRef.current._id,
								currentFocusBlockIdx: currentFocusBlockIdxRef.current + step,
								cursorPosition: 0,
							})
						);
					}
					break;
				}

				default:
					break;
			}
		},
		[
			dispatch,
			currentPage,
			currentFocusBlockIdxRef,
			block,
			blockTextRef,
			cursorPositionRef,
		]
	);

	// When the editor is out of focus then save the thing
	const handleBlur = useCallback(() => {
		saveBlock();
	}, [saveBlock]);

	/*
		when focussed set the cursor position to the previous pos from state
		set the current focus block to the current one
	*/

	const handleFocus = useCallback(
		(ev: FocusEvent<HTMLDivElement>) => {
			positionCaret();
		},
		[positionCaret]
	);

	const handleOnChange = useCallback(
		(ev: ContentEditableEvent) => {
			const newText = editableBlockRef.current?.textContent ?? "";
			blockTextRef.current = newText;
			cursorPositionRef.current =
				editableBlockRef.current?.textContent?.length ?? 0;

			setCursorPosition();
		},
		[editableBlockRef, blockTextRef, cursorPositionRef, setCursorPosition]
	);

	// HandlersEnd

	// Use Effects
	useEffect(() => {
		currentPageRef.current = currentPage;
	}, [currentPage]);

	useEffect(() => {
		currentFocusBlockIdxRef.current = currentFocusBlockIdx;
	}, [currentFocusBlockIdx]);

	useEffect(() => {
		cursorPositionRef.current = cursorPosition;
	}, [cursorPosition]);

	useEffect(() => {
		blockTextRef.current = block.content;
		if (editableBlockRef.current)
			editableBlockRef.current.innerHTML = block.content;
	}, [block]);

	useEffect(() => {
		if (
			blockIdx === currentFocusBlockIdxRef.current &&
			editableBlockRef.current
		) {
			editableBlockRef.current.focus();
		}
	}, [blockIdx, currentFocusBlockIdx]);

	return (
		<ContentEditable
			key={blockIdx}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onClick={handleClick}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onChange={handleOnChange}
			data-placeholder={getPlaceHolderTextForTextBlocks(block.type)}
			style={{
				wordBreak: "break-word",
				whiteSpace: "pre-wrap",
				display: "inline-block",
			}}
			html={blockTextRef.current}
			innerRef={editableBlockRef}
			className={`page__block__editable_div ${getClassNamesForTextBlocks(
				block.type
			)} ${blockTextRef.current === "" ? "empty" : ""}`}
		/>
	);
};
export default ChiselStoneTextBlock;
