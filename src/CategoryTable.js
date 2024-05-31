import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const CategoryTable = ({ type, summary, transactioncategories }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>{type}</th>
          <th>Tracked</th>
          <th>Budget</th>
          <th>% Completion</th>
          <th>Remaining</th>
          <th>Excess</th>
        </tr>
      </thead>
      <tbody>
        {transactioncategories &&
          transactioncategories
            .filter((transactioncategory) => transactioncategory.type === type)
            .sort((a, b) => b.budget - a.budget)
            .map((transactioncategory) => (
              <tr key={transactioncategory.id}>
                <td>{transactioncategory.name}</td>
                <td>{transactioncategory.tracked}</td>
                <td>{transactioncategory.budget}</td>
                <td>{transactioncategory.completion}</td>
                <td>{transactioncategory.remaining}</td>
                <td>{transactioncategory.excess}</td>
              </tr>
            ))}
        <tr>
          <td>TOTAL</td>
          <td>{isNaN(summary[0]) ? "-" : summary[0]}</td>
          <td>{isNaN(summary[1]) ? "-" : summary[1]}</td>
          <td>{isNaN(summary[2]) ? "-" : summary[2].toFixed(2)}</td>
          <td>{isNaN(summary[3]) ? "-" : summary[3]}</td>
          <td>{isNaN(summary[4]) ? "-" : summary[4]}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CategoryTable;