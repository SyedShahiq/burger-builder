import React from 'react';
import './NavigationItem.css';
import { NavLink } from 'react-router-dom';
const navigationItem = (props) => (
  <li className="NavigationItem">
    {/* <a href={props.link} className={props.active ? 'active' : null}>{props.children}</a> */}
    <NavLink to={props.link}>{props.children}</NavLink>
  </li>
);
export default navigationItem;