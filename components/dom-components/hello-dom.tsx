  "use dom";
  console.log('=== hello-dom.tsx: Module loaded ===');

  import "./styles.css";

  import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
  import { LexicalComposer } from "@lexical/react/LexicalComposer";
  import { ContentEditable } from "@lexical/react/LexicalContentEditable";
  import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
  import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
  import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
  import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
  import React, { useEffect } from "react";
  import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

  import ExampleTheme from "./ExampleTheme";
  import ToolbarPlugin from "./plugins/ToolbarPlugin";
  import TreeViewPlugin from "./plugins/TreeViewPlugin";
  import { $getRoot, EditorState, LexicalEditor, ParagraphNode, TextNode } from "lexical";

  const placeholder = "Enter some rich text...";

  console.log("Hello from editor file");

  export default function Editor({
    setPlainText,
    setEditorState,
  }: {
    setPlainText: React.Dispatch<React.SetStateAction<string>>;
    setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  }) {
    const editorConfig = {
      namespace: "React.js Demo",
      nodes: [TextNode, ParagraphNode],
      onError(error: Error) {
        console.error("Editor Error:", error);
      },
      theme: ExampleTheme,
    };

    const onChange = (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const plainText = root.getTextContent();
        setPlainText(plainText);
        setEditorState(JSON.stringify(editorState));
      });
    };

    console.log("Editor: Starting render");
    
    return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
  }
