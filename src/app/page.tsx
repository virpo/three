"use client";

import { useEffect, useState } from "react";
import "./page.scss";

export default function Home() {
  const [grid, setGrid] = useState<number[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(0))
  );

  useEffect(() => {
    const initialGrid = Array(5)
      .fill(null)
      .map(() => Array(5).fill(0));
    initialGrid[2][2] = 1;
    initialGrid[3][1] = 1;
    setGrid(initialGrid);
  }, []);

  const updateGrid = (i: number, j: number, value: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]); // Create a shallow copy of the grid
      newGrid[i][j] = value; // Update the specific cell
      return newGrid;
    });
  };

  const increase = (i: number, j: number) => {
    updateGrid(i, j, grid[i][j] + 1);
  };

  if (grid) {
    return (
      <main className="main">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="row">
            {[...Array(5)].map((_, j) => (
              <div
                key={`${i}:${j}`}
                className="cell"
                onClick={() => increase(i, j)}
              >
                {grid[i][j]}
              </div>
            ))}
          </div>
        ))}
      </main>
    );
  } else {
    ("Loading...");
  }
}
