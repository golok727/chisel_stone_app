interface BaseBlock {
	id: string;
}

interface TextBlock extends BaseBlock {
	type: "text";
	content: string;
}

interface Heading1 extends BaseBlock {
	type: "h1";
	content: string;
}

interface Heading2 extends BaseBlock {
	type: "h2";
	content: string;
}

interface Heading3 extends BaseBlock {
	type: "h3";
	content: string;
}

interface Heading1 extends BaseBlock {
	type: "h1";
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

type Block =
	| TextBlock
	| Heading1
	| Heading2
	| Heading3
	| TableBlock
	| ListBlock;

interface ChiselStoneNotebookPage {
	_id: string;
	title: string;
	color: string;
	content: Block[];
}
