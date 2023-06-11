import React, { MouseEventHandler } from "react";
import "./sidebar_styles.css";

interface SideBarProps {
	width: number;
	setDragging: React.Dispatch<React.SetStateAction<boolean>>;
	onResizerDown: MouseEventHandler<HTMLDivElement>;
}

const SideBar: React.FC<SideBarProps> = ({
	width,
	onResizerDown,
	setDragging,
}) => {
	return (
		<div className="app_sidebar" style={{ width: `${width}px` }}>
			Sidebar
			<div
				className="app__resizer"
				onMouseDown={onResizerDown}
				onMouseUp={() => setDragging(false)}
			></div>
		</div>
	);
};

export default SideBar;
