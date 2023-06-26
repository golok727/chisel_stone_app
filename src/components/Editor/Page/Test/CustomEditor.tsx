import "./styles.css";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

export default function App() {
	const [text, setText] = useState("Start editing to see some magic happen!");
	const divRef = useRef<HTMLDivElement | null>(null);
	const cursorRef = useRef(0);

	const handleInput = () => {
		setCursorPosition();
		console.log(cursorRef.current);
		if (!divRef.current) return;
		const { current: editor } = divRef;
		const newText = editor.textContent || "";
		setText(newText);
	};

	const setCursorPosition = () => {
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			const offset = range.startOffset;

			cursorRef.current = offset;
		}
	};

	const positionCursor = () => {
		if (!divRef.current) return;

		const { current: editor } = divRef;

		const range = document.createRange();
		if (!editor || !editor.firstChild) {
			return;
		}
		range.setStart(editor.firstChild || editor, cursorRef.current);
		range.collapse(true);

		const selection = window.getSelection();
		if (selection) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};
	const handleKeyUp = (ev: KeyboardEvent<HTMLDivElement>) => {
		if (ev.key === "Enter") {
			ev.preventDefault();
			setTimeout(() => {
				positionCursor();
			}, 0);
		}
	};
	const handleKeyDown = (ev: KeyboardEvent<HTMLDivElement>) => {
		setCursorPosition();
		if (ev.key === "Enter") {
			ev.preventDefault();
			const leftText = text.substring(0, cursorRef.current);
			const rightText =
				text.substring(cursorRef.current).trim() === ""
					? "\u200B"
					: text.substring(cursorRef.current);

			const newText = leftText + "\n" + rightText;
			setText(newText);
			cursorRef.current += 1;
		}
	};
	useEffect(() => {
		positionCursor();
	}, []);

	useEffect(() => {
		if (!divRef.current) return;
		positionCursor();
		const { current: editor } = divRef;
		editor.textContent = text;
	}, [text]);

	return (
		<div className="App">
			<h1>Hello CodeSandbox</h1>
			<div
				onInput={handleInput}
				ref={divRef}
				onKeyUp={handleKeyUp}
				onKeyDown={handleKeyDown}
				dangerouslySetInnerHTML={{ __html: text }}
				suppressContentEditableWarning
				contentEditable
				style={{
					wordBreak: "break-word",
					whiteSpace: "pre-wrap",
					outline: "none",
					padding: "3px",
				}}
			/>
		</div>
	);
}
