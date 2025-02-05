import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef } from "react";

export function ListToolbar() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button onClick={() => {/* Add indent logic */}}>
        Indent
      </button>
      {/* ... other buttons */}
    </div>
  );
}