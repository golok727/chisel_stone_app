import { MouseEventHandler, ReactNode } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
type BlockWithContent<T> = Extract<Block, { content: T }>;
type ExcludeBlocksWithContent<T> = Exclude<
	Block["type"],
	BlockWithContent<T>["type"]
>;

export const isTextTypeBlock = (
	block: Block
): block is Extract<Block, { content: string }> => {
	return typeof block.content === "string";
};
export type StringContentBlockTypes = BlockWithContent<string>["type"];
export const textBlockTypes: StringContentBlockTypes[] = [
	"text",
	"h1",
	"h2",
	"h3",
];

export const getClassNamesForTextBlocks = (
	blockType: TextBlock["type"]
): string => {
	switch (blockType) {
		case "text":
			return "type-text";
		case "h1":
			return "type-h1";

		case "h2":
			return "type-h2";

		case "h3":
			return "type-h3";

		default:
			return "";
	}
};
export const getPlaceHolderTextForTextBlocks = (
	blockType: TextBlock["type"]
): string => {
	switch (blockType) {
		case "text":
			return "Press '/' for commands...";
		case "h1":
			return "Heading 1";

		case "h2":
			return "Heading 2";

		case "h3":
			return "Heading 3";

		default:
			return "";
	}
};

export const dummyPages: ChiselStoneNotebookPage[] = [
	{
		_id: "1234",
		title: "Radha Rani",
		color: "#555",
		content: [
			{
				id: "122",
				type: "h1",
				content: "Radhey Shyam I love krsna",
			},
			{
				id: "asdasd122",
				type: "h1",
				content: "Heading 1",
			},

			// Add more content items here
			{
				id: "234",
				type: "h2",
				content: "Heading 2",
			},
			{
				id: "345",
				type: "h3",
				content: "Heading 3",
			},
			{
				id: "456",
				type: "text",
				content: "Normal Text",
			},
		],
	},

	{
		_id: "asdasascd",
		title: "Krsna",
		color: "#555",

		content: [],
	},

	{
		_id: "3q2234",
		title: "Hello From Chisel Stone",

		color: "#555",

		content: [],
	},
];

export const emptyPageItems: {
	title: string;
	icon: ReactNode;
	onClick?: MouseEventHandler<HTMLDivElement>;
}[] = [
	{
		title: "Empty Page",
		icon: <DocumentIcon width={17} />,
		onClick: () => {
			console.log("Hello");
		},
	},
];
