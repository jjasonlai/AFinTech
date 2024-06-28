import React, { useState, useEffect } from "react";
import dashBoardsService from "services/dashboardService";
import debug from "sabio-debug";
import { Col, Row, Card } from "react-bootstrap";
import Lenders from "./Lenders";
import Borrowers from "./Borrowers";
import StatIcon from "./StatIcon";
import ApexCharts from "./ApexCharts";
import LoanApplications from "./LoanApplications";
import UsersList from "./UsersList";
import { ApplicationChartOptions } from "./charData";
import "./AdminDashboard.css";

//Add a comment to test webhook
function AdminDashBoard() {
  const _logger = debug.extend("AdminDashboard");
  const [dashboardData, setDashboardData] = useState({
    successApplications: 0,
    droppedOffApplications: 0,
    pendingApplications: 0,
    totalApplications: 0,
    totalUsers: 0,
    lenders: [],
    borrowers: { totalCount: 0, pagedItems: [] },
    loanApplications: [],
    users: { totalCount: 0, pagedItems: [] },
  });

  useEffect(() => {
    dashBoardsService
      .getDashboardData()
      .then(onGetDashboardDataSuccess)
      .catch(onGetDashboardDataError);
  }, []);

  const onGetDashboardDataSuccess = (data) => {
    _logger(data);
    _logger("users => ", data.item.users);
    setDashboardData((prevState) => {
      const newDashData = {
        ...prevState,
        ...data.item,
      };
      return newDashData;
    });
  };

  const onGetDashboardDataError = (error) => {
    _logger(error);
  };

  const ApplicationChartSeries = [
    dashboardData.successApplications,
    dashboardData.droppedOffApplications,
    dashboardData.pendingApplications,
  ];

  return (
    <div>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between align-items-center">
            <div className="mb-3 mb-lg-0">
              <h1 className="mb-0 h2 fw-bold">Dashboard</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={3} lg={6} md={12} sm={12}>
          <StatIcon
            title="Loan Submission Rates"
            value={(
              (dashboardData.successApplications +
                dashboardData.pendingApplications) /
              dashboardData.totalApplications
            ).toFixed(2)}
            iconName="check-circle"
            iconColorVariant="primary"
            classValue="mb-4"
          />
        </Col>

        <Col xl={3} lg={6} md={12} sm={12}>
          <StatIcon
            title="Successful Loan Applications"
            value={dashboardData.successApplications}
            iconName="file-text"
            iconColorVariant="primary"
            classValue="mb-4"
          />
        </Col>

        <Col xl={3} lg={6} md={12} sm={12}>
          <StatIcon
            title="Drop-offs"
            value={dashboardData.droppedOffApplications}
            iconName="x-circle"
            iconColorVariant="primary"
            classValue="mb-4"
          />
        </Col>

        <Col xl={3} lg={6} md={12} sm={12}>
          <StatIcon
            title="Users"
            value={dashboardData.totalUsers}
            iconName="users"
            iconColorVariant="primary"
            classValue="mb-4"
          />
        </Col>
      </Row>
      <div className="table-container">
        <Row>
          <Col xl={4} lg={12} md={12} className="mb-4 table-cell">
            <Card className="h-100">
              <Card.Header className="align-items-center card-header-height d-flex">
                <div>
                  <h4 className="mb-0">Application Submissions</h4>
                </div>
              </Card.Header>
              <Card.Body className="py-lg-7">
                <div id="chart">
                  <ApexCharts
                    options={ApplicationChartOptions}
                    series={ApplicationChartSeries}
                    type="donut"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={6} md={12} className="mb-4 table-cell">
            <Lenders title="Lenders" lendersData={dashboardData.lenders} />
          </Col>
          <Col xl={4} lg={6} md={12} className="mb-4 table-cell">
            <Borrowers
              title="Borrowers"
              borrowersData={dashboardData.borrowers}
            />
          </Col>
        </Row>
      </div>
      <Row className="mb-4">
        <LoanApplications
          title="Loan Applications"
          key="loanapplications"
          loanApplicationsData={dashboardData.loanApplications}
        />
      </Row>
      <Row className="mb-4">
        <UsersList title="Users" key="users" usersData={dashboardData.users} />
      </Row>
    </div>
  );
}

export default AdminDashBoard;
