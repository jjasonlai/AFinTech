import React from "react";
import { Dropdown } from "react-bootstrap";
import debug from "sabio-debug";
import PropTypes from "prop-types";

function ActionMenu(props) {
  const _logger = debug.extend("ActionMenu");
  const roles = props.roles;
  const userId = props.userId;
  const userInfo = props.userInfo;

  const updateRequest = (e) => {
    const id = e.currentTarget.id;
    const name = e.currentTarget.name;
    _logger("name =>", name, "id =>", id);
    props.updateUser(id, name);
  };

  const mapRoleDropDown = (role) => {
    return (
      <Dropdown.Item
        id={userId}
        name={role.name}
        value={userInfo.name}
        onClick={updateRequest}
      >
        {role.name}
      </Dropdown.Item>
    );
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle>
          <i className="fe fe-more-vertical text-muted"></i>| {props.display}
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Header>Change Role</Dropdown.Header>
          {roles.map(mapRoleDropDown)}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

ActionMenu.propTypes = {
  userInfo: PropTypes.string.isRequired,
  updateUser: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  roles: PropTypes.arrayOf.isRequired,
  display: PropTypes.string.isRequired,
};
export default ActionMenu;
