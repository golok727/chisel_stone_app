import "./pages_section_styles.css";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { DocumentIcon as DocumentIconSolid } from "@heroicons/react/24/solid";
import {
	ArrowsPointingInIcon,
	ArrowsPointingOutIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Button from "../../Button";
import { addPage, setCurrentPage } from "../../features/pagesSlice";
import { toggleShowPages } from "../../features/appSlice";
import { KeyboardEvent, useRef } from "react";

const PagesSection = () => {
	const { pages, showPages, currentPageId } = useSelector(
		(state: RootState) => ({
			pages: state.page.pages,
			showPages: state.app.showPages,
			currentPageId: state.page.currentPageId,
		})
	);
	const dispatch = useDispatch();
	const handleAddPage = () => {
		dispatch(addPage());
		dispatch(toggleShowPages(true));
	};
	const handlePagesVisibilityToggle = () => {
		dispatch(toggleShowPages());
	};
	return (
		<section className="sidebar__pages_section">
			<header>
				<div className="pages_button">
					<div className="flex">
						{showPages ? (
							<ArrowsPointingOutIcon width={14} color="orange" />
						) : (
							<ArrowsPointingInIcon width={14} color="red" />
						)}
					</div>
					<Button onClick={handlePagesVisibilityToggle}>
						<h4 className={`light-text ${showPages ? "" : "stroke"}`}>Pages</h4>
					</Button>
				</div>

				<div className="sidebar__pages-section__page-controls">
					<Button onClick={handleAddPage}>
						<PlusIcon width={15} />
					</Button>
				</div>
			</header>
			<div className={`pages_section__pages ${showPages ? "" : "collapsed"}`}>
				{pages && pages.length > 0 ? (
					pages.map((page, idx) => (
						<PageSelector
							isActive={page._id === currentPageId}
							key={idx}
							title={page.title}
							onClick={() => dispatch(setCurrentPage(page._id))}
						/>
					))
				) : (
					<div className="pages__no_pages">No pages</div>
				)}
			</div>
		</section>
	);
};

export default PagesSection;

const PageSelector = ({
	isActive,
	title,
	onClick,
}: {
	title: string;
	isActive: boolean;
	onClick?: () => void;
}) => {
	const btnRef = useRef<HTMLDivElement | null>(null);
	const handleKeyDown = (ev: KeyboardEvent<HTMLDivElement>) => {
		if (ev.key === "Enter" && btnRef.current) btnRef.current.click();
	};
	return (
		<div
			onContextMenu={(e) => {
				e.preventDefault();
			}}
			ref={btnRef}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			className={`pages_section__page flex gap-3 items-center ${
				isActive ? "active" : ""
			}`}
			onClick={onClick}
		>
			{!isActive ? (
				<DocumentIcon width={17} style={{ marginInline: ".4rem" }} />
			) : (
				<DocumentIconSolid width={17} style={{ marginInline: ".4rem" }} />
			)}
			<span>{title}</span>
		</div>
	);
};
