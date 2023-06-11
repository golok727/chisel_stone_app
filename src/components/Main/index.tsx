import React, { MouseEvent, useRef, useState } from "react";
import "./main_styles.css";
import SideBar from "../Sidebar";
import Editor from "../Editor";

const Main = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dragging, setDragging] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(200);
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

		const minSidebarWidth = 200; // Minimum width for the sidebar
		const maxSidebarWidth = 500; // Maximum width for the sidebar

		const newSidebarWidth = Math.max(
			minSidebarWidth,
			Math.min(maxSidebarWidth, mouseX - containerRef.current.offsetLeft)
		);
		setSidebarWidth(newSidebarWidth);
	};

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
