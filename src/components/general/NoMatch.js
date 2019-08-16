import React from 'react';
import { Link } from 'react-router-dom';
const NoMatch = () => {
    return (
        <section className="container-full-width">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-page">
                        <div className="error-msg">
                            <h1 className="bigfont">
                                <span>:( 404</span> - Page Not Found.
                            </h1>
                            <img src="/assets/images/logo.png" alt="" className="mb-4" />
                            <h5 className="mb-4">
                                The page you are looking for might have been removed had its
                                name changed or is temporarily unavailable.{' '}
                            </h5>

                            <Link to="/" className="btn btn-outline-primary">
                                Back to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NoMatch;
