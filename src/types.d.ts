interface BaseBlock {
	id: string;
}

interface TextBlock extends BaseBlock {
	type: "text" | "h1" | "h2" | "h3";
	content: string;
}

interface TableBlock extends BaseBlock {
	type: "table";
	content: string[][];
}

interface ListBlock extends BaseBlock {
	type: "list";
	content: string[];
}

type Block = TextBlock | TableBlock | ListBlock;

interface ChiselStoneNotebookPage {
	_id: string;
	title: string;
	color: string;
	content: Block[];
}
