import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ActionMenu from "./ActionMenu";
import { Badge } from "react-bootstrap";

function SingleUserRecord(props) {
  const item = props.data;
  const rolesForMenu = props.rolesForMenu;
  const userInfo = props.userInfo;

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRoles(rolesForMenu);
  }, [rolesForMenu]);

  const mapRole = (aRole) => {
    return aRole.name + " | ";
  };

  const updateRequest = (id, name) => {
    props.updateUser(id, name);
  };

  return (
    <tbody>
      <tr key={item.id}>
        <td>#{item.id}</td>
        <td>{item.email}</td>
        <td>
          {item.firstName} {item.lastName}
        </td>
        <td>
          <ActionMenu
            display={item.roles.map(mapRole)}
            key={item.id}
            userId={item.id}
            roles={roles}
            userInfo={userInfo}
            updateUser={updateRequest}
          ></ActionMenu>
        </td>

        <td>
          <Badge>{item.statusTypes.name}</Badge>
        </td>
      </tr>
    </tbody>
  );
}

SingleUserRecord.propTypes = {
  data: PropTypes.isRequired,
  rolesForMenu: PropTypes.isRequired,
  userInfo: PropTypes.isRequired,
  updateUser: PropTypes.isRequired,
};

export default SingleUserRecord;
