import React, { MouseEvent, useLayoutEffect, useRef, useState } from "react";
import "./main_styles.css";
import SideBar from "../Sidebar";
import Editor from "../Editor";
import { getCurrentPage, setCurrentPage } from "../../features/pagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";

const Main = () => {
	const currentPage = useSelector(getCurrentPage);
	const pages = useSelector((state: RootState) => state.page.pages);
	const dispatch = useDispatch();

	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dragging, setDragging] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(250);
	const handleMouseDown = (ev: MouseEvent<HTMLDivElement>) => {
		ev.preventDefault();
		setDragging(true);
	};

	const handleMouseUp = (ev: MouseEvent<HTMLDivElement>) => {
		setDragging(false);
	};

	const handleMouseMove = (ev: MouseEvent<HTMLDivElement>) => {
		if (!dragging) return;
		if (!containerRef.current) return;

		const mouseX = ev.pageX;

		const minSidebarWidth = 250; // Minimum width for the sidebar
		const maxSidebarWidth = 500; // Maximum width for the sidebar

		const newSidebarWidth = Math.max(
			minSidebarWidth,
			Math.min(maxSidebarWidth, mouseX - containerRef.current.offsetLeft)
		);
		setSidebarWidth(newSidebarWidth);
	};

	useLayoutEffect(() => {
		if (!currentPage) {
			if (pages.length > 0) {
				dispatch(setCurrentPage(pages[0]._id));
			}
		}
	}, [currentPage, dispatch, setCurrentPage]);

	return (
		<>
			{/* <h1>Radhey Shyam</h1> */}
			<div
				className="main_container"
				ref={containerRef}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			>
				<SideBar
					isDragging={dragging}
					width={sidebarWidth}
					setDragging={setDragging}
					onResizerDown={handleMouseDown}
				/>
				<Editor />
			</div>
		</>
	);
};

export default Main;
