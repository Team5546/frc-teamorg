import React from 'react';
import PropTypes from 'prop-types';
import NavContext from '../NavContext';

const Page = ({ title, parentPage, children }) => (
  <NavContext.Consumer>
    {({ showSideMenu }) => (
      <div
        className={
          showSideMenu
            ? 'col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2 main'
            : 'col-sm-12 main'
        }
      >
        <div className="row">
          <ol className="breadcrumb">
            <li>
              <em className="fa fa-home" />
            </li>
            {parentPage && (
            <li>
              {parentPage}
            </li>
            )}
            <li className="active">
              {title}
            </li>
          </ol>
        </div>

        <div className="row">
          {title && (
            <div className="col-lg-12">
              <h1 className="page-header">
                {title}
              </h1>
            </div>
          )}
        </div>
        {children}
      </div>
    )}
  </NavContext.Consumer>
);

Page.defaultProps = {
  title: null
};

Page.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string
};

export default Page;
