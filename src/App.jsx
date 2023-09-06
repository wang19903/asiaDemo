import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import PriceInput from "./component/PriceInput";
import AgeGroupSelect from "./component/AgeGroupSelect";
import AgeGroupPriceList from "./component/AgeGroupPriceList";

const App = () => {
  const [overlappingIds, setOverlappingIds] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const price = -7855948.9527;
  const addComma = (number) => {
    //先將數字轉為字串，再以小數點分割，整數部分每3位數增加一個逗號，最後檢查是否有小數部分，有的話再組合回去，沒有就回傳整數
    let [integerPart, decimalPart] = number.toString().split(".");
    integerPart = integerPart.replace(/\d(?=(\d{3})+$)/g, "$&,");

    return decimalPart ? integerPart + "." + decimalPart : integerPart;
  };

  const intervalsExample = [
    [6, 11],
    [5, 8],
    [17, 20],
    [7, 7],
    [14, 17]
  ];

  const getNumberIntervals = (intervals) => {
    //依照每組第1個數字排序大小，把第一組數字先推入merged
    intervals.sort((a, b) => a[0] - b[0]);

    let overlap = [];
    let merged = [];

    for (let i = 0; i < intervals.length; i++) {
      let [start, end] = intervals[i];

      if (i === 0) {
        merged.push([start, end]);
      } else {
        //後續組別的第1個數字如果比merged最後一組的第2個數字小代表重疊
        let lastMergedEnd = merged[merged.length - 1][1];

        if (start <= lastMergedEnd) {
          //確認後續組別是一個區間而不是一個點
          if (start !== end) {
            overlap.push([start, Math.min(end, lastMergedEnd)]);
          }

          merged[merged.length - 1][1] = Math.max(end, lastMergedEnd);
        } else {
          merged.push([start, end]);
        }
      }
    }

    let notInclude = [];
    let lastEnd = 0;
    for (let [start, end] of merged) {
      //merged是排過大小後的陣列，如果start比0大表示0到start-1之間有未包含的數字
      if (start > lastEnd) {
        notInclude.push([lastEnd, start - 1]);
      }
      //lastEnd更新後檢查後續的start如果比lastEnd表示有數字被跳過
      lastEnd = end + 1;
    }
    //題目是0~20，所以lastEnd<20表示還有小於20且未包含的數字
    if (lastEnd < 20) {
      notInclude.push([lastEnd, 20]);
    }

    return {
      overlap,
      notInclude
    };
  };

  const addAgeGroupPrice = () => {
    const id = Date.now().toString();
    const newItem = {
      id,
      range: null
    };
    setAgeGroups((prevGroups) => [...prevGroups, newItem]);
  };

  const handleAgeSelect = useCallback((start, end, id) => {
    setAgeGroups((prevGroups) => {
      let hasChanged = false;

      const updatedGroups = prevGroups.map((group) => {
        if (group.id !== id) return group;

        if (
          !group.range ||
          group.range[0] !== start ||
          group.range[1] !== end
        ) {
          hasChanged = true;
          return { ...group, range: [start, end] };
        }

        return group;
      });

      if (!hasChanged) return prevGroups; // 如果沒有更改，則返回原始數據，這樣將不會觸發任何重新渲染
      return updatedGroups;
    });
  }, []);

  const handleDeleteAgeGroup = (id) => {
    setAgeGroups((prev) => prev.filter((group) => group.id !== id));
  };

  function checkOverlapWithAgeGroups(overlaps, ageGroups) {
    return ageGroups
      .filter((group) => {
        const [groupStart, groupEnd] = group.range || [];
        return overlaps.some(([overlapStart, overlapEnd]) => {
          return groupStart <= overlapEnd && groupEnd >= overlapStart;
        });
      })
      .map((group) => group.id); // 只返回id列表
  }

  useEffect(() => {
    const result = ageGroups
      .filter((item) => item.range && !item.range.includes(null))
      .map((item) => item.range);
    const { overlap } = getNumberIntervals(result);
    const newOverlappingIds = checkOverlapWithAgeGroups(overlap, ageGroups);
    setOverlappingIds(newOverlappingIds);
  }, [ageGroups]);

  return (
    <div className="App">
      <h1>測驗內容</h1>
      <div>
        <h3>請根據如下條件實作使用正規表達式將數字加上千分位的 function</h3>
        <p>input : {price}</p>
        <p>output: -7,855,948.9527</p>
        <p>result: {addComma(price)}</p>
      </div>
      <div>
        <h3>
          請根據如下條件實作找出數字 0 到 20 間重疊與未包含的數字區間 function
        </h3>
        <p>input:{"[[6, 11], [5, 8], [17, 20], [7, 7], [14,17]]"}</p>
        <p>
          output:
          {"{ overlap: [[6, 8], [17, 17]], notInclude: [[0, 4], [12, 13]] }"}
        </p>
        <p>result: {JSON.stringify(getNumberIntervals(intervalsExample))}</p>
      </div>
      <div className="flex-col align-center">
        <h3>實作 PriceInput 元件</h3>
        <div className="dot-border-container">
          <PriceInput></PriceInput>
        </div>
      </div>
      <div className="flex-col align-center">
        <h3>實作 AgeGroupSelect 元件</h3>
        <div className="dot-border-container">
          <AgeGroupSelect></AgeGroupSelect>
        </div>
      </div>
      <div className="dot-border-container">
        {/*onChange={(result) => console.log(999,result)}題目要求，不進行其他動作*/}
        <AgeGroupPriceList
          ageGroups={ageGroups}
          onSelect={handleAgeSelect}
          onChange={(result) => console.log(result)}
          onDelete={handleDeleteAgeGroup}
          isOverlapping={(id) => overlappingIds.includes(id)}
        />
        <div className="flex button-container">
          <div onClick={addAgeGroupPrice} className="button">
            <span className="mark">＋</span>新增價格設定
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
