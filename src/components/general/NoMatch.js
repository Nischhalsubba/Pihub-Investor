import React from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component'
const NoMatch = () => {
    return (
        <section className="container-full-width">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-page">
                        <div className="error-msg">
                            <h1 className="bigfont">
                                {/* <span>:( 404 - Page Not Found.</span> */}
                                <Translate content='pagenot' />
                            </h1>
                            <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="" className="mb-4" />
                            {/* <h5 className="mb-4">
                                The page you are looking for might have been removed had its
                                name changed or is temporarily unavailable.{' '}
                            </h5> */}
                                    <Translate content='label.thepage' component="h5" className="mb-4" />
                            <Link to="/" className="btn btn-outline-primary">
                                {/* Back to Homepage */}
                                <Translate content='label.back' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NoMatch;
