import { Plugin, ButtonView } from "ckeditor5";

export default class FileUploadPlugin extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add("attachFile", locale => {
            const button = new ButtonView(locale);

            button.set({
                label: "Attach File",
                withText: true,
                tooltip: true
            });

            button.on("execute", () => {
                window.dispatchEvent(
                    new CustomEvent("ckeditor-upload-file", {
                        detail: { editor }
                    })
                );
            });

            return button;
        });
    }
}