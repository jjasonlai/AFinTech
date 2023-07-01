import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

const StatIcon = (props) => {
  const { title, value, iconName, iconColorVariant, classValue } = props;

  return (
    <Card border="light" className={`${classValue}`}>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3 lh-1">
          <div>
            <span className="fs-6 text-uppercase fw-semi-bold">{title}</span>
          </div>
          <div>
            <span
              className={`fe fe-${iconName} fs-3 text-${iconColorVariant}`}
            ></span>
          </div>
        </div>
        <h2 className="fw-bold mb-1">{value}</h2>
      </Card.Body>
    </Card>
  );
};

StatIcon.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  iconColorVariant: PropTypes.string.isRequired,
  classValue: PropTypes.string.isRequired,
};

export default StatIcon;
