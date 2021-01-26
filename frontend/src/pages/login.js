import React, { Component } from "react";
import { Button, TextField, FormControl, Select, MenuItem, FormHelperText } from "@material-ui/core";
import { Redirect } from "react-router-dom";

class App extends Component {
    state = {
        group: "citizen",
        username: "",
        password: "",
        redirect: null,
    };

    async componentDidMount() {
        if (localStorage.getItem("session")) {
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-access-token": localStorage.getItem("session") },
            };
            let response = await fetch("http://localhost:3000/api/auth/verify/", requestOptions);
            let res = await response.json();
            if (res.status === 1) {
                if (res.group === "citizen") this.setState({ redirect: <Redirect to="/HomeCi" /> });
                else if (res.group === "identityauthority") this.setState({ redirect: <Redirect to="/HomeIa" /> });
                else;
            }
            this.setState({ redirect: <Redirect to="/" /> });
            console.log("Login Check!");
        }
    }

    login = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                group: this.state.group,
            }),
        };

        let response = await fetch("http://localhost:3000/api/auth/login", requestOptions);
        let res = await response.json();
        console.log(res);
        if (res.jwtoken) {
            localStorage.setItem("session", res.jwtoken);
            localStorage.setItem("user", this.state.username);
            if (this.state.group === "citizen") this.setState({ redirect: <Redirect to="/HomeCi" /> });
            else if (this.state.group === "identityauthority") this.setState({ redirect: <Redirect to="/HomeIa" /> });
            else;
        } else
            this.setState({
                redirect: "Wrong Credentials!",
            });
    };

    render() {
        return (
            <div>
                <h2>Login</h2>
                <FormControl>
                    <Select
                        label="group-label"
                        id="group-select"
                        value={this.state.group}
                        onChange={(event) => {
                            this.setState({ group: event.target.value });
                        }}
                    >
                        <MenuItem value={"citizen"}>Citizen</MenuItem>
                        <MenuItem value={"identityauthority"}>Identity Authority</MenuItem>
                    </Select>
                    <FormHelperText>Please Select The Domain You Belong To</FormHelperText>
                </FormControl>
                <br />
                <br />
                <TextField
                    m={1}
                    label="Username"
                    variant="outlined"
                    value={this.state.username}
                    onChange={(event) =>
                        this.setState({
                            username: event.target.value,
                        })
                    }
                />
                <br />
                <br />
                <TextField
                    m={10}
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={this.state.password}
                    onChange={(event) =>
                        this.setState({
                            password: event.target.value,
                        })
                    }
                />
                <br />
                <br />
                <Button m={1} onClick={this.login} variant="contained" color="primary">
                    Login
                </Button>
                <h3 style={{ color: "red" }}>{this.state.redirect}</h3>
            </div>
        );
    }
}

export default App;
