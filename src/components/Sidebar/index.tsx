import React, { MouseEventHandler } from "react";
import "./sidebar_styles.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import Button from "../../Button";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import { toggleSidebar } from "../../features/appSlice";
import PagesSection from "./PagesSection";
interface SideBarProps {
	setDragging: React.Dispatch<React.SetStateAction<boolean>>;
	isDragging: boolean;
	onResizerDown: MouseEventHandler<HTMLDivElement>;
}

const SideBar: React.FC<SideBarProps> = ({
	isDragging,
	onResizerDown,
	setDragging,
}) => {
	const { showSidebar, sidebarWidth } = useSelector((state: RootState) => ({
		showSidebar: state.app.showSidebar,
		sidebarWidth: state.app.sidebarWidth,
	}));
	const dispatch = useDispatch();
	const closeSidebar = () => {
		dispatch(toggleSidebar());
	};
	return (
		<div
			className={`app_sidebar ${!showSidebar ? "hidden" : ""}`}
			style={{ width: `${sidebarWidth}px` }}
		>
			{/* Header */}
			<header>
				<h3>Radha's Notes</h3>
				<Button onClick={closeSidebar}>
					<ChevronDoubleLeftIcon width={20} />
				</Button>
			</header>

			<PagesSection />

			<div
				className={`app__resizer ${isDragging ? "dragging" : ""}`}
				onMouseDown={onResizerDown}
				onMouseUp={() => setDragging(false)}
			></div>
		</div>
	);
};

export default SideBar;
