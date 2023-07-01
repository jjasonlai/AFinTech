import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";

import SearchBar from "./SearchBar";
import SingleBorrowerRecord from "./SingleBorrowerRecord";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import borrowerService from "services/borrowerService";
import { Tooltip } from "react-tooltip";
import toastr from "toastr";

const Borrowers = ({ title, borrowersData }) => {
  const _logger = debug.extend("Borrowers");

  const [borrowerPageData, setPageData] = useState({
    borrowerList: [],
    borrowerListComponents: [],
    searchedList: [],
    searchedListComponents: [],
    pageIndex: 0,
    pageSize: 4,
    totalCount: 0,
    query: "",
  });

  const [showSearched, setShowSearchedData] = useState(false);

  useEffect(() => {
    _logger("props change", borrowersData.pagedItems);
    const list = borrowersData.pagedItems;
    const count = borrowersData.totalCount;
    _logger(count);
    if (list !== undefined) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.borrowerList = list;
        pd.borrowerListComponents = list.map(mapSingleBorrower);
        pd.totalCount = count;
        return pd;
      });
    }
  }, [borrowersData]);

  useEffect(() => {
    if (borrowerPageData.query) {
      borrowerService
        .searchBorrowers(
          borrowerPageData.pageIndex,
          borrowerPageData.pageSize,
          borrowerPageData.query
        )
        .then(onBorrowerSearchSuccess)
        .catch(onGetBorrowerError);
    } else {
      borrowerService
        .getBorrowers(borrowerPageData.pageIndex, borrowerPageData.pageSize)
        .then(onGetBorrowerSuccess)
        .catch(onGetBorrowerError);
    }
  }, [borrowerPageData.pageIndex]);

  useEffect(() => {
    if (borrowerPageData.query.length > 3) {
      borrowerService
        .searchBorrowers(
          borrowerPageData.pageIndex,
          borrowerPageData.pageSize,
          borrowerPageData.query
        )
        .then(onBorrowerSearchSuccess)
        .catch(onGetBorrowerError);
    }
  }, [borrowerPageData.query]);

  const mapSingleBorrower = (item) => {
    return <SingleBorrowerRecord item={item}></SingleBorrowerRecord>;
  };

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

  const onGetBorrowerSuccess = (data) => {
    _logger("Borrowers:", data);
    let newBorrowerArray = data.item.pagedItems;
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.totalCount = data.item.totalCount;
      newState.borrowerList = newBorrowerArray;
      newState.borrowerListComponents = newBorrowerArray.map(mapSingleBorrower);
      return newState;
    });
  };

  const onGetBorrowerError = () => {
    toastr.error("result can't be found. Please refine your search term.");
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.totalCount = 1;
      newState.borrowerListComponents = [
        <h1 key={"not found"} className="fe fe-alert-triangle">
          {" "}
          Record Not Found!
        </h1>,
      ];
      return newState;
    });
  };

  const onBorrowerSearchSuccess = (data) => {
    _logger("Search Result:", data);
    setShowSearchedData(true);
    const searchResult = data.item.pagedItems;
    setPageData((prevState) => {
      const newState = { ...prevState };
      _logger("This is the newState: ", newState);
      newState.pageIndex = data.item.pageIndex;
      newState.totalCount = data.item.totalCount;
      newState.searchedList = searchResult;
      newState.searchedListComponents = searchResult.map(mapSingleBorrower);
      return newState;
    });
  };

  const resetList = () => {
    setShowSearchedData(false);
    if (borrowerPageData.pageIndex !== 0) {
      setPageData((prevState) => {
        const newState = { ...prevState };
        newState.pageIndex = 0;
        newState.query = "";
        return newState;
      });
    } else {
      resetV2(borrowerPageData.pageIndex, borrowerPageData.pageSize);
    }
  };

  const resetV2 = (pageIndex, pageSize) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.query = "";
      return newState;
    });
    borrowerService
      .getBorrowers(pageIndex, pageSize)
      .then(onGetBorrowerSuccess)
      .catch(onGetBorrowerError);
  };

  return (
    <Card className="h-100">
      <div className="mt-2 col-11">
        <SearchBar
          title="borrower"
          onChange={onSearch}
          value={borrowerPageData.query}
        ></SearchBar>
      </div>
      <Card.Header className="d-flex align-items-center justify-content-between card-header-height">
        <h4 className="mb-0">{title}</h4>
        <Pagination
          onChange={onChange}
          current={borrowerPageData.pageIndex + 1}
          pageSize={borrowerPageData.pageSize}
          total={borrowerPageData.totalCount}
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
        {showSearched && (
          <ListGroup variant="flush">
            {borrowerPageData.searchedListComponents}
          </ListGroup>
        )}
        {!showSearched && (
          <ListGroup variant="flush">
            {borrowerPageData.borrowerListComponents}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

Borrowers.propTypes = {
  title: PropTypes.string.isRequired,
  borrowersData: PropTypes.isRequired,
};
export default Borrowers;
