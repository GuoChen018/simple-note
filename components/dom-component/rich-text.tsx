"use dom";
import "./styles.css";
import React, { useEffect, useRef, useState } from "react";
import {
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import {
  RichTextPlugin
} from "@lexical/react/LexicalRichTextPlugin";
import {
  ContentEditable
} from "@lexical/react/LexicalContentEditable";
import {
  LexicalErrorBoundary
} from "@lexical/react/LexicalErrorBoundary";
import {
  HistoryPlugin
} from "@lexical/react/LexicalHistoryPlugin";
import {
  AutoFocusPlugin
} from "@lexical/react/LexicalAutoFocusPlugin";
import {
  OnChangePlugin
} from "@lexical/react/LexicalOnChangePlugin";
import {
  CheckListPlugin
} from "@lexical/react/LexicalCheckListPlugin";
import {
  ListPlugin
} from "@lexical/react/LexicalListPlugin";
import { $getRoot } from "lexical";
import { ListNode, ListItemNode } from "@lexical/list";
import ExampleTheme from "./ExampleTheme";
import { View, ScrollView, KeyboardAvoidingView, Platform, Text } from "react-native";
import { DefaultToolbar } from "@/components/dom-component/plugins/toolbars/DefaultToolbar"; // Adjust the import if needed
import type { LexicalEditor } from 'lexical';

const placeholder = "Enter some text...";

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [ListNode, ListItemNode],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

export default function Editor({
  setPlainText,
  setEditorState,
  editorRef,
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  editorRef: React.MutableRefObject<LexicalEditor | null>;
}) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <View style={{ flex: 1 }}>
          {/* Scrollable Editor */}
          <ScrollView
            style={{ flex: 1, paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="editor-container">
              <View className="editor-inner">
                <RichTextPlugin
                  contentEditable={
                    <View className="editor-input-wrapper">
                      <ContentEditable
                        className="editor-input"
                        aria-placeholder={placeholder}
                        placeholder={
                          <Text style={{ color: '#999' }}>
                            {placeholder}
                          </Text>
                        }
                      />
                    </View>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />

                {/* Handle Editor Changes */}
                <OnChangePlugin
                  onChange={(editorState, editor) => {
                    // console.log("Updating editorRef...");
                    editorRef.current = editor;
                    // console.log("Editor Ref:", editorRef.current);

                    editorState.read(() => {
                      const root = $getRoot();
                      const textContent = root.getTextContent();
                      setPlainText(textContent);
                    });

                    setEditorState(JSON.stringify(editorState.toJSON()));
                  }}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <ListPlugin />
                <CheckListPlugin />
              </View>
            </View>
          </ScrollView>

          {/* Always render toolbar for debugging */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: "#E5E5E5",
              zIndex: 1000,
              elevation: 3,
              height: 50, // Add fixed height
            }}
          >
            <DefaultToolbar mainEditor={editorRef.current} />
          </View>
        </View>
      </LexicalComposer>
    </KeyboardAvoidingView>
  );
}
