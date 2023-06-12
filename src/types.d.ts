interface BaseBlock {
  id: string;
}

interface TextBlock extends BaseBlock{
  type: 'text';
  content: string;
}

interface Heading1   extends BaseBlock{
  type: 'h1';
  content: string;
}


interface TableBlock extends BaseBlock {
  type: 'table';
  content: string[][];
}

interface ListBlock extends BaseBlock {
  type: 'list';
  content: string[];
}

type Block = TextBlock | TableBlock | ListBlock;

interface ChiselStoneNotebookPage {
  id: string;
  title: string;
  content: Block[]
}