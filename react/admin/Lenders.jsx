import React, { useState, useEffect } from "react";
import { Col, Row, Card, ListGroup, Image } from "react-bootstrap";
import SearchBar from "./SearchBar";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import debug from "sabio-debug";
import dashBoardsService from "services/dashboardService";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

const Lenders = ({ title, lendersData }) => {
  const _logger = debug.extend("Lenders");

  const navigate = useNavigate();

  const [pageData, setPageData] = useState({
    pageIndex: 0,
    pageSize: 4,
    totalCount: 0,
  });

  const [searchedData, setNewData] = useState([]);

  const [showSearched, setShowSearchedData] = useState(false);
  const [showNoRecord, setShowNoRecord] = useState(false);
  const [query, setQueryData] = useState("");

  useEffect(() => {
    _logger("props change", lendersData);
    const count = lendersData.length;
    _logger(count);
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.totalCount = count;
      return pd;
    });
  }, [lendersData]);

  useEffect(() => {
    if (searchedData) {
      _logger("props change", searchedData);
      const count = searchedData.length;
      _logger(count);
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.totalCount = count;
        return pd;
      });
    }
  }, [searchedData]);

  useEffect(() => {
    if (query.length > 2) {
      dashBoardsService
        .searchLenders(query)
        .then(onSearchDataSuccess)
        .catch(onSearchDataError);
    }
  }, [query]);

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
    setQueryData((prevState) => {
      let newSearchTerm = { ...prevState };
      newSearchTerm = searchValue;
      return newSearchTerm;
    });
  };

  const resetList = () => {
    setShowNoRecord(false);
    setShowSearchedData(false);
    const count = lendersData.length;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.pageIndex = 0;
      pd.totalCount = count;
      return pd;
    });
    setQueryData("");
  };

  const onSearchDataSuccess = (data) => {
    _logger(data);
    const newData = data.items;
    if (newData !== null) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.pageIndex = 0;
        pd.totalCount = newData.length;
        return pd;
      });
    } else {
      setShowNoRecord(true);
    }
    setNewData(newData);
    setShowSearchedData(true);
  };

  const onSearchDataError = (error) => {
    _logger(error);
  };

  const onClick = (e) => {
    _logger(e);
    const id = e.target.id;
    navigate(`/lender/${id}`);
  };

  return (
    <React.Fragment>
      <Card className="h-100">
        <div className="mt-2 col-11">
          <SearchBar
            title="lender"
            onChange={onSearch}
            value={query}
          ></SearchBar>
        </div>
        <Card.Header className="d-flex align-items-center justify-content-between card-header-height">
          <h4 className="mb-0">{title}</h4>
          <Pagination
            onChange={onChange}
            current={pageData.pageIndex + 1}
            pageSize={pageData.pageSize}
            total={pageData.totalCount}
            locale={locale}
          />
          <a
            data-tooltip-content="Clear search"
            data-tooltip-id="clear-tooltip"
            data-tooltip-place="top"
          >
            <span className="fe fe-refresh-cw" onClick={resetList}></span>
          </a>
          <Tooltip id="clear-tooltip" />
        </Card.Header>
        <Card.Body>
          {(showSearched && searchedData && (
            <ListGroup variant="flush">
              {searchedData
                .slice(pageData.pageIndex * 4, 4 * (pageData.pageIndex + 1))
                .map((item, index) => (
                  <ListGroup.Item
                    className={`px-0 ${index === 0 ? "pt-0" : ""}`}
                    key={item.id}
                  >
                    <Row>
                      <Col className="col-auto">
                        <div className={`avatar avatar-md avatar-indicators`}>
                          <Image
                            alt="avatar"
                            src={item.logo}
                            className="rounded-circle"
                          />
                        </div>
                      </Col>
                      <Col className="ms-n3">
                        <h4 className="mb-0 h5">{item.name}</h4>
                      </Col>
                      <Col className="col-auto">
                        <i
                          className="fe fe-external-link"
                          onClick={onClick}
                        ></i>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
            </ListGroup>
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
            <ListGroup variant="flush">
              {lendersData
                .slice(pageData.pageIndex * 4, 4 * (pageData.pageIndex + 1))
                .map((item, index) => (
                  <ListGroup.Item
                    className={`px-0 ${index === 0 ? "pt-0" : ""}`}
                    key={item.id}
                  >
                    <Row>
                      <Col className="col-auto">
                        <div className={`avatar avatar-md avatar-indicators`}>
                          <Image
                            alt="avatar"
                            src={item.logo}
                            className="rounded-circle"
                          />
                        </div>
                      </Col>
                      <Col className="ms-n3">
                        <h4 className="mb-0 h5">{item.name}</h4>
                      </Col>
                      <Col className="col-auto">
                        <i
                          className="fe fe-external-link"
                          id={item.id}
                          onClick={onClick}
                        >
                          {" "}
                          View Detail
                        </i>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

Lenders.propTypes = {
  title: PropTypes.string.isRequired,
  lendersData: PropTypes.isRequired,
};
export default Lenders;
