// core packages
import React, { Component } from 'react';
import axios from 'axios';
// application packages
import Pagination from "react-js-pagination";
import { Dropdown } from 'semantic-ui-react';
import qs from 'query-string';
import { get as _get, map as _map, isEmpty as _isEmpty } from 'lodash';

// TODO will be move to environment
const API_URL = 'http://localhost:3015';

export class Graphics extends Component {
    constructor(props) {
        super(props);

        // TODO can be move table data to config.
        this.state = {
            perPageValues: this._prepareOptions([5, 10, 15]),
            locations: [],
            data: [],
            filters: {},
            total: 0,
            limit: 5,
            page: 1,
            orderBy: 'in_frame',
            direction: 'asc'
        };
    }

    async componentDidMount() {
        try {
            await this.prepareQueryParameters();
            await Promise.all([
                this.getLocations(),
                this.renderData()
            ]);
        }catch(e) {
            alert(e);
        }
    }

    async renderData(stateData) {
        if(!_isEmpty(stateData)) {
            await this.setState(stateData);
        }
        // get graphics-markup data from api.
        const result = await this._getData();
        const data = _get(result, 'data.data.results', []);
        const total = _get(result, 'data.data.total', 0);

        await this.setState({
            data,
            total
        });

        // set query parameters to URL.
        await this.setQueryParameters();
    }

    async onPageChange(pageNumber) {
        const stateData = {
            page: pageNumber
        };
        await this.renderData(stateData);
    }

    async onChangeFilter(e, data) {
        const stateData = {
            filters: {location: data.value}
        };
       await this.renderData(stateData);
    }

    async onPerPageChange(e, data) {
        const stateData = {
            limit: data.value
        };
        await this.renderData(stateData);
    }

    async onOrderChange(order) {
        const direction = this.state.orderBy === order ? (this.state.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const stateData = {
            orderBy: order,
            direction: direction
        };
        await this.renderData(stateData);
    }

    // can be move to service
    async getLocations() {
        const result = await axios.get(`${API_URL}/api/locations`);
        const locations = this._prepareOptions(_get(result, 'data.data', []));
        await this.setState({
            locations
        });
    }

    // can be move to service
    async _getData() {
        return axios.get(`${API_URL}/api/graphics-markup`, {params: {
            page: this.state.page,
            limit: this.state.limit,
            filters: this.state.filters,
            orderBy: this.state.orderBy,
            direction: this.state.direction
        }});
    }

    // get and prepare query parameters from URL.
    async prepareQueryParameters() {
        const queryParameters = qs.parse(this.props.location.search);
        await this.setState({
            page: +queryParameters.page || 1,
            limit: +queryParameters.limit || 5,
            orderBy: queryParameters.orderBy || 'in_frame',
            direction: queryParameters.direction || 'asc',
            filters: !_isEmpty(queryParameters.filters) ? JSON.parse(queryParameters.filters) : ''
        });
    }

    // set query parameters to URL.
    async setQueryParameters() {
        const queryParameters = qs.stringify({
            page: this.state.page,
            limit: this.state.limit,
            orderBy: this.state.orderBy,
            direction: this.state.direction,
            filters: !_isEmpty(this.state.filters) ? JSON.stringify(this.state.filters) : null
        });
        await this.props.history.push({
            search: queryParameters
        });
    }

    // Can be move to helper
    _prepareOptions(values) {
        const options = _map(values, (value) => {
            return {
                key: value,
                text: value,
                value: value
            };
        });
        return options;
    }

    // CSS styles will be move to css.
    render() {
        return (
            <div className="App" style={{ margin: 20 }}>
                <div className="container App-content">
                    <h2>Graphics Markup Results</h2>
                    <div className="container">
                        <div className="col-md-12" style={{display: 'flex', alignItems: 'center', paddingRight: '10px', marginBottom: '15px'}}>
                            <div>
                                <Dropdown placeholder='Locations' multiple value={this.state.filters.location || []} selection options={this.state.locations} onChange={this.onChangeFilter.bind(this)} />
                            </div>
                            <div>
                                <Dropdown placeholder='Per Page Items' selection value={this.state.limit} options={this.state.perPageValues} onChange={this.onPerPageChange.bind(this)} />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th><b>in_frame</b>
                                        <i className="fa fa-fw fa-sort" onClick={() => this.onOrderChange('in_frame')}></i>
                                    </th>
                                    <th><b>out_frame</b>
                                        <i className="fa fa-fw fa-sort" onClick={() => this.onOrderChange('out_frame')}></i>
                                    </th>
                                    <th>value</th>
                                    <th>labels</th>
                                    <th>location</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.data.map((item, i) => (
                                    <tr key={i}>
                                        <td style={{width: '6%'}}>{item.in_frame}</td>
                                        <td style={{width: '6%'}}>{item.out_frame}</td>
                                        <td style={{width: '10%'}}>{item.content.value.join(', ')}</td>
                                        <td style={{width: '25%'}}>{item.content.labels.join(', ')}</td>
                                        <td style={{width: '25%'}}>{item.content.location.join(', ')}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={this.state.page}
                            itemsCountPerPage={this.state.limit}
                            totalItemsCount={this.state.total}
                            pageRangeDisplayed={5}
                            onChange={this.onPageChange.bind(this)}
                        />
                    </div>

                    <div>Total Items: {this.state.total}</div>

                </div>
            </div>
        );
    }
}
