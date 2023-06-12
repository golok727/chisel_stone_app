import React from "react";
import "./page_style.css";
import Header from "./Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
	ArrowRightIcon,
	DocumentIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
const Page = () => {
	const { pages, currentPageId } = useSelector(({ page }: RootState) => ({
		pages: page.pages,
		currentPageId: page.currentPageId,
	}));
	return (
		<div className="editor__page">
			{pages && pages.length > 0 && currentPageId ? (
				<div className="editor__page-container">
					<Header />
				</div>
			) : (
				<div className="editor__no_pages">
					<h4>
						Please select a page <br /> or make a new page to get Started
					</h4>
					<br />
					<div className="editor__no_pages__icons">
						<h4>Pages</h4>
						<ArrowRightIcon width={50} />
						<PlusIcon width={50} />
						<ArrowRightIcon width={50} />
						<DocumentIcon width={50} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
