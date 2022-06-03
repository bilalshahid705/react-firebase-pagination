import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersData } from "../../redux/usersSlice";
import { Button } from "react-bootstrap";
import Table from "../table";
import "./usersData.scss";

const UsersTableComponent = () => {
  const dispatch = useDispatch();
  const { usersList, dataEndCheck } = useSelector((state) => state.users);
  const [columns, setColumns] = useState(null);

  useEffect(() => {
    dispatch(fetchUsersData());
  }, [dispatch]);

  useEffect(() => {
    if (usersList.length > 0) {
      setColumns([
        {
          Header: "Users Table",
          columns: [
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Email",
              accessor: "email",
            },
            {
              Header: "Gender",
              accessor: "gender",
            },
          ],
        },
      ]);
    }
  }, [usersList]);

  const handleSeeMore = () => {
    dispatch(fetchUsersData());
  };

  return (
    <div className="users-Data-style">
      {columns && usersList.length > 0 && (
        <div>
          <Table
            columns={columns}
            data={usersList}
            tableHeading={"Users Data"}
          />
          <div className="see-more-style">
            {!dataEndCheck ? (
              <Button onClick={handleSeeMore}>See More</Button>
            ) : (
              <p style={{ textAlign: "center", fontSize: "12px" }}>
                No More Data Available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTableComponent;
