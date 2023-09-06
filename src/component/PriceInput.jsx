import React, { useRef, useState } from "react";

const PriceInput = ({ id = -1, onPriceChange = () => {} }) => {
  const [displayPrice, setDisplayPrice] = useState("0");
  const hiddenInputRef = useRef(null);
  const [isError, setIsError] = useState(false);

  const addComma = (numberStr) => {
    if (!numberStr) return "";
    const isNegative = numberStr.startsWith("-");
    if (isNegative) {
      numberStr = numberStr.slice(1);
    }
    let [integerPart, decimalPart] = numberStr.split(".");
    integerPart = integerPart.replace(/^0+/, "");
    if (!integerPart) integerPart = "0";
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let formattedNumber =
      decimalPart !== undefined ? integerPart + "." + decimalPart : integerPart;
    return isNegative ? "-" + formattedNumber : formattedNumber;
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    if (value === "") {
      setIsError(true);
      setDisplayPrice("");
      onPriceChange(id, null);
    } else {
      setIsError(false);
      setDisplayPrice(addComma(value));
      onPriceChange(id, value);
    }
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;
    const allowKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "-",
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight"
    ];

    if ((e.key === "." || e.key === "Process") && value.includes(".")) {
      e.preventDefault();
      return;
    }
    if (!allowKeys.includes(e.key)) {
      e.preventDefault();
      return;
    } else if (e.key === "-" && value.length !== 0) {
      e.preventDefault();
      return;
    }
  };

  const handleClick = () => {
    hiddenInputRef.current.focus();
  };

  return (
    <div className="input-container">
      <label>{"入住費用(每人每晚)"}</label>
      <div
        onClick={handleClick}
        className="flex"
        style={{ position: "relative" }}
      >
        <div className="currency left-border-radius flex justify-center align-center">
          TWD
        </div>
        <input
          ref={hiddenInputRef}
          type="text"
          style={{ position: "absolute", opacity: 0, top: 0, right: 0 }} // hidden input
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={displayPrice.replace(/,/g, "")} 
        />
        <input
          className="price-input right-border-radius"
          type="text"
          value={displayPrice}
          readOnly
          placeholder="請輸入費用"
        />
      </div>
      {isError && <div className="error">不可以為空白</div>}
      <p className="input-tip">輸入0表示免費</p>
    </div>
  );
};

export default PriceInput;
