import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, Container, Paper } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.common.black,
        backgroundColor: theme.palette.primary.light,
    },
    paper2: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.common.black,
        backgroundColor: theme.palette.secondary.light,
    },
    paper3: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.common.white,
    },
    link: {
        textDecoration: "none",
    },
    logout: {
        backgroundColor: theme.palette.error.light,
    },
});

class App extends Component {
    state = {
        redirect: "",
        profile: {
            Name: "",
        },
    };

    async componentDidMount() {
        if (!localStorage.getItem("session")) this.setState({ redirect: <Redirect to="/" /> });
        console.log(localStorage.getItem("session"));
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-access-token": localStorage.getItem("session") },
        };
        let response = await fetch(
            "http://localhost:3000/api/main/profile/get/" + localStorage.getItem("user"),
            requestOptions
        );
        let res = await response.json();
        console.log(res);
        this.setState({ profile: res });
    }

    logout = () => {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
        this.setState({ redirect: <Redirect to="/" /> });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <h2>Citizen Dashboard</h2>
                <h2>
                    {this.state.redirect}Welcome, {this.state.profile.Name}!
                </h2>
                <Container maxWidth="sm" spacing={10}>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Link to={"/citizen/viewProfile/" + this.state.profile.UID} className={classes.link}>
                                <Paper className={classes.paper}>View Profile</Paper>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Button m={1} onClick={this.logout} variant="contained" className={classes.logout}>
                                Log Out
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default withStyles(useStyles)(App);
