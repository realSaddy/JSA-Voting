import React from 'react';
import './App.css';
import NameForm from "./Form";
import Header from './Header';

class  Vote extends React.Component {

    constructor(props) {
        super(props);
    }
    render(){
        return (
            <div className="App">
                <Header/>
                {/*{ enabled ? < />: ""}*/}
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <NameForm/>
            </div>
        );
    }
}

export default Vote;
