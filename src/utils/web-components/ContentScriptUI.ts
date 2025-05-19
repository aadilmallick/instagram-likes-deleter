import { css, CSSVariablesManager, DOM, html } from "../Dom";
import WebComponent from "./WebComponent";

interface StaticProps {}

const observableAttributes = [] as readonly string[];
export class ContentScriptUI extends WebComponent {
  static tagName = "content-script-ui" as const;

  constructor() {
    super({
      templateId: ContentScriptUI.tagName,
    });
  }

  static override get CSSContent() {
    return css``;
  }

  static registerSelf() {
    WebComponent.register(this.tagName, this);
  }

  static override get HTMLContent() {
    return html``;
  }

  static manualCreation() {
    // 1) add css to head
    const styles = DOM.addStyleTag(this.CSSContent);
    styles.id = `${this.tagName}-camera-iframe-styles`;

    // 2) get element
    const element = DOM.createDomElement(this.HTMLContent);
    return element;
  }

  static manualDestruction() {
    // 1) remove styles
    // 2) remove elements
  }

  override connectedCallback(): void {
    super.connectedCallback();
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [ContentScriptUI.tagName]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & StaticProps,
        HTMLElement
      >;
    }
  }
}
