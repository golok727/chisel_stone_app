import React, { useEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import {
	getClassNamesForTextBlocks,
	getPlaceHolderTextForTextBlocks,
} from "../../../../config/constants";
import { useSelector } from "react-redux";
import { getCurrentPage } from "../../../../features/pagesSlice";
import { RootState } from "../../../../app/store";
import { getPagesState } from "../../../../features/appSlice";

interface TextBlockProps {
	blockIdx: number;
	block: TextBlock;
}

const ChiselStoneTextBlock: React.FC<TextBlockProps> = ({
	block,
	blockIdx,
}) => {
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
	const handleOnChange = () => {
		const newText = editableBlockRef.current?.textContent ?? "";
		setBlockText(newText);
	};
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
	}, [blockIdx, currentFocusBlockIdx, currentFocusBlockIdxRef]);

	return (
		<>
			<ContentEditable
				onChange={handleOnChange}
				data-placeholder={getPlaceHolderTextForTextBlocks(block.type)}
				style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
				html={blockText}
				innerRef={editableBlockRef}
				className={`page__block__editable_div ${getClassNamesForTextBlocks(
					block.type
				)} ${blockText === "" ? "empty" : ""}`}
			/>
		</>
	);
};
export default ChiselStoneTextBlock;
