import { Plugin, ButtonView } from "ckeditor5";

export default class EmojiPlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add("emoji", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "😊",
        tooltip: "Insert Emoji",
        withText: true,
      });

      button.on("execute", () => {
        window.dispatchEvent(
          new CustomEvent("ckeditor-open-emoji", {
            detail: { editor },
          })
        );
      });

      return button;
    });
  }
}