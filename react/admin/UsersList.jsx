import React, { useState, useEffect } from "react";
import { Card, Table, Col, Row, Dropdown } from "react-bootstrap";
import SearchBar from "./SearchBar";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import dashboardService from "services/dashboardService";
import lookUpService from "services/lookUpService";
import SingleUserRecord from "./SingleUserRecord";
import "./AdminDashboard.css";
import { Tooltip } from "react-tooltip";
import toastr from "toastr";

const UsersList = ({ usersData }) => {
  const _logger = debug.extend("UsersList");

  const [pageData, setPageData] = useState({
    userList: [],
    userListComponents: [],
    searchedList: [],
    searchedListComponents: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    query: "",
    filterRoleId: 0,
    filterStatusId: 0,
    filterName: "",
  });

  const [rolesForMenu, setRolesForMenu] = useState([]);

  const [statusTypes, setStatusTypes] = useState({
    list: [],
    componentList: [],
  });

  const [showSearched, setShowSearchedData] = useState(false);

  const [userInfo, setUserInfo] = useState({
    id: 0,
    name: "",
  });

  useEffect(() => {
    const list = usersData.pagedItems;
    _logger("props change list", list);
    const count = usersData.totalCount;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.userList = list;
      pd.userListComponents = list.map(mapSingleRecord);
      pd.totalCount = count;
      return pd;
    });
  }, [usersData]);

  useEffect(() => {
    if (pageData.query) {
      dashboardService
        .searchUsers(pageData.pageIndex, pageData.query)
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    } else {
      dashboardService
        .getNextPageUsers(pageData.pageIndex)
        .then(onGetNextPageUsersSuccess)
        .catch(onSearchDataError);
    }
  }, [pageData.pageIndex, rolesForMenu]);

  useEffect(() => {
    lookUpService
      .getTypes(["Roles", "StatusTypes"])
      .then(onGetRoleSucess)
      .catch(onGetRolesError);
  }, []);

  useEffect(() => {
    if (userInfo.id !== 0) {
      dashboardService
        .updateRole(userInfo.id, userInfo.name)
        .then(onUpdateRoleSuccess)
        .catch(onUpdateRoleError);
    }
  }, [userInfo]);

  useEffect(() => {
    if (pageData.query.length > 3) {
      dashboardService
        .searchUsers(pageData.pageIndex, pageData.query)
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }
  }, [pageData.query]);

  useEffect(() => {
    if (pageData.filterRoleId > 0) {
      dashboardService
        .filterUsersByRole(
          pageData.pageIndex,
          pageData.pageSize,
          pageData.filterRoleId
        )
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }
  }, [pageData.filterRoleId]);

  useEffect(() => {
    if (pageData.filterStatusId > 0) {
      dashboardService
        .filterUsersByStatus(
          pageData.pageIndex,
          pageData.pageSize,
          pageData.filterStatusId
        )
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }
  }, [pageData.filterStatusId]);

  const mapUserOptions = (option) => {
    return (
      <Dropdown.Item
        key={option.name + option.id}
        id={option.id}
        name={option.name}
        onClick={onClickFilterType}
      >
        {option.name}
      </Dropdown.Item>
    );
  };

  const onClickFilterType = (e) => {
    const optionId = e.currentTarget.id;
    const optionName = e.currentTarget.name;
    _logger("optionName", optionName, "optionId", optionId);
    if (
      optionName === "User" ||
      optionName === "Borrower" ||
      optionName === "Merchant"
    ) {
      filterByRole(optionId, optionName);
    } else if (
      optionName === "Active" ||
      optionName === "Inactive" ||
      optionName === "Pending" ||
      optionName === "Flagged" ||
      optionName === "Removed"
    ) {
      filterByStatus(optionId, optionName);
    }
  };

  const filterByRole = (id, name) => {
    if (pageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.filterRoleId = id;
        newState.filterName = name;
        return newState;
      });
    } else {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.filterRoleId = id;
        newState.filterName = name;
        return newState;
      });
    }
  };

  const filterByStatus = (id, name) => {
    if (pageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.filterStatusId = id;
        newState.filterName = name;
        return newState;
      });
    } else {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.filterStatusId = id;
        newState.filterName = name;
        return newState;
      });
    }
  };

  const onGetRoleSucess = (response) => {
    const roles = response.item.roles;
    const types = response.item.statusTypes;
    _logger(types);
    setRolesForMenu(roles);
    setStatusTypes((prevState) => {
      const td = { ...prevState };
      td.list = types;
      td.componentList = types.map(mapUserOptions);
      return td;
    });
  };

  const onGetRolesError = (error) => {
    _logger(error);
  };

  const updateUserInfo = (id, role) => {
    setUserInfo((prevState) => {
      const ud = { ...prevState };
      ud.id = id;
      ud.name = role;
      return ud;
    });
  };

  const mapSingleRecord = (singleRecord) => {
    return (
      <SingleUserRecord
        key={singleRecord.id}
        data={singleRecord}
        rolesForMenu={rolesForMenu}
        userInfo={userInfo}
        updateUser={updateUserInfo}
      ></SingleUserRecord>
    );
  };

  const onChange = (page) => {
    _logger("pagination page is changed =>", page);
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.pageIndex = page - 1;
      return pd;
    });
  };

  const onSearch = (e) => {
    const searchValue = e.target.value;
    setPageData((prevState) => {
      let pd = { ...prevState };
      pd.query = searchValue;
      return pd;
    });
  };

  const onSearchDataSuccess = (data) => {
    const newData = data.item.pagedItems;
    _logger(data);
    setPageData((prevState) => {
      const ud = { ...prevState };
      ud.totalCount = data.item.totalCount;
      ud.pageIndex = data.item.pageIndex;
      ud.searchedList = newData;
      ud.searchedListComponents = newData.map(mapSingleRecord);
      return ud;
    });
    setShowSearchedData(true);
  };

  const onSearchDataError = () => {
    toastr.error(
      "User Not Found! Try to search or filter with a different term!"
    );
  };

  const resetList = () => {
    setShowSearchedData(false);
    if (pageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.query = "";
        newState.filterName = "";
        return newState;
      });
    } else {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.query = "";
        newState.filterName = "";
        return newState;
      });
      dashboardService
        .getNextPageUsers(pageData.pageIndex)
        .then(onGetNextPageUsersSuccess)
        .catch(onSearchDataError);
    }
  };

  const onGetNextPageUsersSuccess = (data) => {
    _logger("get next page users =>", data);
    const newData = data.item.pagedItems;
    setPageData((prevState) => {
      const ud = { ...prevState };
      ud.totalCount = data.item.totalCount;
      ud.searchedList = newData;
      ud.searchedListComponents = newData.map(mapSingleRecord);
      return ud;
    });
    setShowSearchedData(true);
  };

  const onUpdateRoleSuccess = (response) => {
    _logger(response);
    dashboardService
      .getNextPageUsers(pageData.pageIndex)
      .then(onGetNextPageUsersSuccess)
      .catch(onSearchDataError);
  };

  const onUpdateRoleError = (error) => {
    _logger(error);
  };

  return (
    <Card className="border-0">
      <Card.Header>
        <div className="mb-3 mb-lg-0">
          <Row>
            <Col sm={3}>
              <h3 className="mb-0">Users Information</h3>
            </Col>
            <Col sm={2}>
              <Dropdown>
                <Dropdown.Toggle>
                  <a
                    data-tooltip-content="Filter"
                    data-tooltip-id="filter-tooltip"
                    data-tooltip-place="top"
                  >
                    <span className="fe fe-filter">
                      {" "}
                      | Filter | {pageData.filterName}
                    </span>
                  </a>
                  <Tooltip id="filter-tooltip" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Header>Filter By User Role</Dropdown.Header>
                  {rolesForMenu.map(mapUserOptions)}
                  <Dropdown.Header>Filter By Status</Dropdown.Header>
                  {statusTypes.componentList}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col sm={3}>
              <Pagination
                onChange={onChange}
                current={pageData.pageIndex + 1}
                pageSize={pageData.pageSize}
                total={pageData.totalCount}
                locale={locale}
              />
            </Col>
            <Col sm={3}>
              <SearchBar
                title="users"
                onChange={onSearch}
                value={pageData.query}
              ></SearchBar>
            </Col>
            <Col sm={1} className="d-flex justify-content-start mt-2">
              <a
                data-tooltip-content="Clear search"
                data-tooltip-id="clear-tooltip"
                data-tooltip-place="top"
              >
                <span className="fe fe-refresh-cw" onClick={resetList}></span>
              </a>
              <Tooltip id="clear-tooltip" />
            </Col>
          </Row>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-invoice table-responsive border-0">
          <Table className="table mb-0 text-nowrap">
            <thead className="table-light">
              <tr>
                <th scope="col" className="border-bottom-0">
                  ID
                </th>
                <th scope="col" className="border-bottom-0">
                  Email
                </th>
                <th scope="col" className="border-bottom-0">
                  Name
                </th>
                <th scope="col" className="border-bottom-0">
                  Roles
                </th>
                <th scope="col" className="border-bottom-0">
                  Status
                </th>
              </tr>
            </thead>
            {showSearched && pageData.searchedListComponents}
            {!showSearched && pageData.userListComponents}
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

UsersList.propTypes = {
  usersData: PropTypes.isRequired,
  roles: PropTypes.isRequired,
  userId: PropTypes.number.isRequired,
};

export default UsersList;
