import React from "react";
import ReactDOM from "react-dom";

function ProductCategoryRow(props) {
  return (
    <tr>
      <th colSpan="2">{props.categoryName}</th>
    </tr>
  );
}

function ProductRow(props) {
  const name = props.product.name;
  const price = props.product.price;
  const isStocked = props.product.stocked;

  if (isStocked) {
    return (
      <tr>
        <td>{name}</td>
        <td>{price}</td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td>
          <span style={{ color: "red" }}>{name}</span>
        </td>
        <td>{price}</td>
      </tr>
    );
  }
}

function ProductTable(props) {
  const rows = [];
  let lastRowCategory = null;

  // 给每个分类加上副标题
  props.products.forEach(singleProduct => {
    // 如果这个产品和上个产品的分类不同那么就把分类副标题加上(这只是个简单逻辑，对数据有要求)
    if (singleProduct.category !== lastRowCategory) {
      rows.push(
        <ProductCategoryRow
          key={rows.length}
          categoryName={singleProduct.category}
        />
      );
    }

    rows.push(<ProductRow key={rows.length} product={singleProduct} />);
    lastRowCategory = singleProduct.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar(props) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={props.searchKey}
        onChange={props.onChange}
      />
      <p>
        <input
          type="checkbox"
          checked={props.isOnlyShowInStock}
          onChange={props.onCheckChange}
        />{" "}
        Only show products in stock
      </p>
    </form>
  );
}

class FilterProductManager extends React.Component {
  constructor() {
    super();
    this.state = {
      searchKey: "",
      isOnlyShowInStock: false
    };
    this.onSearchKeyChange = this.onSearchKeyChange.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
  }

  onCheckChange(event) {
    this.setState({
      isOnlyShowInStock: event.target.checked
    });
  }

  onSearchKeyChange(event) {
    this.setState({
      searchKey: event.target.value
    });
  }

  render() {
    // 获取筛选出来的产品列表
    const filterProducts = this.props.products.filter(singleProduct => {
      if (
        singleProduct.name
          .toLowerCase()
          .indexOf(this.state.searchKey.toLowerCase()) !== -1
      ) {
        if (this.state.isOnlyShowInStock) {
          return singleProduct.stocked;
        } else {
          return true;
        }
      } else {
        return false;
      }
    });

    return (
      <div>
        <SearchBar
          searchKey={this.state.searchKey}
          onChange={this.onSearchKeyChange}
          isOnlyShowInStock={this.state.isOnlyShowInStock}
          onCheckChange={this.onCheckChange}
        />
        <ProductTable products={filterProducts} />
      </div>
    );
  }
}

var PRODUCTS = [
  {
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football"
  },
  {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball"
  },
  {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball"
  },
  {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch"
  },
  {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5"
  },
  { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }
];

ReactDOM.render(
  <FilterProductManager products={PRODUCTS} />,
  document.getElementById("root")
);
