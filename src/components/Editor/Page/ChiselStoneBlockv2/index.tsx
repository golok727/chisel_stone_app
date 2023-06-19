import "./block_styles.css";
import React from "react";
import Button from "../../../../Button";
import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { isTextTypeBlock } from "../../../../config/constants";
import ChiselStoneTextBlock from "./ChiselStoneTextBlock";

interface ChiselStoneBlockProps {
	blockIdx: number;
	block: Block;
}
const ChiselStoneBlock: React.FC<ChiselStoneBlockProps> = ({
	block,
	blockIdx,
}) => {
	return (
		<div className="page__block" tabIndex={-1} data-block-id={block.id}>
			<div className="page__block__actions">
				<Button onClick={() => {}} onKeyDown={() => {}}>
					<PlusIcon width={17} />
				</Button>
				<div className="page__block__actions-move">
					<Squares2X2Icon width={17} />
				</div>
			</div>

			{/*  For Text Block */}
			{isTextTypeBlock(block) && (
				<ChiselStoneTextBlock blockIdx={blockIdx} block={block} />
			)}
		</div>
	);
};

export default ChiselStoneBlock;
