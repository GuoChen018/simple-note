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

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { $getRoot, EditorState, LexicalEditor } from "lexical";

const placeholder = "Enter some rich text...";

interface DOMConfig {
  // style: {
  //   width?: string | number;
  //   height?: string | number;
  // };
  matchContents: boolean;
}

interface EditorProps {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  dom: DOMConfig;
}

export default function Editor({
  setPlainText,
  setEditorState,
  dom
}: EditorProps) {

  const editorConfig = {
    namespace: "React.js Demo",
    nodes: [],
    onError(error: Error) {
      console.error("Editor Error:", error);
    },
    theme: ExampleTheme,
    editorState: undefined,
    dom
  };
  
  return (
    <div>
      <div>testing</div>
      <LexicalComposer initialConfig={editorConfig}>
        {(() => { console.log('In Lexical Composer'); return null; })()}
        <ToolbarPlugin /> 
        <RichTextPlugin
            contentEditable={
            <ContentEditable
              className="editor-input"
              aria-placeholder={placeholder}
              placeholder={
                <div className="editor-placeholder">{placeholder}</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
    
  );
}