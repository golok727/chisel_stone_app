import React, {
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import ContentEditable from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";

import {
	getClassNamesForTextBlocks,
	getPlaceHolderTextForTextBlocks,
} from "../../../../config/constants";
import editorConfig from "../../../../config/editorConfig";
import { getPagesState, setPagesState } from "../../../../features/appSlice";
import {
	addNewBlock,
	getCurrentPage,
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
		let startPos = cursorPositionRef.current;
		const firstChildNode = editableBlockRef.current.firstChild;
		if (firstChildNode instanceof Node) {
			startPos = Math.min(startPos, contentLength);
			range.setStart(firstChildNode, startPos);
		} else {
			startPos = contentLength;
			range.setStart(editableBlockRef.current, startPos);
		}
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}, [editableBlockRef, cursorPosition]);

	// to set the caret position when the caret pos is changed with the arrow keys or my click

	const setCursorPosition = useCallback(() => {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0 && currentPageRef.current?._id) {
			const range = selection.getRangeAt(0);
			const offset = range.startOffset;
			if (offset !== cursorPositionRef.current)
				dispatch(
					setPagesState({
						pageId: currentPageRef.current._id,
						cursorPosition: offset,
					})
				);
		}
	}, [dispatch, currentPage, currentPageRef]);

	// Handlers

	// Keydown
	const handleKeyUp = useCallback(
		(ev: KeyboardEvent<HTMLDivElement>) => {
			setCursorPosition();
		},
		[setCursorPosition]
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
			const { key } = ev;
			const { keyBindings } = editorConfig;
			const currentPageId = currentPageRef.current._id;
			const insertMode = ev.altKey ? "before" : "after";
			const blocksLength = currentPageRef.current?.content.length || 0;

			if (key === keyBindings.ARROW_UP || key === keyBindings.ARROW_DOWN) {
				ev.preventDefault();
				const step = key == keyBindings.ARROW_UP ? -1 : 1;
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
			} else if (key === keyBindings.ENTER && !ev.shiftKey) {
				ev.preventDefault();
				const newText = editableBlockRef.current.textContent || "";
				const leftText = newText.substring(0, cursorPositionRef.current);
				const rightText = newText.substring(
					cursorPositionRef.current,
					newText.length
				);
				const step = ev.altKey ? 0 : 1;
				blockTextRef.current = leftText;
				dispatch(updateBlock({ block: block as Block, content: leftText }));
				dispatch(
					addNewBlock({ blockId: block.id, insertMode, content: rightText })
				);

				// update the focus block index and the cursor position
				const newFocusBlockIdx = Math.max(
					currentFocusBlockIdxRef.current + step
				);
				const newCursorPosition =
					insertMode === "before" ? 0 : rightText.length;

				dispatch(
					setPagesState({
						pageId: currentPageId,
						currentFocusBlockIdx: newFocusBlockIdx,
						cursorPosition: newCursorPosition,
					})
				);
			} else if (key === keyBindings.BACKSPACE) {
			} else {
				// ...rest
			}
		},
		[
			dispatch,
			currentPageRef,
			currentFocusBlockIdx,
			editableBlockRef,
			editorConfig,
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
			if (!currentPageRef.current) return;

			dispatch(
				setPagesState({
					pageId: currentPageRef.current._id,
					currentFocusBlockIdx: currentFocusBlockIdxRef.current,
				})
			);
		},
		[
			dispatch,
			currentPageRef,
			currentFocusBlockIdxRef,
			currentFocusBlockIdx,
			positionCaret,
		]
	);

	const handleOnChange = useCallback(() => {
		const newText = editableBlockRef.current?.textContent ?? "";
		if (newText === blockTextRef.current) return;
		blockTextRef.current = newText;
	}, [editableBlockRef, blockTextRef]);

	// HandlersEnd

	// Use Effects
	useEffect(() => {
		currentPageRef.current = currentPage;
		currentFocusBlockIdxRef.current = currentFocusBlockIdx;
		cursorPositionRef.current = cursorPosition;
	}, [currentPage, currentFocusBlockIdx, cursorPosition]);

	useEffect(() => {
		if (blockIdx === currentFocusBlockIdxRef.current)
			editableBlockRef.current?.focus();
	}, [blockIdx, currentFocusBlockIdx]);

	return (
		<ContentEditable
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onClick={handleClick}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onChange={handleOnChange}
			data-placeholder={getPlaceHolderTextForTextBlocks(block.type)}
			style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
			html={blockTextRef.current}
			innerRef={editableBlockRef}
			className={`page__block__editable_div ${getClassNamesForTextBlocks(
				block.type
			)} ${blockTextRef.current === "" ? "empty" : ""}`}
		/>
	);
};
export default ChiselStoneTextBlock;
