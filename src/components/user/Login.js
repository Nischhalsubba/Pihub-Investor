import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { inputField } from '../../_formFields';
import * as validation from '../../_utils/validate';
import * as actions from '../../actions/login';
import Translate from 'react-translate-component';
class Login extends Component {
    onSubmit = formProps => {
        this.props.signin(formProps, () => {
            this.props.history.push('/');
        });
    };

    render() {
        const { handleSubmit } = this.props;

        return (
            <div className="container-fluid container-full-height">
                <div className="row container-full-height">
                    <div className="signin-form-container col-md-6">
                        <div className="singin-container">
                            <header className="page-header">
                                {/* <h1 className="page-title">Login</h1> */}
                                <Translate content='label.login' component="h1" className="page-title" />
                                {/* <p >
                                    Enter your email address and password
                                </p> */}
                                <Translate content='label.enteryouremail' component="p" className="page-desc" />
                            </header>
                            <form
                                className="form-signin"
                                onSubmit={handleSubmit(this.onSubmit)}
                            >
                                <div className="form-group">
                                    <Field
                                        name="email"
                                        type="text"
                                        component={inputField}
                                        label={<Translate content='label.emailaddress' />}
                                        className="form-control"
                                        validate={[validation.newEmail, validation.required]}
                                    />
                                </div>
                                <div className="form-group">
                                    <Field
                                        name="password"
                                        type="password"
                                        component={inputField}
                                        label={<Translate content='label.password' />}
                                        className="form-control"
                                        validate={validation.required}
                                    />
                                </div>
                                {/*@todo replace error message below with proper designed div*/}
                                {this.props.errorMessage ? (
                                    <div className="form-group">
                                        <span className="error-text" role="alert">{this.props.errorMessage}</span>
                                    </div>
                                ) : null}
                                {/* <button className="btn btn-primary btn-form" type="submit"> */}
                                <Link to='/forgot-password'> <Translate content="label.forgotPassword"/> </Link>
                                <br />
                                {<Translate content='label.login' component="button" className="btn btn-primary btn-form" type="submit" />}
                                {/* </button> */}
                            </form>
                            <br />
                            {/* If you dont have account you can sign up  */}
                            <Translate content='label.ifyoudont' />&nbsp;<Link to="/signup"><strong><Translate content='label.here' /></strong></Link>

                        </div>
                    </div>
                    <div className="signin-banner-container col-md-6">
                        <div className="signin-banner">
                            <header className="signin-banner__header">
                                {/* <h2 className="signin-banner__title">Perfect Investment</h2> */}
                                <Translate content='label.theperfect' component="h2" className="signin-banner__title" />
                                {/* <p className="signin-banner__desc">
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                                    diam nonumy eirmod tempor invidunt ut labore et dolore magna.
                                </p> */}
                                <Translate content='label.atcredittech' component="p" className="signin-banner__desc" />
                            </header>
                            <img
                                className="signin-banner__thumb"
                                src={`${process.env.PUBLIC_URL}/assets/img/signin-image.png`}
                                alt="Perfect Investment"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        errorMessage: state.auth.errorMessage
    };
}

export default compose(
    connect(
        mapStateToProps,
        actions
    ),
    reduxForm({
        form: 'login'
    })
)(Login);

