// Read a ZIP in the browser, for the migration import (zipImport.js).
//
// zip.js reads the ZIP's directory from the end of the file and each entry
// only when asked, through Blob slices, so a multi-GB ZIP is never loaded
// into memory whole - JSZip, used elsewhere in the app, would.
import { BlobReader, BlobWriter, ZipReader, configure } from "@zip.js/zip.js";

// Decompress on the page itself (with the browser's own DecompressionStream
// where it has one). zip.js's web workers would need their script served
// separately, which Create React App's build does not do.
configure({ useWebWorkers: false });

/**
 * The ZIP's entries in the shape runImport expects, plus close() for when
 * the import is over.
 */
export const readZipEntries = async (file) => {
  const reader = new ZipReader(new BlobReader(file));
  const entries = await reader.getEntries();

  return {
    entries: entries.map((entry) => ({
      path: entry.filename,
      size: entry.uncompressedSize,
      directory: entry.directory,
      encrypted: entry.encrypted,
      read: () => entry.getData(new BlobWriter()),
    })),
    close: () => reader.close().catch(() => {}),
  };
};
