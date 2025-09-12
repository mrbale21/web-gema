"use client";
import React, { useEffect, useRef } from "react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const BlogTextEditor = ({
  value = "",
  onChange,
  placeholder = "Tulis konten di sini...",
  height = "300px",
}: Props) => {
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && (window as any).CKEDITOR) {
      const CKEDITOR = (window as any).CKEDITOR;

      if (CKEDITOR.instances[editorRef.current.id]) {
        CKEDITOR.instances[editorRef.current.id].destroy(true);
      }

      instanceRef.current = CKEDITOR.replace(editorRef.current.id, {
        height,
        // 🔑 aktifkan plugin placeholder
        extraPlugins:
          "editorplaceholder,autogrow,colorbutton,colordialog,justify,font,print,tableresize",
        removePlugins: "elementspath",
        resize_enabled: true,
        autoGrow_minHeight: 200,
        autoGrow_maxHeight: 600,
        toolbarCanCollapse: true,
        versionCheck: false,
        // 🔑 isi placeholder
        editorplaceholder: placeholder,
        toolbar: [
          {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "Undo", "Redo"],
          },
          { name: "editing", items: ["Find", "Replace", "SelectAll", "Scayt"] },
          {
            name: "basicstyles",
            items: [
              "Bold",
              "Italic",
              "Underline",
              "Strike",
              "-",
              "RemoveFormat",
            ],
          },
          {
            name: "paragraph",
            items: [
              "NumberedList",
              "BulletedList",
              "-",
              "Outdent",
              "Indent",
              "-",
              "Blockquote",
            ],
          },
          {
            name: "align",
            items: [
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
            ],
          },
          { name: "links", items: ["Link", "Unlink", "Anchor"] },
          {
            name: "insert",
            items: [
              "Image",
              "Table",
              "HorizontalRule",
              "Smiley",
              "SpecialChar",
              "PageBreak",
            ],
          },
          "/",
          { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
          { name: "colors", items: ["TextColor", "BGColor"] },
          { name: "tools", items: ["Maximize", "ShowBlocks", "Source"] },
        ],
      });

      instanceRef.current.setData(value);

      instanceRef.current.on("change", () => {
        const data = instanceRef.current.getData();
        onChange?.(data);
      });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy(true);
      }
    };
  }, [editorRef]);

  return (
    <div className="w-full">
      {/* textarea akan diganti CKEditor */}
      <textarea id="editor1" ref={editorRef} defaultValue={value} />
    </div>
  );
};

export default BlogTextEditor;
