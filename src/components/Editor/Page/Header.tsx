import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentPage, updatePageTitle } from "../../../features/pagesSlice";
import "./header_styles.css";

const Header = () => {
	const currentPage = useSelector(getCurrentPage);
	const dispatch = useDispatch();
	const titleEditorRef = useRef<HTMLElement | null>(null);
	const [currentHeader, setCurrentHeader] = useState(
		currentPage?.title && currentPage.title.toLowerCase() !== "untitled"
			? currentPage.title
			: ""
	);
	const pageTitleHandler = () => {
		setCurrentHeader(titleEditorRef.current?.textContent || "");
	};

	const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
		if (ev.key === "Enter") {
			if (currentPage && titleEditorRef.current) {
				ev.preventDefault();
				dispatch(
					updatePageTitle({
						pageId: currentPage._id,
						newTitle: titleEditorRef.current?.textContent || "Untitled",
					})
				);
				if (titleEditorRef.current) {
					titleEditorRef.current.blur();
				}
			}
		}
	};
	useEffect(() => {
		setCurrentHeader(
			currentPage?.title && currentPage.title.toLowerCase() !== "untitled"
				? currentPage.title
				: ""
		);
	}, [currentPage]);

	return (
		<header>
			<ContentEditable
				innerRef={titleEditorRef}
				className={`page__title_editor ${
					!currentHeader || currentHeader === "Untitled" ? "empty" : ""
				}`}
				html={currentHeader}
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
