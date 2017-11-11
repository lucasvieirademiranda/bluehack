import React, { Component } from 'react';

import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';
import { Calendar } from 'primereact/components/calendar/Calendar';

import { getUrl } from '../util/url';

import ContentLoader from './ContentLoader';

export default class Filter extends Component
{
    state = {
        type: null,
        subType: null,
        startDate: null,
        finishDate: null,
        responsable: null,
        status: null
    };

    render()
    {
        return (
            <div>
                <div>
                    <div style={{fontSize: "14pt", marginBottom: "10px" }}>
                        <i className="fa fa-filter" aria-hidden="true"></i>
                        Filtros
                    </div>
                    <div>Tipo:</div>
                    <ContentLoader url={ getUrl('/occurrenceType/getOccurrenceTypes') }>
                        {(data) => {

                            let options = [];

                            data.forEach(function(element, index) {
                                
                                options.push({
                                    key: index,
                                    value: element.Id,
                                    label: element.Name
                                });

                            });

                            return (
                                <Dropdown
                                    placeholder="Selecione..."
                                    value={this.state.type}
                                    options={options} 
                                    onChange={ (event) => { this.setState({type: event.value}) } } />
                            );

                        }}
                    </ContentLoader>
                </div>
                <div>
                    <div>Subtipo:</div>
                    <ContentLoader url={ getUrl('/occurrenceSubtype/getOccurrenceSubtypes') }>
                        {(data) => {

                            let options = [];

                            data.forEach(function(element, index) {
                                
                                options.push({
                                    key: index,
                                    value: element.Id,
                                    label: element.Name
                                });

                            });

                            return (
                                <MultiSelect 
                                         defaultLabel="Selecione..."
                                         value={this.state.subType}
                                         options={options}
                                         onChange={ (event) => { this.setState({subType: event.value}) } } />
                            );

                        }}
                    </ContentLoader>
                </div>
                <div>
                    <div>Data Inicial:</div>
                    <Calendar 
                              value={this.state.startDate}
                              onChange={ (event) => { this.setState(event.value) } } />
                </div>
                <div>
                    <div>Data Final:</div>
                    <Calendar 
                              value={this.state.startDate}
                              onChange={ (event) => { this.setState(event.value) } } />
                </div>
                <div>
                    <div>Responsável:</div>
                    <ContentLoader url={ getUrl('/user/getUsers') }>
                        {(data) => {

                            let options = [];

                            data.forEach(function(element, index) {
                                
                                options.push({
                                    key: index,
                                    value: element.Id,
                                    label: element.Name
                                });

                            });

                            return (
                                <Dropdown 
                                      optionLabel="Selecione..."
                                      value={this.state.responsable}
                                      options={options} 
                                      onChange={ (event) => { this.setState(event.value) } } />
                            );

                        }}
                    </ContentLoader>
                </div>
                <div>
                    <div>Status:</div>
                    <Dropdown style={{ width: "100%", height: "35px"}}
                                optionLabel="Selecione..."
                                value={this.state.status}
                                onChange={ (event) => { this.setState(event.value) } } />
                </div>

            </div>
        );

    }
}