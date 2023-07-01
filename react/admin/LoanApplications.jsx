import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Col, Row, Dropdown } from "react-bootstrap";
import SearchBar from "./SearchBar";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import dashBoardsService from "services/dashboardService";
import lookUpService from "services/lookUpService";
import toastr from "toastr";
import { Tooltip } from "react-tooltip";

const LoanApplications = ({ loanApplicationsData }) => {
  const _logger = debug.extend("LoanApplications");

  const [pageData, setPageData] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    query: "",
    filterLoanTypeId: 0,
    filterStatusId: 0,
    filterName: "",
  });
  const [searchedData, setNewData] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    typeList: [],
    typeListComponents: [],
    statusType: [],
    statusTypeComponents: [],
  });

  const [showSearched, setShowSearchedData] = useState(false);

  const [showNoRecord, setShowNoRecord] = useState(false);

  useEffect(() => {
    lookUpService
      .getTypes3Col(["LoanTypes"])
      .then(onGetLoanTypesSuccess)
      .catch(onSearchDataError);
    lookUpService
      .getTypes(["StatusTypes"])
      .then(onGetStatusTypesSuccess)
      .catch(onGetStatusTypesError);
    _logger("props change", loanApplicationsData);
    const count = loanApplicationsData.length;
    _logger(count);
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.totalCount = count;
      return pd;
    });
  }, [loanApplicationsData]);

  useEffect(() => {
    if (pageData.query) {
      _logger("props change", searchedData);
      const count = searchedData.length;
      _logger(count);
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.totalCount = count;
        return pd;
      });
    }
  }, [pageData.pageIndex]);

  useEffect(() => {
    if (pageData.query.length > 2) {
      dashBoardsService
        .searchLoanApplications(pageData.query)
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }

    if (pageData.filterStatusId > 0) {
      dashBoardsService
        .filterLoanApplicationsByStatus(pageData.filterStatusId)
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }

    if (pageData.filterLoanTypeId > 0) {
      dashBoardsService
        .filterLoanApplicationsByLoanType(pageData.filterLoanTypeId)
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }
  }, [pageData.query, pageData.filterStatusId, pageData.filterLoanTypeId]);

  const onChange = (page) => {
    _logger(page);
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.pageIndex = page - 1;
      return pd;
    });
  };

  const onSearch = (e) => {
    const searchValue = e.target.value;
    _logger(searchValue);
    setPageData((prevState) => {
      let pd = { ...prevState };
      pd.query = searchValue;
      return pd;
    });
  };

  const onClickLoanType = (e) => {
    const optionName = e.target.name;
    const loanId = e.target.id;
    if (
      optionName === "Active" ||
      optionName === "Inactive" ||
      optionName === "Pending" ||
      optionName === "Flagged" ||
      optionName === "Removed"
    ) {
      filterLoanStatus(loanId, optionName);
    } else {
      filterLoanType(loanId, optionName);
    }
  };

  const filterLoanStatus = (id, name) => {
    if (pageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.filterLoanTypeId = 0;
        newState.filterStatusId = id;
        newState.filterName = name;
        return newState;
      });
    } else {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.filterLoanTypeId = 0;
        newState.filterStatusId = id;
        newState.filterName = name;
        return newState;
      });
    }
  };

  const filterLoanType = (id, name) => {
    if (pageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.filterStatusId = 0;
        newState.filterLoanTypeId = id;
        newState.filterName = name;
        return newState;
      });
    } else {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.filterStatusId = 0;
        newState.filterLoanTypeId = id;
        newState.filterName = name;
        return newState;
      });
    }
  };

  const mapLoanOptions = (option) => {
    return (
      <Dropdown.Item
        key={option.name + option.id}
        id={option.id}
        name={option.name}
        onClick={onClickLoanType}
      >
        {option.name}
      </Dropdown.Item>
    );
  };

  const onGetStatusTypesSuccess = (response) => {
    const types = response.item.statusTypes;
    setFilterOptions((prevState) => {
      const td = { ...prevState };
      td.statusType = types;
      td.statusTypeComponents = types.map(mapLoanOptions);
      return td;
    });
  };

  const onGetStatusTypesError = (error) => {
    toastr.error(error);
  };

  const onGetLoanTypesSuccess = (response) => {
    const types = response.item.loanTypes;
    _logger(types);
    setFilterOptions((prevState) => {
      const td = { ...prevState };
      td.typeList = types;
      td.typeListComponents = types.map(mapLoanOptions);
      return td;
    });
  };

  const onSearchDataSuccess = (response) => {
    _logger(response);
    const newData = response.data.items;
    const query = response.request.responseURL;
    const msg = query.slice(query.indexOf("id="));
    _logger("msg =>", msg);
    if (newData === null) {
      toastr.error(`No records of such phrase or status of ${msg}`);
      setShowNoRecord(true);
    } else {
      setShowNoRecord(false);
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.pageIndex = 0;
        pd.totalCount = newData.length;
        return pd;
      });
    }

    setNewData(newData);
    setShowSearchedData(true);
  };

  const onSearchDataError = (error) => {
    toastr.error(error);
  };

  const resetList = () => {
    setShowSearchedData(false);
    const count = loanApplicationsData.length;
    if (pageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.totalCount = count;
        newState.query = "";
        newState.filterLoanTypeId = 0;
        newState.filterStatusId = 0;
        newState.filterName = "";
        return newState;
      });
      setShowNoRecord(false);
    } else {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.query = "";
        newState.filterLoanTypeId = 0;
        newState.filterStatusId = 0;
        newState.totalCount = count;
        newState.filterName = "";
        return newState;
      });
      setShowNoRecord(false);
    }
  };
  return (
    <Card className="border-0">
      <Card.Header>
        <div className="mb-3 mb-lg-0">
          <Row>
            <Col sm={3}>
              <h3 className="mb-0">Loan Applications</h3>
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
                  <Dropdown.Header>Filter By Loan Type</Dropdown.Header>
                  {filterOptions.typeListComponents}
                  <Dropdown.Header>Filter By Status</Dropdown.Header>
                  {filterOptions.statusTypeComponents}
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
                className="mt-1"
              />
            </Col>
            <Col sm={3}>
              <SearchBar
                title="loan application"
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
                  Loan ID
                </th>
                <th scope="col" className="border-bottom-0">
                  User
                </th>
                <th scope="col" className="border-bottom-0">
                  Loan Type
                </th>
                <th scope="col" className="border-bottom-0">
                  Loan Amount
                </th>
                <th scope="col" className="border-bottom-0">
                  Loan Term
                </th>
                <th scope="col" className="border-bottom-0">
                  Prefered Interest Rate
                </th>
                <th scope="col" className="border-bottom-0">
                  Credit Score
                </th>
                <th scope="col" className="border-bottom-0">
                  Status
                </th>
              </tr>
            </thead>
            {(showSearched && searchedData && (
              <tbody>
                {searchedData
                  .slice(pageData.pageIndex * 10, 10 * (pageData.pageIndex + 1))
                  .map((item, index) => (
                    <tr key={index}>
                      <td>#{item.id}</td>
                      <td>
                        {item.user.firstName} {item.user.lastName}
                      </td>
                      <td>{item.loanType.name}</td>
                      <td>${item.loanAmount}</td>
                      <td>{item.loanTerm}</td>
                      <td>{item.preferredInterestRate}</td>
                      <td>{item.creditScore}</td>
                      <td>
                        <Badge>{item.statusType.name}</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            )) ||
              (showNoRecord && (
                <tbody>
                  <h1 key={"not found"} className="fe fe-alert-triangle ms-4">
                    {" "}
                    Record Not Found!
                  </h1>
                </tbody>
              ))}
            {!showSearched && (
              <tbody>
                {loanApplicationsData
                  .slice(pageData.pageIndex * 10, 10 * (pageData.pageIndex + 1))
                  .map((item, index) => (
                    <tr key={index}>
                      <td>#{item.id}</td>
                      <td>
                        {item.user.firstName} {item.user.lastName}
                      </td>
                      <td>{item.loanType.name}</td>
                      <td>${item.loanAmount}</td>
                      <td>{item.loanTerm}</td>
                      <td>{item.preferredInterestRate}</td>
                      <td>{item.creditScore}</td>
                      <td>
                        <Badge>{item.statusType.name}</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

LoanApplications.propTypes = {
  loanApplicationsData: PropTypes.isRequired,
};

export default LoanApplications;
