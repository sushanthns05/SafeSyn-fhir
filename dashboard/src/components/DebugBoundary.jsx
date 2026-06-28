import React from 'react';

export class DebugBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    console.error("DEBUG BOUNDARY CAUGHT ERROR:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h2>Component Error</h2>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.info.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
