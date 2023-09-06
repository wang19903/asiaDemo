import { useState, useEffect } from "react";
import PriceInput from "./PriceInput";
import AgeGroupSelect from "./AgeGroupSelect";

const AgeGroupPriceList = ({
  ageGroups,
  onSelect,
  onChange,
  onDelete,
  isOverlapping
}) => {
  const [results, setResults] = useState({});

  const handleSelectChange = (start, end, id) => {
    onSelect(start, end, id);

    if (start !== null && end !== null) {
      const currentAgeGroup = ageGroups.find((group) => group.id === id);
      const ageGroup = currentAgeGroup ? currentAgeGroup.range : null;

      setResults((prevResults) => {
        if (prevResults[id]?.ageGroup !== ageGroup) {
          return {
            ...prevResults,
            [id]: {
              ...prevResults[id],
              ageGroup
            }
          };
        }
        return prevResults; // 若沒有變化，直接回傳原先的 state
      });
    }
  };

  const handlePriceChange = (id, price) => {
    setResults((prevResults) => {
      if (prevResults[id]?.price !== price) {
        return {
          ...prevResults,
          [id]: {
            ...prevResults[id],
            price: price
          }
        };
      }
      return prevResults;
    });
  };

  const handleRemove = (id) => {
    onDelete(id);

    setResults((prevResults) => {
      const updatedResults = { ...prevResults };
      delete updatedResults[id];
      return updatedResults;
    });
  };

  useEffect(() => {
    let result = [];
    for (const id in results) {
      let item = results[id];
      result.push(item);
      if (item.ageGroup && item.price !== null) {
        onChange(result);
      }
    }

  }, [results, onChange]);

  return (
    <>
      {ageGroups.map((item, index) => (
        <div key={item.id} id={item.id} className="input-container">
          <div className="form-container">
            <div className="flex align-center form-title tt">
              <p>價格設定 - {index + 1}</p>
              <div onClick={() => handleRemove(item.id)} className="button">
                <span className="mark">ｘ</span>移除
              </div>
            </div>
            <div className="flex form-input-container">
              <AgeGroupSelect
                id={item.id}
                onSelect={handleSelectChange}
                error={isOverlapping(item.id)}
              ></AgeGroupSelect>
              <PriceInput
                id={item.id}
                onPriceChange={handlePriceChange}
              ></PriceInput>
            </div>
          </div>
          {index !== ageGroups.length - 1 && <div className="divide"></div>}
        </div>
      ))}
    </>
  );
};

export default AgeGroupPriceList;
