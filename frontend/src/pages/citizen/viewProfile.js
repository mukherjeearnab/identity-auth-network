import React, { Component } from "react";
import { TextField, Button, CircularProgress } from "@material-ui/core";

class App extends Component {
    state = {
        application: {},
        message: "",
        ID: "",
        contt: "",
    };

    async componentDidMount() {
        const { id } = this.props.match.params;
        if (id !== "0") {
            this.setState({
                ID: id,
                message: (
                    <p>
                        Press <b>Load Citizen Profile</b> to View Profile Details
                    </p>
                ),
            });
        }
    }

    onLoad = async () => {
        console.log(this.state.application);
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-access-token": localStorage.getItem("session") },
        };

        this.setState({
            message: (
                <span>
                    <CircularProgress />
                    <br></br> Loading.....
                </span>
            ),
        });

        let response = await fetch("http://localhost:3000/api/main/profile/get/" + this.state.ID, requestOptions);
        let res = await response.json();
        console.log(res);

        this.setState({ application: res });

        var output = <div>{this.createContent()}</div>;

        this.setState({ message: output });
    };

    createContent = () => {
        return (
            <div>
                <h3>ID: {this.state.application.ID}</h3>
                <h3>Name: {this.state.application.Name}</h3>
                <h3>Address: {this.state.application.Address}</h3>

                <br />
                <h3>IAC: {this.state.application.iac}</h3>
                <br />
            </div>
        );
    };

    render() {
        return (
            <div>
                <h2>View Citizen Profile</h2>
                <TextField
                    className="inputs"
                    label="Citizen UID"
                    variant="outlined"
                    value={this.state.ID}
                    onChange={(event) => {
                        this.setState({
                            ID: event.target.value,
                        });
                    }}
                />
                <br /> <br />
                <Button onClick={this.onLoad} variant="contained" color="primary">
                    Load Citizen Profile
                </Button>
                <br /> <br />
                {this.state.message}
            </div>
        );
    }
}

export default App;
