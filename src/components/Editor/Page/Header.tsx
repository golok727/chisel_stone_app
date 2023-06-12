import React, { FormEvent, useRef, useState } from "react";
import "./header_styles.css";

const Header = () => {
	const [pageTitle, setPageTitle] = useState("");
	const titleEditorRef = useRef<HTMLDivElement | null>(null);
	const pageTitleHandler = (e: FormEvent<HTMLDivElement>) => {
		setPageTitle((e.target as HTMLElement).textContent || "");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (titleEditorRef.current) {
				titleEditorRef.current.blur();
			}
		}
	};

	return (
		<header>
			<div
				ref={titleEditorRef}
				className={`page__title_editor ${!pageTitle ? "empty" : ""}`}
				data-placeholder="Untitled"
				contentEditable="true"
				onInput={pageTitleHandler}
				onKeyDown={handleKeyDown}
			/>
		</header>
	);
};

export default Header;
