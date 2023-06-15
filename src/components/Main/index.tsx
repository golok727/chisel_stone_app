import React, { MouseEvent, useLayoutEffect, useRef, useState } from "react";
import "./main_styles.css";
import SideBar from "../Sidebar";
import Editor from "../Editor";
import { getCurrentPage, setCurrentPage } from "../../features/pagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setSidebarWidth } from "../../features/appSlice";

const Main = () => {
	const currentPage = useSelector(getCurrentPage);
	const pages = useSelector((state: RootState) => state.page.pages);
	const dispatch = useDispatch();

	const { sidebarWidth } = useSelector((state: RootState) => ({
		sidebarWidth: state.app.sidebarWidth,
	}));
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dragging, setDragging] = useState(false);

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

		const minSidebarWidth = 250;
		const maxSidebarWidth = 500;

		const newSidebarWidth = Math.max(
			minSidebarWidth,
			Math.min(maxSidebarWidth, mouseX - containerRef.current.offsetLeft)
		);
		dispatch(setSidebarWidth(newSidebarWidth));
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
					setDragging={setDragging}
					onResizerDown={handleMouseDown}
				/>
				<Editor />
			</div>
		</>
	);
};

export default Main;
