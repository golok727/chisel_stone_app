import React, { MouseEventHandler } from "react";
import "./sidebar_styles.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import Button from "../../Button";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import { toggleSidebar } from "../../features/appSlice";
import PagesSection from "./PagesSection";
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
	const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
	const dispatch = useDispatch();
	const closeSidebar = () => {
		dispatch(toggleSidebar());
	};
	return (
		<div
			className={`app_sidebar ${!showSidebar ? "hidden" : ""}`}
			style={{ width: `${width}px` }}
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
				className="app__resizer"
				onMouseDown={onResizerDown}
				onMouseUp={() => setDragging(false)}
			></div>
		</div>
	);
};

export default SideBar;
