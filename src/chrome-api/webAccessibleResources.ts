export class WebAccessibleResources {
  /**
   * Gets the URI for a file that needs to be accessed from the extension's process/background script.
   * Use this when accessing files from background.js, content scripts, or other extension processes.
   * For files that need to be accessed from web content, use getFileURIForContent() instead.
   * @param filename The filename relative to the extension root
   * @returns The filename as-is since extension processes can access files directly
   */
  static getFileURIForProcess(filename: string) {
    return filename;
  }

  /**
   * Gets the URI for a file that needs to be accessed from web content.
   * Use this when accessing files from web content, such as in a content script.
   * @param filename The filename relative to the extension root
   * @returns The URI for the file
   */
  static getFileURIForContent(filename: string) {
    return chrome.runtime.getURL(filename);
  }

  static get isAPIAvailable() {
    return chrome.runtime !== undefined;
  }
}
