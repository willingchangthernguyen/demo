import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logIn} from "./LogInAction";
import LoginSaga from "./LogInSaga";
import LogInReducer from "./LogInReducer";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {StoreContext} from "../common/context/Store";
import sagaMiddleware from "../common/saga";

const styles = theme => ({
  root: {
    flexWrap: "wrap",
    display: "inline-flex",
    textAlign: "right"
  },
  container: {
    display: "flex"
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    flexBasis: 200
  },
  typography: {
    padding: theme.spacing.unit * 2,
    color: "white"
  },
  popper: {
    backgroundColor: "red"
  }
});
class CLogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      showPassword: false,
      showFormSuccess: false,
      isValidated: false,
      anchorEl: null,
      open: false,
      id: null,
      popperContent: []
    };
    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword;
  }
  componentWillMount() {
    this.context.reducerManager.add("logIn", LogInReducer);
    //const {sagaMiddleware} = this.context;
    sagaMiddleware.run(LoginSaga, this.context);
    //this.saga = runSaga(LoginSaga());
  }
  componentWillUnmount() {
    if (this.saga) {
      this.saga.cancel();
    }
  }
  validate = () => {
    const formEl = this.formEl;
    const formLength = formEl.length;
    this.setState(state => ({popperContent: [], id: null, open: false}));
    if (formEl.checkValidity() === false) {
      this.setState(state => ({id: "login_popper", open: true}));
      for (let i = 0; i < formLength; i++) {
        const elem = formEl[i];
        if (elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (!(elem.name === "password")) {
              this.setState(state => ({
                popperContent: state.popperContent.concat(elem.name.charAt(0).toUpperCase() + elem.name.slice(1) + " :" + elem.validationMessage)
              }));
            } else {
              this.setState(state => ({popperContent: state.popperContent.concat("Password: Must be at least 6 characters long, contain letters and numbers")}));
            }
          }
        }
      }
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const {currentTarget} = event;
    this.setState(state => ({anchorEl: currentTarget}));
    if (this.validate()) {
      this.props.logIn({email: this.state.email, password: this.state.password});
      console.log('a')
    }
  };
  handleChange = prop => event => {
    event.preventDefault();
    this.setState({[prop]: event.target.value});
    const {currentTarget} = event;
    this.setState(state => ({anchorEl: currentTarget}));
    this.validate();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({
      showPassword: !state.showPassword
    }));
  };
  render() {
    const {classes} = this.props;
    return (<div className={classes.root}>
      <form noValidate={true} ref={form => (this.formEl = form)} className={classes.container} onSubmit={this.handleSubmit}>
        <TextField id="outlined-email-input" label="Email" className={classNames(classes.textField, classes.margin)} required={true} type="email" value={this.state.email} name="email" autoComplete="email" variant="outlined" onChange={this.handleChange("email")}/>
        <TextField id="password" className={classNames(classes.margin, classes.textField)} required={true} value={this.state.password} name="password" autoComplete="password" variant="outlined" type={this.state.showPassword
            ? "text"
            : "password"} label="Password" onChange={this.handleChange("password")} InputProps={{
            endAdornment: (<InputAdornment position="end">
              <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                {
                  this.state.showPassword
                    ? (<VisibilityOff/>)
                    : (<Visibility/>)
                }
              </IconButton>
            </InputAdornment>)

            // eslint-disable-next-line react/jsx-no-duplicate-props
          }} inputProps={{
            pattern: "(?=.*[0-9])(?=.*[a-z]).{6,}"
          }}/>

        <div>
          <Button variant="contained" aria-describedby={this.state.id} className={classNames(classes.margin, classes.button)} color="primary" type="submit">
            Login
          </Button>
          <Popper id={this.state.id} open={this.state.open} anchorEl={this.state.anchorEl} placement="bottom">
            {
              this.state.popperContent.map((content, index) => (<Paper className={classNames(classes.popper)} key={index}>
                <Typography className={classes.typography}>
                  {content}
                </Typography>
              </Paper>))
            }
          </Popper>
        </div>
      </form>
    </div>);
  }
}
CLogIn.propTypes = {
  classes: PropTypes.object.isRequired
};
CLogIn.contextType = StoreContext;
const mapDispatchToProps = dispatch => {
  return {
    logIn: (email, password) => dispatch(logIn(email, password))
  };
};

function mapStateToProps(state) {
  return state;
}
const LogIn = connect(mapStateToProps, mapDispatchToProps)(CLogIn);
export default withStyles(styles)(LogIn);