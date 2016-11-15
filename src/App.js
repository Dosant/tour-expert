import React, { Component } from 'react';
import Spinner from './Spinner/Spinner';
import swal from 'sweetalert';
import { alg, getLogs } from './alg';
import info from '../data/info.json';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isFinished: false,
            question: null,
            result: null
        };
    }

    start() {
        this.fakeLoading()
            .then(() => {
                const result = alg();
                this.setState({
                    nextQuestion: result
                });
            });
    }

    answer(answer) {
        this.fakeLoading()
            .then(() => {
                const result = alg(this.state.nextQuestion.question, answer);
                if (result.isFinished) {
                    this.setState({
                        isFinished: true,
                        result: result.result,
                        nextQuestion: null
                    });
                } else {
                    this.setState({
                        nextQuestion: result
                    });
                }
            });
    }

    render() {
        return (
            <div className="container-flex">
            {this.state.isLoading && (
                <div className="container card">
                    <Spinner loading={this.state.isLoading} />
                </div>
            )}
                <div className="container card" hidden={this.state.isLoading}>
                    {!this.state.nextQuestion && !this.state.isFinished &&
                        (
                            <div className="center-button-container card__title">
                                <p>
                                    Привествуем вас в экспертной системе по выбору места для отдыха.
                                    <br />
                                    Отвечая на вопросы, расскажите системе о ваших пожеланиях.
                                    <br />
                                    Чтобы начать, нажмите кнопку
                                </p>
                                <button onClick={this.start.bind(this)}>Начать</button>
                            </div>
                        )
                    }

                    {this.state.nextQuestion &&
                        (<div className="container">
                            <p className="card__title">
                                {this.state.nextQuestion.feature.question}
                            </p>
                            <div className="center-button-container">
                                {this.state.nextQuestion.feature.values.map((value) => {
                                    const viewValue = (typeof value === 'boolean' ? (value ? 'Да' : 'Нет') : value);
                                    return (
                                        <button key={viewValue} onClick={() => this.answer(value)}>
                                            {viewValue}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        )
                    }

                    {this.state.isFinished && this.state.result && (
                        <div className="container">
                            <p className="card__title">
                                Вам отлично подойдет {this.state.result}
                            </p>
                            <p>
                                {info[this.state.result].description}
                            </p>
                            <a target="_blank" href={info[this.state.result].url}>{info[this.state.result].title}</a>
                            <div style={{'marginTop': '20px'}}>
                                <button onClick={() => window.location.reload()}>
                                        Еще Раз
                                </button>
                            </div>
                        </div>
                    )}

                    {this.state.isFinished && !this.state.result && (
                        <div className="container">
                            <p className="card__title">
                                Попробуйте еще :(
                                <br/>
                                Мы не смогли подобрать тур под ваши капризы.
                            </p>
                            <div className="center-button-container">
                                <button onClick={() => window.location.reload()}>
                                    Ясно. Понятно.
                                </button>
                            </div>
                        </div>
                    )}

                    {
                        this.state.isFinished && (
                            <div className="center-button-container">
                                <button className="log-button" onClick={this.showLogs} >
                                    Посмотреть Логи
                                </button>
                            </div>
                        )
                    }

                </div>
            </div>
        );
    }

    showLogs() {
        const logs = getLogs();
        const w = window.open('', 'logs');
        w.document.body.innerHTML = `<code><pre>${JSON.stringify(logs, null, 4)}</pre></code>`;
    }

    showErrorMessage(msg) {
        swal({
            title: "Ошибка!",
            text: msg || "Что-то пошло не так.",
            type: "error",
            confirmButtonText: "Понятно.."
        });
    }

    fakeLoading() {
        this.setState({
            isLoading: true
        });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        }).then(() => {
            this.setState({
                isLoading: false
            });
        });
    }
}

export default App;
