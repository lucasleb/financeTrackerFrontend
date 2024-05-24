import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const TransactionCategories = ({ token }) => {
    const [transactioncategories, setTransactioncategories] = useState(null);
    
    const fetchTransactionCategories = async () => {
        if (token) {
        try {
            const response = await axios.get(`${BASE_URL}/transactioncategories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
    
            setTransactioncategories(response.data);
        } catch (err) {
            console.error(err);
            alert("Error fetching transactioncategories data.");
        }
        }
    };
    
    useEffect(() => {
        fetchTransactionCategories();
    }, [token]);
    
    return (
        <div>
        <h2>Transaction Categories</h2>
        <ul>
            {transactioncategories &&
            transactioncategories.map((transactioncategory) => (
                <li key={transactioncategory.id}>{transactioncategory.name}</li>
            ))}
        </ul>
        </div>
    );
    };

export default TransactionCategories;