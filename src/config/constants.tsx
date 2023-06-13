import { MouseEventHandler, ReactNode } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";

export const dummyPages: ChiselStoneNotebookPage[] = [
	{
		_id: "1234",
		title: "Radha Rani",
		color: "#555",
		content: [
			{
				id: "122",
				type: "text",
				content: "Radhey Shyam",
			},
			{
				id: "asdasd122",
				type: "text",
				content: "I love krsna",
			},

			// Add more content items here
			{
				id: "234",
				type: "text",
				content: "Content 3",
			},
			{
				id: "345",
				type: "text",
				content: "Content 4",
			},
			{
				id: "456",
				type: "text",
				content: "Content 5",
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
