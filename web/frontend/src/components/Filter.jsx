import React, { Component } from 'react';

import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Button } from 'primereact/components/button/Button';

import { getUrl } from '../util/url';

import ContentLoader from './ContentLoader';

export default class Filter extends Component
{
    state = {
        occurrence_type_id: null,
        occurrence_subtype_id: null,
        start_date: null,
        finish_date: null,
        responsable_user_id: null,
        status: null
    };

    render()
    {
        const {
            label,
            onClick,
            ...props,
        } = this.props;

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
                                    value={this.state.occurrence_type_id}
                                    options={options} 
                                    onChange={ (event) => { this.setState({occurrence_type_id: event.value}) } } />
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
                                         value={this.state.occurrence_subtype_id}
                                         options={options}
                                         onChange={ (event) => { this.setState({occurrence_subtype_id: event.value}) } } />
                            );

                        }}
                    </ContentLoader>
                </div>
                <div>
                    <div>Data Inicial:</div>
                    <Calendar 
                              value={this.state.start_date}
                              onChange={ (event) => { this.setState({start_date: event.value}) } } />
                </div>
                <div>
                    <div>Data Final:</div>
                    <Calendar 
                              value={this.state.finish_date}
                              onChange={ (event) => { this.setState({finish_date: event.value}) } } />
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
                                    label: element.UserName
                                });

                            });

                            return (
                                <Dropdown 
                                      placeholder="Selecione..."
                                      value={this.state.responsable_user_id}
                                      options={options} 
                                      onChange={ (event) => { this.setState({responsable_user_id: event.value }) } } />
                            );

                        }}
                    </ContentLoader>
                </div>
                <div>
                    <div>Status:</div>
                    <Dropdown 
                        placeholder="Selecione..."
                        value={this.state.status}
                        options={[
                            {key: 0, value: 1, label: 'ABERTO'},
                            {key: 1, value: 2, label: 'EM ANÁLISE'},
                            {key: 2, value: 3, label: 'PARA ATENDIMENTO'},
                            {key: 3, value: 4, label: 'EM ATENDIMENTO'},
                            {key: 4, value: 5, label: 'CONCLUÍDA'}
                        ]} 
                        onChange={ (event) => { this.setState({status: event.value }) } } />
                </div>
                <div>
                    <Button label="Filtrar" onClick={() => { onClick(this.state) }} {...props} />
                </div>

            </div>
        );

    }
}