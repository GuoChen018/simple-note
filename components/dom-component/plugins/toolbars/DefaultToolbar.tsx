import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef, useState, useCallback, useEffect } from "react";
import { INSERT_CHECK_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { TextStylesIcon, CheckboxIcon, ImageIcon, ListIcon } from "@/components/icons";
import { View, Pressable } from 'react-native';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND, $isTextNode } from "lexical";
import { mergeRegister } from "@lexical/utils";
import type { LexicalEditor } from 'lexical';

interface DefaultToolbarProps {
  mainEditor: LexicalEditor | null | undefined;
}

export function DefaultToolbar({ mainEditor }: DefaultToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const targetEditor = mainEditor || editor;

  useEffect(() => {
    return mergeRegister(
      targetEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          
          try {
            const anchorNode = selection.anchor.getNode();
            const focusNode = selection.focus.getNode();
            if ($isTextNode(anchorNode) && $isTextNode(focusNode)) {
              const textSize = anchorNode.getTextContentSize();
              if (selection.anchor.offset > textSize || selection.focus.offset > textSize) {
                targetEditor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    selection.setTextNodeRange(
                      anchorNode,
                      Math.min(selection.anchor.offset, textSize),
                      focusNode,
                      Math.min(selection.focus.offset, textSize)
                    );
                  }
                });
              }
            }
          } catch (error) {
            console.warn('Selection validation error:', error);
          }
        });
      })
    );
  }, [targetEditor]);

  const handleTextStyle = () => {
    // This will be handled by the parent component to switch to SelectionToolbar
  };

  const handleList = () => {
    targetEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const handleCheckbox = () => {
    targetEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  };

  const handleImage = () => {
    // Image upload logic will go here
  };

  return (
    <View style={{ flexDirection: 'row', padding: 8, justifyContent: 'space-around' }}>
      <Pressable onPress={handleTextStyle} style={{ padding: 12 }}>
        <TextStylesIcon />
      </Pressable>
      <Pressable onPress={handleCheckbox} style={{ padding: 12 }}>
        <CheckboxIcon />
      </Pressable>
      <Pressable onPress={handleList} style={{ padding: 12 }}>
        <ListIcon />
      </Pressable>
      <Pressable onPress={handleImage} style={{ padding: 12 }}>
        <ImageIcon />
      </Pressable>
    </View>
  );
}