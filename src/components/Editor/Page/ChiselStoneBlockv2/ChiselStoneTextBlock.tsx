import React, {
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import {
	getClassNamesForTextBlocks,
	getPlaceHolderTextForTextBlocks,
} from "../../../../config/constants";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPage } from "../../../../features/pagesSlice";
import { RootState } from "../../../../app/store";
import { getPagesState, setPagesState } from "../../../../features/appSlice";

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
	const [blockText, setBlockText] = useState(block.content);

	// Select from state
	const currentPage = useSelector(getCurrentPage);
	const { currentFocusBlockIdx, cursorPosition } = useSelector(getPagesState);

	// Store refs of the state
	const currentPageRef = useRef(currentPage);
	const currentFocusBlockIdxRef = useRef(currentFocusBlockIdx);
	const cursorPositionRef = useRef(cursorPosition);

	// Handlers

	// Keydown
	const handleKeyUp = useCallback((ev: KeyboardEvent<HTMLDivElement>) => {
		setCursorPosition();
	}, []);

	//Keyup
	const handleClick = useCallback((ev: MouseEvent<HTMLDivElement>) => {
		setCursorPosition();
	}, []);

	const handleKeyDown = useCallback((ev: KeyboardEvent<HTMLDivElement>) => {},
	[]);

	const handleBlur = useCallback((ev: FocusEvent<HTMLDivElement>) => {}, []);
	const handleFocus = useCallback((ev: FocusEvent<HTMLDivElement>) => {
		positionCaret();
	}, []);

	const handleOnChange = useCallback(() => {
		const newText = editableBlockRef.current?.textContent ?? "";
		if (newText === blockText) return;
		setBlockText(newText);
	}, [setBlockText, blockText]);

	// HandlersEnd

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
	}, [editableBlockRef, cursorPosition, cursorPositionRef]);

	// to set the caret position when the caret pos is changed with the arrow keys or my click

	const setCursorPosition = useCallback(() => {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0 && currentPageRef.current?._id) {
			const range = selection.getRangeAt(0);
			const offset = range.startOffset;
			dispatch(
				setPagesState({
					pageId: currentPageRef.current._id,
					cursorPosition: offset,
				})
			);
		}
	}, [dispatch, currentPage, currentPageRef]);

	// Use Effects
	useEffect(() => {
		currentPageRef.current = currentPage;
		currentFocusBlockIdxRef.current = currentFocusBlockIdx;
		cursorPositionRef.current = cursorPosition;
	}, [currentPage, currentFocusBlockIdx, cursorPosition]);

	useEffect(() => {
		if (blockIdx === currentFocusBlockIdxRef.current)
			editableBlockRef.current?.focus();
	}, [blockIdx, currentFocusBlockIdx, currentFocusBlockIdxRef]);

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
			html={blockText}
			innerRef={editableBlockRef}
			className={`page__block__editable_div ${getClassNamesForTextBlocks(
				block.type
			)} ${blockText === "" ? "empty" : ""}`}
		/>
	);
};
export default ChiselStoneTextBlock;
