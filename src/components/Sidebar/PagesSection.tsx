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
import {
	setCurrentFocusPageIdx,
	toggleShowPages,
} from "../../features/appSlice";
import { KeyboardEvent, useEffect, useRef } from "react";

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
							key={page._id}
							title={page.title}
							idx={idx}
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
	idx,
	onClick,
}: {
	title: string;
	idx: number;
	isActive: boolean;
	onClick?: () => void;
}) => {
	const btnRef = useRef<HTMLDivElement | null>(null);
	const { pagesLength, currentFocusPageIdx } = useSelector(
		(state: RootState) => ({
			pagesLength: state.page.pages.length,
			currentFocusPageIdx: state.app.currentFocusPageIdx,
		})
	);

	const handleKeyDown = (ev: KeyboardEvent<HTMLDivElement>) => {
		if (currentFocusPageIdx === null) return;
		if (ev.key === "Enter" && btnRef.current) btnRef.current.click();

		if (
			ev.key === "ArrowDown" ||
			ev.key === "ArrowUp" ||
			ev.key.toLowerCase() === "w" ||
			ev.key.toLowerCase() === "s"
		) {
			const step =
				ev.key === "ArrowDown" || ev.key.toLowerCase() === "s" ? 1 : -1;

			const focusPage = Math.min(
				Math.max(0, currentFocusPageIdx + step),
				pagesLength - 1
			);

			dispatch(setCurrentFocusPageIdx(focusPage));
		}
	};
	const dispatch = useDispatch();

	const handleFocus = () => {
		dispatch(setCurrentFocusPageIdx(idx));
	};

	useEffect(() => {
		if (!btnRef.current) return;
		if (currentFocusPageIdx === idx) btnRef.current.focus();
	}, [currentFocusPageIdx]);
	const handleBlur = () => {};
	return (
		<div
			onFocus={handleFocus}
			onBlur={handleBlur}
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
