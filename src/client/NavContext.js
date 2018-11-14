import React from 'react';

const NavContext = React.createContext({
  page: 'landing',
  setPage: () => {},
  props: {}
});

export default NavContext;
