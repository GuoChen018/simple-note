"use dom";
import React from 'react';
import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';
import "./styles.css";

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ExampleTheme from "./ExampleTheme";

interface EditorProps {
  // name: string;
  dom: {
    matchContents: boolean;
  };
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
}

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
};

export default function Editor({ 
  dom, 
  setPlainText,
  setEditorState
}: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className='editor-container'>
        <div className='editor-inner'>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input'/>}
            placeholder={<div className='placeholder'>Enter some text.....</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState, editor, tags) => {
              editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                setPlainText(textContent);
              });
              setEditorState(JSON.stringify(editorState.toJSON()));
            }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
        
      </div>
      
    </LexicalComposer>
  ); 
}

// export default function Editor({ dom }: EditorProps) {
//   return <div>"DAMNNN"</div>; 
// }