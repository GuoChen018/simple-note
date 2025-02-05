/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "../styles.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { $isListNode, ListNode } from "@lexical/list";
import { SelectionToolbar } from "./toolbars/SelectionToolbar";
import { ListToolbar } from "./toolbars/ListToolbar";
import { DefaultToolbar } from "./toolbars/DefaultToolbar";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const updateToolbar = useCallback(() => {
    try {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setShowToolbar(false);
        return;
      }

      // Validate selection bounds
      const node = selection.anchor.getNode();
      if (selection.anchor.offset > node.getTextContentSize()) {
        setShowToolbar(false);
        return;
      }

      const textSelected = !selection.isCollapsed();
      setIsTextSelected(textSelected);

      const listParent = node.getParent();
      setIsInList($isListNode(listParent));

      setShowToolbar(true);

      if (textSelected) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
      }
    } catch (error) {
      console.warn('Selection error:', error);
      setShowToolbar(false);
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  if (!showToolbar) return null;
  if (isTextSelected) return <SelectionToolbar />;
  if (isInList) return <ListToolbar />;
  return <DefaultToolbar mainEditor={editor} />;
}
