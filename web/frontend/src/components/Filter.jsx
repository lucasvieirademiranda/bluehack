import React, { Component } from 'react';

import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';
import { Calendar } from 'primereact/components/calendar/Calendar';

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
                    <ContentLoader>
                        {(options) => (
                            <Dropdown
                                    optionLabel="Selecione..."
                                    value={this.state.type}
                                    options={options} 
                                    onChange={ (event) => { this.setState(event.value) } } />
                        )}
                    </ContentLoader>
                </div>
                <div>
                    <div>Subtipo:</div>
                    <ContentLoader>
                        {(options) => (
                            <MultiSelect 
                                         optionLabel="Selecione..."
                                         value={this.state.subType}
                                         options={options}
                                         onChange={ (event) => { this.setState(event.value) } } />
                        )}
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
                    <ContentLoader>
                        {(options) => (
                            <Dropdown 
                                      optionLabel="Selecione..."
                                      value={this.state.responsable}
                                      options={options} 
                                      onChange={ (event) => { this.setState(event.value) } } />
                        )}
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