import React, { useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPage, updatePageTitle } from "../../../features/pagesSlice";
import "./header_styles.css";
const Header = () => {
	const currentPage = useSelector(getCurrentPage);
	const dispatch = useDispatch();
	const titleEditorRef = useRef<HTMLElement | null>(null);

	const pageTitleHandler = (e: ContentEditableEvent) => {
		if (currentPage && titleEditorRef.current) {
			dispatch(
				updatePageTitle({
					pageId: currentPage._id,
					newTitle: titleEditorRef.current?.textContent || "Untitled",
				})
			);
		}
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
			<ContentEditable
				innerRef={titleEditorRef}
				className={`page__title_editor ${
					!currentPage?.title || currentPage.title === "Untitled" ? "empty" : ""
				}`}
				html={
					currentPage?.title && currentPage.title.toLowerCase() !== "untitled"
						? currentPage.title
						: ""
				}
				disabled={false}
				onKeyDown={handleKeyDown}
				onChange={pageTitleHandler}
				tagName="div"
				data-placeholder="Untitled"
			/>
		</header>
	);
};

export default Header;
