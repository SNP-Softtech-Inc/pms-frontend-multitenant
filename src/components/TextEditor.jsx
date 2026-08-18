import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import EmojiPicker from "emoji-picker-react";
import "quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const emojiButtonRef = useRef(null);
const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write something...",
      // modules: {
      //   toolbar: [  [{ 'font': [] },],
      //     [{ header: [1, 2, 3, false] }],
      //     ["bold", "italic", "underline", "strike"],
      //     [{ color: [] }, { background: [] }],
      //     [{ list: "ordered" }, { list: "bullet" }],
      //     [{ align: [] }],
      //     ["blockquote", "code-block"],
      //     ["link", "image","attach"],
      //     ["clean"],
      //   ],
        
      // },
      modules: {
  toolbar: {
    container: [
      [{ font: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "attach"], // <-- Add attach
      ["clean"],
    ],
    handlers: {
      attach: () => {
        fileInputRef.current?.click();
      },
    },
  },
},
    });

    // Add Emoji button to toolbar
    const toolbar = quillRef.current.getModule("toolbar").container;
// Attachment button
const attachBtn = document.createElement("button");
attachBtn.type = "button";
attachBtn.innerHTML = "📎";
attachBtn.title = "Attach File";
attachBtn.style.fontSize = "18px";
attachBtn.style.padding = "0 8px";

toolbar.appendChild(attachBtn);

attachBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fileInputRef.current?.click();
});
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
const handleAttachment = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      "/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const url = res.data.url;

    const quill = quillRef.current;
    const range = quill.getSelection(true);

    if (file.type.startsWith("image/")) {
      quill.insertEmbed(range.index, "image", url);
    } else {
      quill.insertText(
        range.index,
        file.name,
        "link",
        url
      );
    }

    quill.setSelection(range.index + file.name.length);

  } catch (err) {
    console.error(err);
  }

  e.target.value = "";
};
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
<input
  ref={fileInputRef}
  type="file"
  style={{ display: "none" }}
  onChange={handleAttachment}
/>
      <div ref={editorRef} style={{ minHeight: 300 }} />
    </div>
  );
}


// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// export default function TextEditor({ value, onChange }) {
//   return (
//     <CKEditor
//       editor={ClassicEditor}
//       data={value || ""}
//       onChange={(event, editor) => {
//         const data = editor.getData();
//         onChange(data);
//       }}
//       config={{
//         placeholder: "Write something...",
//         toolbar: [
//           "heading",
//           "|",
//           "bold",
//           "italic",
//           "underline",
//           "|",
//           "link",
//           "bulletedList",
//           "numberedList",
//           "|",
//           "insertTable",
//           "blockQuote",
//           "|",
//           "undo",
//           "redo"
//         ],
//         table: {
//           contentToolbar: [
//             "tableColumn",
//             "tableRow",
//             "mergeTableCells"
//           ]
//         }
//       }}
//     />
//   );
// }