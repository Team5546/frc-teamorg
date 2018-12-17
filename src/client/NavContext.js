import React from 'react';

const NavContext = React.createContext({
  page: 'landing',
  setPage: () => {},
  props: {},
  showSideMenu: true
});

export default NavContext;
