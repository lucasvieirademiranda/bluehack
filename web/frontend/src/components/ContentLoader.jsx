import React, { Component } from 'react';

import { fetch } from 'ui-stack/request';

import styles from './ContentLoader.module.scss';

export default class ContentLoader extends Component
{
    state = {
        loading: true,
        error: false,
        data: [],
        errors: []
    }

    componentDidMount()
    {
        this.load();
    }

    componentWillReceiveProps(nextProps)
    {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps))
        {
            this.setState({
                loading: true,
                error: false,
                data: [],
                errors: []
            });
        }
    }

    componentDidUpdate()
    {
        if(this.state.loading)
            this.load();
    }

    onClick = (event) => {

        this.setState({
            loading: true,
            error: false,
            data: []
        });

    }

    load = () => {
        
        const {
            method,
            url,
            query,
            data,
            type,
            headers
        } = this.props;
                
        let request = fetch({ method, url, query, data, type, headers });

        request.then(this.success)
               .catch(this.errors);

    }

    success = (response) => {
        
        var data = response.body;

        if (data.Success)
        {
            this.setState({
                loading: false,
                error: false,
                data: data.Data,
                errors: []
            });
        }
        else
        {
            this.setState({
                loading: false,
                error: false,
                data: [],
                errors: data.Errors
            });
        }

    }

    errors = (error) => {
        
        this.setState({
            loading: false,
            error: true,
            data: [],
            errors: [error.message]
        });

    }

    render() {
        
        const {
            method,
            url,
            query,
            data,
            type,
            headers,
            children,
            ...props
        } = this.props;
        
        let instance = null;

        if (children && typeof (children) == 'function')
            instance = children(this.state.data);
        else
            instance = '';

        return (
            <div style={{ position: "relative"}}>
                {
                    this.state.loading &&
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingBackground}></div>
                        <span className={styles.loadingLoader}>
                            <i className="fa fa-circle-o-notch fa-spin fa-1x fa-fw"></i>
                        </span>
                    </div>
                }
                {
                    this.state.error &&
                    <div className={styles.errorContainer}>
                        <div className={styles.errorBackground}></div>
                        <span className={styles.errorText}>
                            Falha ao carregar
                            <a className={styles.errorRefresh}
                               href="javascript:void();"
                               onClick={this.onClick}>
                                &nbsp;<i className="fa fa-refresh"></i>
                            </a>
                        </span>
                    </div>
                }
                { instance }
            </div>
        );

    }
}