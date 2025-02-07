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
  import React from "react";

  import ExampleTheme from "./ExampleTheme";
  import ToolbarPlugin from "./plugins/ToolbarPlugin";
  import TreeViewPlugin from "./plugins/TreeViewPlugin";
  import { $getRoot, EditorState, LexicalEditor, TextNode } from "lexical";

  const placeholder = "Enter some rich text...";

  console.log("Hello from editor file");

  const editorConfig = {
    namespace: "React.js Demo",
    nodes: [TextNode],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    // The editor theme
    theme: ExampleTheme,
  };
  export default function Editor({
    setPlainText,
    setEditorState,
  }: {
    setPlainText: React.Dispatch<React.SetStateAction<string>>;
    setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  }) {
    console.log("Editor: Starting render");

    // Handle editor changes
    const onChange = (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const plainText = root.getTextContent();
        setPlainText(plainText);
        setEditorState(JSON.stringify(editorState));
      });
    };

    return (
      <div>
        Test Editor
      </div>
    );
  }
