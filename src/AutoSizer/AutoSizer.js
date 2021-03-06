import * as React from "react";
import createDetectElementResize from "../vendor/detectElementResize";

export default class AutoSizer extends React.Component {
  static defaultProps = {
    onResize: () => {},
    disableHeight: false,
    disableWidth: false,
    style: {}
  };

  state = {
    height: this.props.defaultHeight || 0,
    width: this.props.defaultWidth || 0
  };

  _parentNode;
  _autoSizer;
  _window; // uses any instead of Window because Flow doesn't have window type
  _detectElementResize;

  componentDidMount() {
    const { nonce } = this.props;
    if (
      this._autoSizer &&
      this._autoSizer.parentNode &&
      this._autoSizer.parentNode.ownerDocument &&
      this._autoSizer.parentNode.ownerDocument.defaultView &&
      this._autoSizer.parentNode instanceof
        this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      // Delay access of parentNode until mount.
      // This handles edge-cases where the component has already been unmounted before its ref has been set,
      // As well as libraries like react-lite which have a slightly different lifecycle.
      this._parentNode = this._autoSizer.parentNode;
      this._window = this._autoSizer.parentNode.ownerDocument.defaultView;

      // Defer requiring resize handler in order to support server-side rendering.
      // See issue #41
      this._detectElementResize = createDetectElementResize(
        nonce,
        this._window
      );
      this._detectElementResize.addResizeListener(
        this._parentNode,
        this._onResize
      );

      this._onResize();
    }
  }

  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(
        this._parentNode,
        this._onResize
      );
    }
  }

  render() {
    const {
      children,
      className,
      disableHeight,
      disableWidth,
      style
    } = this.props;
    const { height, width } = this.state;

    // Outer div should not force width/height since that may prevent containers from shrinking.
    // Inner component should overflow and use calculated width/height.
    // See issue #68 for more information.
    const outerStyle = { overflow: "visible" };
    const childParams = {};

    if (!disableHeight) {
      outerStyle.height = 0;
      childParams.height = height;
    }

    if (!disableWidth) {
      outerStyle.width = 0;
      childParams.width = width;
    }

    return (
      <div
        className={className}
        ref={this._setRef}
        style={{
          ...outerStyle,
          ...style
        }}
      >
        {children(childParams)}
      </div>
    );
  }

  _onResize = () => {
    const { disableHeight, disableWidth, onResize } = this.props;

    if (this._parentNode) {
      // Guard against AutoSizer component being removed from the DOM immediately after being added.
      // This can result in invalid style values which can result in NaN values if we don't handle them.
      // See issue #150 for more context.

      const height = this._parentNode.offsetHeight || 0;
      const width = this._parentNode.offsetWidth || 0;

      const win = this._window || window;
      const style = win.getComputedStyle(this._parentNode) || {};
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

      const newHeight = height - paddingTop - paddingBottom;
      const newWidth = width - paddingLeft - paddingRight;

      if (
        (!disableHeight && this.state.height !== newHeight) ||
        (!disableWidth && this.state.width !== newWidth)
      ) {
        this.setState({
          height: height - paddingTop - paddingBottom,
          width: width - paddingLeft - paddingRight
        });

        onResize({ height, width });
      }
    }
  };

  _setRef = autoSizer => {
    this._autoSizer = autoSizer;
  };
}
