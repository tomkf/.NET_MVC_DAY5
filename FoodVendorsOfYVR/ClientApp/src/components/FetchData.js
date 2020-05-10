import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor (props) {
    super(props);
      this.state = { foodVendors: [], loading: true };
      this.onSortChange = this.onSortChange.bind(this);

      fetch('api/FoodVendor/FoodVendors')
      .then(response => response.json())
      .then(data => {
        this.setState({ foodVendors: data, loading: false });
      });
    }

    onSortChange(sortParam) {
        let sortedVendors;

        if (sortParam === 'name') {
            if (this.state.nameSort === 'asc') {
                this.setState({ nameSort: 'desc', descriptionSort: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.business_name === null) - (b.business_name === null) || +(a.business_name > b.business_name) || -(a.business_name < b.business_name)
                });
            } else {
                this.setState({ nameSort: 'asc', descriptionSort: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.business_name === null) - (b.business_name === null) || -(a.business_name > b.business_name) || +(a.business_name < b.business_name)
                });
            }
        } else {
            if (this.state.descriptionSort === 'asc') {
                this.setState({ nameSort: 'asc', descriptionSort: 'desc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.description === null) - (b.description === null) || +(a.description > b.description) || -(a.description < b.description)
                });
            } else {
                this.setState({ nameSort: 'asc', descriptionSort: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.description === null) - (b.description === null) || -(a.description > b.description) || +(a.description < b.description)
                });
            }
        }

        this.setState({ foodVendors: sortedVendors });
    }

     renderFoodVendorsTable(foodVendors) {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th><a href="javascript:void(0);" onClick={() => this.onSortChange('name')}>Name (click to sort)</a></th>
            <th><a href="javascript:void(0);" onClick={() => this.onSortChange('description')}>Description (click to sort)</a></th>
            <th>Longitude</th>
            <th>Latitude</th>
          </tr>
        </thead>
        <tbody>
                {foodVendors.map(vendor =>
            <tr key={vendor.key}>
              <td>{vendor.business_name}</td>
              <td>{vendor.description}</td>
              <td>{vendor.longitude}</td>
              <td>{vendor.latitude}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : this.renderFoodVendorsTable(this.state.foodVendors);

    return (
      <div>
        <h1>Food Vendors of YVR:</h1>
        <p>This component demonstrates fetching data from the .NET server.</p>
        {contents}
      </div>
    );
  }
}
