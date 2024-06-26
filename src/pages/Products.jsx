import React, { useEffect, useState } from "react";
import Heading from "../typography/Heading";
import Filters from "../typography/Filters";
import CheckBox from "../typography/CheckBox";
import { productsFilter } from "../data";
import axios from "axios";
import { Triangle } from "react-loader-spinner";

const Products = () => {
  const [data, setData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://5fc1a1c9cb4d020016fe6b07.mockapi.io/api/v1/products"
        );
        let filteredData = response.data;

        if (selectedFilter !== null) {
          const filterValue = productsFilter[selectedFilter].filter;

          if (filterValue === "Low Stock") {
            filteredData = filteredData.filter(
              (product) => product.stock < 600
            );
          } else if (filterValue === "Expired") {
            const currentDate = new Date();
            filteredData = filteredData.filter(
              (product) => new Date(product.expiryDate) < currentDate
            );
          }
        }

        setData(filteredData);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter]);

  function handleCheck(index) {
    setSelectedFilter(index);
  }

  return (
    <div className="products-Main-Container">
      <div className="products-Container">
        <Heading title="Products" />
        <div className="products-Container-Left">
          <div className="products-Container-Left1">
            <div className="products-left-filter">
              <Filters />
              <h4>Count: {data ? data.length : 0}</h4>
            </div>
            <div className="products-Checkbox-Div">
              {productsFilter.map((value, index) => (
                <div key={index} onClick={() => handleCheck(index)}>
                  <CheckBox title={value.filter} />
                </div>
              ))}
            </div>
          </div>
          <div className="products-table-container">
            {loading ? (
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : (
              data && (
                <table className="products-table">
                  <thead>
                    <tr className="Table-Heading">
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Product Brand</th>
                      <th>Expiry Date</th>
                      <th>Unit Price</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((value, index) => (
                      <tr key={index}>
                        <td className="c1">{value.id}</td>
                        <td className="c0">{value.medicineName}</td>
                        <td className="c1">{value.medicineBrand}</td>
                        <td className="c0">{value.expiryDate}</td>
                        <td className="c1">${value.unitPrice}</td>
                        <td className="c1">{value.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
