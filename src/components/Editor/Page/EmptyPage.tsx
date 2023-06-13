import { KeyboardEvent, MouseEventHandler, ReactNode, useRef } from "react";
import "./empty_page_styles.css";
import {
	CursorArrowRippleIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";
import { emptyPageItems } from "../../../config/constants";
const EmptyPage = () => {
	return (
		<div className="editor__empty_page">
			<EmptyPageItem
				title={"Empty Page"}
				icon={<DocumentIcon width={17} />}
				onClick={() => {}}
			/>
		</div>
	);
};

export default EmptyPage;
const EmptyPageItem = ({
	onClick,
	title,
	icon,
}: {
	title: string;
	icon: ReactNode;
	onClick?: MouseEventHandler<HTMLDivElement>;
}) => {
	const btnRef = useRef<HTMLDivElement | null>(null);
	const handleKeyDown = (ev: KeyboardEvent<HTMLDivElement>) => {
		if (ev.key === "Enter" && btnRef.current) btnRef.current.click();
	};

	return (
		<div
			ref={btnRef}
			role="button"
			tabIndex={0}
			className="editor__empty_page__item"
			onKeyDown={handleKeyDown}
			onClick={onClick}
		>
			<div className="editor__empty_page__item_left">
				{icon}
				<span>{title}</span>
			</div>
			<CursorArrowRippleIcon className="click-icon" width={15} />
		</div>
	);
};
