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
    state = { redirect: "" };

    logout = () => {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
        this.setState({ redirect: <Redirect to="/" /> });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <h2>RTO Dashboard</h2>
                <h2>
                    {this.state.redirect}Welcome, {localStorage.getItem("user")}!
                </h2>
                <Container maxWidth="sm" spacing={10}>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Link to="/citizen/viewProfile/xyz" className={classes.link}>
                                <Paper className={classes.paper}>View Citizen Profile</Paper>
                            </Link>
                        </Grid>
                        <Grid item xs>
                            <Link to="/citizen/newProfile" className={classes.link}>
                                <Paper className={classes.paper}>Create New Citizen Profile</Paper>
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
