import GraphiQL from "graphiql";
import debounce from "graphiql/dist/utility/debounce";
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "graphiql/graphiql.css";

const OtherReactComponent = () => (
  <React.Fragment>
  </React.Fragment>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.graphiql = React.createRef();

    this.state = {
      // OPTIONAL PARAMETERS
      // GraphQL artifacts
      // query: "",
      // variables: "",
      // response: "",

      // GraphQL Schema
      // If `undefined` is provided, an introspection query is executed
      // using the fetcher.
      // schema: undefined,

      module: "",

      // Useful to determine which operation to run
      // when there are multiple of them.
      // operationName: null,
      // storage: null,
      /// defaultQuery: null,

      // Custom Event Handlers
      // onEditQuery: null,
      // onEditVariables: null,
      /// onEditOperationName: null,

      // GraphiQL automatically fills in leaf nodes when the query
      // does not provide them. Change this if your GraphQL Definitions
      // should behave differently than what"s defined here:
      // (https://github.com/graphql/graphiql/blob/master/src/utility/fillLeafs.js#L75)
      // getDefaultFieldNames: null
    };
  }

  // Example of using the GraphiQL Component API via a toolbar button.
  handleClickPrettifyButton(event) {
    const editor = this.graphiql.current.getQueryEditor();
    const currentText = editor.getValue();
    const { parse, print } = require("graphql");
    const prettyText = print(parse(currentText));
    editor.setValue(prettyText);
  }

  setModule = (key) => () => {
    const item = localStorage.getItem(key);
    const { query } = item !== null ? JSON.parse(item) : {};
    this.setState({ module: key, query });
  };

  fetcher = (graphQLParams) => {
    const { module: prefix } = this.state;
    return fetch(`/graphql/${prefix}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  handleEditQuery = debounce(100, value => {
    const { module: key } = this.state;
    const item = localStorage.getItem(key);
    const data = JSON.parse(item);
    localStorage.setItem(key, JSON.stringify({ ...data, query: value }))
  })

  render() {
    return (
      <GraphiQL
        fetcher={this.fetcher}
        ref={this.graphiql}
        {...this.state}
      >
        <GraphiQL.Logo />
        <GraphiQL.Toolbar>
          <GraphiQL.ToolbarButton
            onClick={this.handlePrettifyQuery}
            title="Prettify Query (Shift-Ctrl-P)"
            label="Prettify"
          />
          <GraphiQL.ToolbarButton
            onClick={this.handleMergeQuery}
            title="Merge Query (Shift-Ctrl-M)"
            label="Merge"
          />
          <GraphiQL.ToolbarButton
            onClick={this.handleToggleHistory}
            title="Show History"
            label="History"
          />
          <GraphiQL.Menu label={this.state.module || 'Module'} title="Select Module" onEditQuery={this.handleEditQuery}>
            <GraphiQL.MenuItem label="starwars" title="StarWars characters" onSelect={this.setModule('starwars')} />
            <GraphiQL.MenuItem label="todo" title="Todo list" onSelect={this.setModule('todo')} />
          </GraphiQL.Menu>
        </GraphiQL.Toolbar>
        <GraphiQL.Footer />
      </GraphiQL>
    );
  }
}

export default App;
