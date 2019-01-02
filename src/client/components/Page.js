import React from 'react';
import PropTypes from 'prop-types';

const Page = ({ title, parentPage, children }) => (
  <React.Fragment>
    <div className="row">
      <div className="col p-0">
        <ol className="breadcrumb">
          <li>
            <em className="fa fa-home ml-2">&nbsp;</em>
          </li>
          {parentPage && <li>/&nbsp;{parentPage}&nbsp;</li>}
          <li className="active">/&nbsp;{title}</li>
        </ol>
      </div>
    </div>

    <div className="row">
      {title && (
        <div className="col">
          <h1 className="page-header">{title}</h1>
        </div>
      )}
    </div>
    {children}
  </React.Fragment>
);

Page.defaultProps = {
  title: null
};

Page.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string
};

export default Page;
