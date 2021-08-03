import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Block, Blocks, EditMode } from "@src/types/content";
import { setCaretToEnd, uid } from "@src/utils/utils";
import EditableBlock from "@components/editablePage/EditableBlock";
import palette from "@src/utils/palette";

interface EditablePageProps {
  blocks: Blocks;
  setBlocks: (blocks: Blocks) => void;
}

const EditablePage = ({ blocks, setBlocks }: EditablePageProps) => {
  const [editMode, setEditMode] = useState<EditMode>({
    command: "",
  });

  useEffect(() => {
    const setFocus = () => {
      const { currentBlock, command } = editMode;
      if (!currentBlock) {
        return;
      }
      if (command === "add" && "ref" in currentBlock) {
        const nextBlock = currentBlock.ref?.nextElementSibling as HTMLElement;
        nextBlock?.focus();
      } else if (command === "delete" && "focus" in currentBlock) {
        setCaretToEnd(currentBlock);
        currentBlock?.focus();
      }
    };

    setFocus();
  }, [blocks, editMode]);

  function updateBlock(updatedBlock: Block) {
    const index = blocks.map((block) => block.id).indexOf(updatedBlock.id);
    const updatedBlocks: Blocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setBlocks(updatedBlocks);
  }

  function addBlock(currentBlock: Block) {
    const newBlock = { id: uid(), html: "", tag: "p" };
    const index = blocks.map((block) => block.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
    setEditMode({
      command: "add",
      currentBlock,
    });
  }

  function deleteBlock(currentBlock: Block) {
    const previousBlock = currentBlock.ref
      ?.previousElementSibling as HTMLElement;
    if (previousBlock) {
      const index = blocks.map((block) => block.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      setEditMode({
        command: "delete",
        currentBlock: previousBlock,
      });
    }
  }

  return (
    <Container>
      {blocks.map((block) => (
        <EditableBlock
          id={block.id}
          key={block.id}
          html={block.html}
          tag={block.tag}
          updateBlock={updateBlock}
          addBlock={addBlock}
          deleteBlock={deleteBlock}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  font-size: 16px;
  padding: 0 calc(96px + env(safe-area-inset-right)) 0
    calc(96px + env(safe-area-inset-left));

  [contenteditable="true"] {
    background-color: ${palette.grey0};
    margin: 1rem 0;
    padding: 5px;

    &:focus {
      outline: 0;
    }
  }
`;

export default EditablePage;
