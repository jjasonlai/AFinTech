import React from "react";
import { ListGroup, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function SingleBorrowerRecord({ item }) {
  const numberWithCommas = (x, decimal = 0) => {
    return x.toLocaleString("en-US", { minimumFractionDigits: decimal });
  };

  const navigate = useNavigate();

  const viewDetail = () => {
    navigate(`/borrowers/details/${item.id}`, {
      state: { type: `Borrower_View`, payload: item },
    });
  };

  return (
    <ListGroup.Item key={item.id}>
      <Row>
        <Col className="col-auto">
          <div
            className={`avatar avatar-md avatar-indicators avatar-${item.statusTypes.name}`}
          >
            <Image
              alt="avatar"
              src={item.user.avatarUrl}
              className="rounded-circle"
            />
          </div>
        </Col>
        <Col className="ms-n3">
          <h4 className="mb-0 h5">
            {item.user.firstName} {item.user.lastName}
          </h4>
          <span className="me-2 fs-6">
            <span className="text-dark  me-1 fw-semi-bold">
              ${numberWithCommas(item.annualIncome)}
            </span>
            Annual Income
          </span>
        </Col>
        <Col className="col-auto">
          <i onClick={viewDetail} className="fe fe-external-link">
            {" "}
            View Detail
          </i>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

SingleBorrowerRecord.propTypes = {
  item: PropTypes.isRequired,
};

export default SingleBorrowerRecord;
