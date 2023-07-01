import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const SearchBar = (props) => {
  let title = props.title;

  const onLocalSearch = (e) => {
    props.onChange(e);
  };

  return (
    <Form className="d-flex align-items-center">
      <InputGroup className="input-group-merge search-bar">
        <InputGroup.Text className="search-icon border-0"></InputGroup.Text>
        <Form.Control
          type="search"
          className="form-control form-control-sm ps-6 "
          placeholder={"search " + title}
          onChange={onLocalSearch}
          value={props.value}
        />
        <a
          data-tooltip-content={"Search " + title}
          data-tooltip-id="search-tooltip"
          data-tooltip-place="top"
          className="mt-2 ms-1"
        >
          <span className="fe fe-search"></span>
        </a>
        <Tooltip id="search-tooltip" />
      </InputGroup>
    </Form>
  );
};

SearchBar.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
