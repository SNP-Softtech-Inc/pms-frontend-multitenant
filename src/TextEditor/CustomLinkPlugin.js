// Create a file named CustomLinkPlugin.js
import { Plugin } from 'ckeditor5';

export default class CustomLinkPlugin extends Plugin {
  init() {
    const editor = this.editor;
    
    // Override the default link rendering
    editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on('attribute:link:href', (evt, data, conversionApi) => {
        // Get the link element
        const viewElement = conversionApi.mapper.toViewElement(data.item);
        
        if (viewElement && viewElement.is('element', 'a')) {
          // Add target and rel attributes
          viewElement._setAttribute('target', '_blank');
          viewElement._setAttribute('rel', 'noopener noreferrer');
        }
      }, { priority: 'high' });
    });
  }
}