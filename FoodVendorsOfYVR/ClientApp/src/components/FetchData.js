import React, { Component } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from "react-google-maps";
import APIResults from './APIResults';

function Map(props) {
    return (
        <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: 49.2820, lng: -123.1171 }} >
            {props.foodVendors.map(
                vendor => (
                    <Marker
                        key={vendor.key}
                        title={vendor.business_name}
                        position={{ lat: vendor.latitude, lng: vendor.longitude }}
                        onClick={() => props.markerClickHandler(vendor)} />
                )
            )}
        </GoogleMap>
    );
}


// withScript basically adds the required js to embed map in page

// withGoogleMap(Map) pushes the result of the Map function above
// into the embedded google map js container 
const WrappedMap = withScriptjs(withGoogleMap(props => (Map(props))));


export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor (props) {
    super(props);
      this.state = {
          foodVendors: [],
          loading: true,
      };

    }

    componentDidMount() {
        fetch('api/FoodVendor/FoodVendors')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    foodVendors: data,
                    loading: false,
                });
            });
    }


  render () {

      return (
          <div>
              <h1>Food Vendors</h1>
              <WrappedMap
                  foodVendors={this.state.foodVendors}
                  markerClickHandler={this.markerClickHandler}
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyD-BBRfry246W98i9sHb-TnI6_FJqQ70vQ`}
                  loadingElement={<div style={{ height: '100%' }} />}
                  containerElement={<div style={{ height: '400px' }} />}
                  mapElement={<div style={{ height: '100%' }} />}
              />
             {this.state.loading ? "" : <APIResults data={this.state.foodVendors} />} 
          </div>
      );

  }
}
