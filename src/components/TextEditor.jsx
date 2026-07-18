import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import EmojiPicker from "emoji-picker-react";
import "quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write something...",
      modules: {
        toolbar: [  [{ 'font': [] },],
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // Add Emoji button to toolbar
    const toolbar = quillRef.current.getModule("toolbar").container;

    const emojiBtn = document.createElement("button");
    emojiBtn.type = "button";
    emojiBtn.innerHTML = "😊";
    emojiBtn.title = "Emoji";
    emojiBtn.style.fontSize = "18px";
    emojiBtn.style.padding = "0 8px";

    toolbar.appendChild(emojiBtn);

    emojiButtonRef.current = emojiBtn;

    emojiBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setShowEmojiPicker((prev) => !prev);
    });

    quillRef.current.on("text-change", () => {
      onChange?.(quillRef.current.root.innerHTML);
    });
  }, [onChange]);

  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  const handleEmojiClick = (emojiData) => {
    const quill = quillRef.current;

    if (!quill) return;

    const range = quill.getSelection(true);

    const index = range ? range.index : quill.getLength();

    quill.insertText(index, emojiData.emoji);
    quill.setSelection(index + emojiData.emoji.length);

    setShowEmojiPicker(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {showEmojiPicker && (
        <div
          style={{
            position: "absolute",
            top: 45,
            right: 0,
            zIndex: 1000,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div ref={editorRef} style={{ minHeight: 300 }} />
    </div>
  );
}