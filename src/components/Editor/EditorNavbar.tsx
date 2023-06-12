import React from "react";
import {
	ChatBubbleBottomCenterIcon,
	StarIcon,
	EllipsisHorizontalCircleIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";
import "./editor_navbar_styles.css";
import Button from "../../Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { toggleSidebar } from "../../features/appSlice";
import { getCurrentPage } from "../../features/pagesSlice";

const EditorNavbar = () => {
	const { appStatus, showSidebar } = useSelector((state: RootState) => ({
		showSidebar: state.app.showSidebar,
		appStatus: state.app.appStatus,
	}));
	const currentPage = useSelector(getCurrentPage);

	const dispatch = useDispatch();
	const handleShowSidebar = () => {
		dispatch(toggleSidebar());
	};
	return (
		<div className="editor__navbar">
			<div className="editor__navbar_left">
				{!showSidebar && (
					<Button onClick={handleShowSidebar}>
						<Bars3Icon width={20} />
					</Button>
				)}
				{currentPage && <span>{currentPage.title}</span>}
			</div>
			<div className="editor__navbar_right">
				<span className="light-text">{appStatus}</span>
				<div className="flex gap-3">
					<Button>Save</Button>
					<Button>
						<ChatBubbleBottomCenterIcon width={20} />
					</Button>

					<Button>
						<StarIcon width={20} />
					</Button>

					<Button>
						<EllipsisHorizontalCircleIcon width={20} />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EditorNavbar;
