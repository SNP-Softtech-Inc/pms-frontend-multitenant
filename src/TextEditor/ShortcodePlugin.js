import { Plugin, ButtonView } from "ckeditor5";

export default class ShortcodePlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add("shortcodes", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Shortcodes",
        withText: true,
        tooltip: true,
      });

      button.on("execute", () => {
        window.dispatchEvent(
          new CustomEvent("ckeditor-open-shortcodes", {
            detail: { editor },
          })
        );
      });

      return button;
    });
  }
}