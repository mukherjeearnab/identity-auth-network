import React, { Component } from "react";
//import { Redirect } from "react-router-dom";

import { TextField, Button, CircularProgress } from "@material-ui/core";

class App extends Component {
    state = {
        vra: {},
        message: "",
    };

    onAddApp = async () => {
        console.log(this.state.vra);

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-access-token": localStorage.getItem("session") },
            body: JSON.stringify({
                payload: this.state.vra,
            }),
        };

        this.setState({
            message: (
                <span>
                    <CircularProgress />
                    <br></br> Loading.....
                </span>
            ),
        });

        let response = await fetch("http://localhost:3000/api/main/profile/createProfile", requestOptions);
        let res = await response.json();
        console.log(res);
        this.setState({ message: "Citizen Registered: " + res.id + "\n" });
    };

    render() {
        return (
            <div>
                <h2>New Citizen Enrollment</h2>
                {this.state.message}
                <TextField
                    className="inputs"
                    label="Name"
                    variant="outlined"
                    value={this.state.vra.Name}
                    onChange={(event) => {
                        let vra = this.state.vra;
                        vra.Name = event.target.value;
                        this.setState({
                            vra,
                        });
                    }}
                />
                <br />
                <br />
                <TextField
                    className="inputs"
                    label="ID"
                    variant="outlined"
                    value={this.state.vra.ID}
                    onChange={(event) => {
                        let vra = this.state.vra;
                        vra.ID = event.target.value;
                        this.setState({
                            vra,
                        });
                    }}
                />
                <br />
                <br />
                <TextField
                    className="inputs"
                    label="Address"
                    variant="outlined"
                    value={this.state.vra.Address}
                    onChange={(event) => {
                        let vra = this.state.vra;
                        vra.Address = event.target.value;
                        this.setState({
                            vra,
                        });
                    }}
                />
                <br />
                <br />
                <Button onClick={this.onAddApp} variant="contained" color="primary">
                    Create Citizen Profile
                </Button>
            </div>
        );
    }
}

export default App;
