import React, { Component } from "react";
import places from "places.js";

class PlaceInput extends Component {
  constructor(props) {
    super(props);
    this.state = { location: props.location };
    this.input = React.createRef();
  }

  componentDidMount() {
    this.placesAutocomplete = places({
      appId: "plB2AM11RFMX",
      apiKey: "56bec93e5943c316e06f76fe6fb06f0c",
      container: this.input.current,
      templates: {
        value: function(suggestion) {
          return suggestion.name;
        }
      }
    });
    this.placesAutocomplete.on("change", e =>
      this.setState({ location: e.suggestion.name })
    );
  }

  render() {
    return (
      <div>
        <input type="hidden" value={this.state.location} {...this.props} />
        <input
          ref={this.input}
          type="search"
          id="address-input"
          defaultValue={this.state.location}
        />
      </div>
    );
  }
}

export default PlaceInput;
