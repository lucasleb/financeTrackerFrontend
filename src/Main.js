import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";
import UserAccount from "./UserAccount";
import UserGroups from "./UserGroups";
import UserGroupInvitations from "./UserGroupInvitations";
import TransactionCategories from "./TransactionCategories";
import CategoryTable from "./CategoryTable";

const Main = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [usergroups, setUsergroups] = useState(null);
  const [transactioncategories, setTransactionCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [expensesSummary, setExpensesSummary] = useState([0, 0, 0, 0, 0]);
  const [incomesSummary, setIncomesSummary] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (transactioncategories) {
      const newExpensesSummary = transactioncategories
        .filter((transactioncategory) => transactioncategory.type === "EXPENSE")
        .reduce(
          (totals, transactioncategory) => {
            totals[0] += transactioncategory.tracked;
            totals[1] += transactioncategory.budget;
            totals[2] = totals[1] !== 0 ? (totals[0] / totals[1]) * 100 : 0;

            totals[3] += transactioncategory.remaining;
            totals[4] += transactioncategory.excess;
            return totals;
          },
          [0, 0, 0, 0, 0]
        );
      setExpensesSummary(newExpensesSummary);
      const newIncomesSummary = transactioncategories
        .filter((transactioncategory) => transactioncategory.type === "INCOME")
        .reduce(
          (totals, transactioncategory) => {
            totals[0] += transactioncategory.tracked;
            totals[1] += transactioncategory.budget;
            totals[2] = totals[1] !== 0 ? (totals[0] / totals[1]) * 100 : 0;

            totals[3] += transactioncategory.remaining;
            totals[4] += transactioncategory.excess;
            return totals;
          },
          [0, 0, 0, 0, 0]
        );
      setIncomesSummary(newIncomesSummary);
    }
  }, [transactioncategories]);

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching user data.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const fetchUserGroups = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/usergroups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsergroups(response.data);
        return response.data; // return the fetched data
      } catch (err) {
        console.error(err);
        alert("Error fetching usergroups data.");
      }
    }
  };

  const handleSelectUserGroup = (usergroupId) => {
    fetchUserGroupTransactionCategories(usergroupId);
  };

  const fetchUserGroupTransactionCategories = async (userGroupId) => {
    if (token) {
      try {
        const response = await axios.get(
          `${BASE_URL}/transactioncategories/usergroup/${userGroupId}/overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactionCategories(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching usergroups data.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
      const userGroupsData = await fetchUserGroups();
      if (userGroupsData && userGroupsData.length > 0) {
        fetchUserGroupTransactionCategories(userGroupsData[0].id);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/transactions`, {
          // params: {
          //   category: selectedCategory,
          //   keyword: searchKeyword,
          // },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [selectedCategory, searchKeyword]);

  return (
    <div>
      <h2>Select a User Group </h2>
      <select onChange={(e) => handleSelectUserGroup(e.target.value)}>
        {usergroups &&
          usergroups.map((usergroup) => (
            <option key={usergroup.id} value={usergroup.id}>
              {usergroup.groupName}
            </option>
          ))}
      </select>

      <h2>Budget Breakdown </h2>
      <CategoryTable
        type="INCOME"
        summary={incomesSummary}
        transactioncategories={transactioncategories}
      />

      <CategoryTable
        type="EXPENSE"
        summary={expensesSummary}
        transactioncategories={transactioncategories}
      />

      <h2>Filter Transactions</h2>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {transactioncategories &&
          transactioncategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>
      <input
        type="text"
        placeholder="Search by keyword"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      <h2>Transactions</h2>
      {transactions.map((transaction) => (
        <div key={transaction.id}>{/* Render transaction details */}</div>
      ))}
    </div>
  );
};

export default Main;
