import React, { Component } from 'react';

import ReactAudioPlayer from 'react-audio-player';

import { Button } from 'primereact/components/button/Button';
import { fetch } from 'ui-stack/request';
import { getUrl } from '../util/url';

import styles from './WatsonChat.module.css';

export default class WatsonChat extends Component
{
    state = {
        data: [],
        file: '',
        input: '',
        loading: false,
        error: false
    }

    componentDidMount = () => {

        this.ask();

    };

    onClick = (event) => {
      
        this.ask();

    };

    ask = () => {

        const {
            data,
            input
        } = this.state;

        let url = getUrl("/conversation/ask");

        let success = (response) => {

            const {
                data
            } = this.state;

            let currentResponse = response.body;

            if (currentResponse.Success)
            {
                let newData = data.concat([]);

                newData.push("Isabela: " + currentResponse.Data.Text);

                let file = currentResponse.Data.File;

                this.setState({
                    file: file,
                    data: newData, 
                    loading: false,
                    error: false
                });
            }
            else
            {
                this.setState({
                    loading: false,
                    error: true,
                });
            }

        };

        let error = (error) => {
            
            this.setState({
                loading: false,
                error: true,
            });

        };

        let request = fetch({ method: "post", url: url, query: null, data: { input: input } });

        request.then(success)
               .catch(error);

        let newData = [];

        if  (input)
        {
            newData = data.concat([]);
            newData.push("Você: " + input);
        }

        this.setState({
            data: newData,
            input: '',
            loading: true,
            error: false
        });


    };

    render = () => {

        const {
            data,
            file
        } = this.state;

        return (

            <div className={styles.container}>
                <div className={styles.chatContainer}>
                    {data.map((message, index) => (
                        <div key={index}>{message}</div>
                    ))}
                    { file &&
                      <ReactAudioPlayer src={ getUrl(file) } autoPlay />}
                </div>
                <div className={styles.inputContainer}>
                    <textarea className={styles.input} 
                              onChange={(event) => { this.setState({input: event.target.value}); }  } 
                              value={this.state.input} />
                </div>
                <div>
                    <Button label="Enviar" onClick={this.onClick} />
                </div>
            </div>

        );

    };
}