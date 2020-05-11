import React, { Component } from 'react';

   class APIResults extends Component {
    constructor(props) {
    super(props);
    this.state = {
        foodVendors: props.data,
        currentPage: 1,
        curentIndex: 0,
        endIndex: 10,
        searchTerm: "",
        searchValue: "",
        searchToggle: false
    };

    this.onSortChange = this.onSortChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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



handleChangePage(direction) {
    if (direction === 'l' && this.state.curentIndex - 10 > 0) {
        this.setState({ curentIndex: this.state.curentIndex - 10, endIndex: this.state.endIndex - 10 });
    } else if (direction === 'r' && this.state.endIndex + 10 < 91) {
        this.setState({ curentIndex: this.state.curentIndex + 10, endIndex: this.state.endIndex + 10 });
    }
}

markerClickHandler(foodVendor) {
    fetch('api/FoodVendor/FoodVendor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(foodVendor)
    })
        .then(response => { console.log(response); })
}

       handleSearchChange(event) {
        event.preventDefault()
    if (event.target.value !== "") {
      return  this.setState({ searchTerm: event.target.value });
    }
}

handleSubmit(event) {
    return window.location.reload()
}


cleanPage() {
    return window.location.reload();
}

       render() {
           let paginatedVendors = this.state.foodVendors.slice(this.state.curentIndex, this.state.endIndex);
           let searchVal = this.state.searchTerm.toLowerCase();

           if (searchVal !== "") {
               let regex = RegExp(`${searchVal}*`);
               let regexArray = this.state.foodVendors.filter(function (i) { return regex.test(i.description.toLowerCase()) == true || regex.test(i.business_name.toLowerCase()) == true })
               paginatedVendors = regexArray.slice(this.state.curentIndex, this.state.endIndex);
           } 

           return (<div>

               <form className="form-inline flex-nowrap" onSubmit={this.handleSubmit} style={{ marginTop: '2%' }}>
                   <input id="input" className="form-control mr-sm-2" type="search" placeholder="Search by field." aria-label="Search" name="search"  onChange={this.handleSearchChange} />
                   <button className="btn btn-outline-success my-2 my-sm-0" type="submit" value="submit" >Clear Search.</button>
               </form>

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
                       {paginatedVendors.map(vendor =>
                           <tr key={vendor.key}>
                               <td>{vendor.business_name}</td>
                               <td>{vendor.description}</td>
                               <td>{vendor.longitude}</td>
                               <td>{vendor.latitude}</td>
                           </tr>
                       )}
                   </tbody>
               </table>

        <span className="page-item" className={"btn btn-primary"} style={{ marginRight: '8%' }} href="javascript:void(0);" onClick={() => this.handleChangePage('l')}>Back</span>
        <span className="page-item" className={"btn btn-primary"} href="javascript:void(0);" onClick={() => this.handleChangePage('r')}>Next</span>
        </div>
    )
    }
}

export default APIResults;
