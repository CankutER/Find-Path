const board = document.querySelector(".board");
const columns = 50;
const rows = 25;
let prevId;
// let pathArr = [];
// let allpaths = [];
// promisifying the findpath function to manage the compt. workload
const pathPromise = function (pathObject) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(findPath(pathObject));
    }, 0);
  });
};
//
function Box(row, column) {
  this.domElement = document.getElementById(`${row}x${column}`);
  this.domElement.textContent = `${row}x${column}`;
  if (column > 1) {
    this.leftNeighbour = {
      domElement: document.getElementById(`${row}x${column - 1}`),
      weight: 1,
    };
  }
  if (column < 50) {
    this.rightNeighbour = {
      domElement: document.getElementById(`${row}x${column + 1}`),
      weight: 1,
    };
  }
  if (row > 1) {
    this.upNeighbour = {
      domElement: document.getElementById(`${row - 1}x${column}`),
      weight: 1,
    };
  }
  if (row < 25) {
    this.downNeighbour = {
      domElement: document.getElementById(`${row + 1}x${column}`),
      weight: 1,
    };
  }
  if (row > 1 && column > 1) {
    this.upLeftNeighbour = {
      domElement: document.getElementById(`${row - 1}x${column - 1}`),
      weight: 1.41,
    };
  }
  if (row > 1 && column < 50) {
    this.upRightNeighbour = {
      domElement: document.getElementById(`${row - 1}x${column + 1}`),
      weight: 1.41,
    };
  }
  if (row < 25 && column > 1) {
    this.downLeftNeighbour = {
      domElement: document.getElementById(`${row + 1}x${column - 1}`),
      weight: 1.41,
    };
  }
  if (row < 25 && column < 50) {
    this.downRightNeighbour = {
      domElement: document.getElementById(`${row + 1}x${column + 1}`),
      weight: 1.41,
    };
  }
  this.allNeighbours = [
    this.upNeighbour,
    this.downNeighbour,
    this.leftNeighbour,
    this.rightNeighbour,
    this.upLeftNeighbour,
    this.upRightNeighbour,
    this.downLeftNeighbour,
    this.downRightNeighbour,
  ];
  this.neighbours = this.allNeighbours.filter(
    (neighbour) => neighbour !== undefined
  );
}
function createObjects() {
  for (let i = 1; i <= rows; i++) {
    for (let x = 1; x <= columns; x++) {
      window[`box${i}x${x}`] = new Box(i, x);
    }
  }
}

const initialize = () => {
  for (let i = 1; i <= rows; i++) {
    for (let x = 1; x <= columns; x++) {
      const cell = document.createElement("div");
      cell.classList.add("box");
      cell.setAttribute("data-column", x);
      cell.setAttribute("data-row", i);
      cell.setAttribute("id", `${i}x${x}`);
      board.appendChild(cell);
    }
  }
};
initialize();
createObjects();

const boxes = document.querySelectorAll(".box");

let startPoint;
let endPoint;
let setter = 0;

boxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    console.log(e.currentTarget);
    console.log(setter);
    if (setter === 0) {
      id = e.currentTarget.getAttribute("id");
      startPoint = window[`box${id}`];

      startPoint.domElement.classList.add("selected");
      setter++;
    } else if (setter === 1) {
      id = e.currentTarget.getAttribute("id");
      endPoint = window[`box${id}`];

      endPoint.domElement.classList.add("selected");
      setter++;
      findPath(startPoint);
    } else {
      let selecteds = document.querySelectorAll(".selected");
      selecteds.forEach((item) => item.classList.remove("selected"));

      endPoint = undefined;
      startPoint = undefined;
      setter = 0;
    }
  });
});

async function findPath(start) {
  // pathArr.push(start);

  console.log(window[`box${prevId}`]);
  console.log(start);
  start.domElement.classList.add("selected");
  let rowDiff =
    parseInt(endPoint.domElement.dataset.row) -
    parseInt(start.domElement.dataset.row);
  let colDiff =
    parseInt(endPoint.domElement.dataset.column) -
    parseInt(start.domElement.dataset.column);
  // console.log(rowDiff);
  // console.log(colDiff);
  if (
    start.neighbours.find(
      (neighbour) => neighbour.domElement === endPoint.domElement
    )
  ) {
    let destination = start.neighbours.find(
      (neighbour) => neighbour.domElement === endPoint.domElement
    );
    destination.domElement.classList.add("selected");
    console.log("FOUND IT");
    // pathArr.push(window[`box${destination.domElement.getAttribute("id")}`]);
    // allpaths.push(pathArr);
    // pathArr = [];
    // let selecteds = document.querySelectorAll(".selected");
    // selecteds.forEach((item) => item.classList.remove("selected"));
    return;
  } else {
    let neighbours = start.neighbours;

    let neighboursFiltered = [];
    if (rowDiff > 0) {
      if (colDiff > 0) {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) >
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) >
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      } else if (colDiff < 0) {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) >
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) <
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      } else {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) >
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) ===
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      }
    } else if (rowDiff == 0) {
      if (colDiff > 0) {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) ===
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) >
                parseInt(start.domElement.dataset.column)
            );
          })
        );
        console.log(neighboursFiltered);
      } else if (colDiff < 0) {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) ===
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) <
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      } else {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) ===
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) ===
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      }
    } else {
      if (colDiff > 0) {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) <
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) >
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      } else if (colDiff < 0) {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) <
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) <
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      } else {
        neighboursFiltered.push(
          ...neighbours.filter((neighbour) => {
            return (
              parseInt(neighbour.domElement.dataset.row) <
                parseInt(start.domElement.dataset.row) &&
              parseInt(neighbour.domElement.dataset.column) ===
                parseInt(start.domElement.dataset.column)
            );
          })
        );
      }
    }

    //
    prevId = start.domElement.getAttribute("id");
    console.log(neighboursFiltered);
    for (const neighbour of neighboursFiltered) {
      let id = neighbour.domElement.getAttribute("id");

      let neighbourObject = window[`box${id}`];

      await pathPromise(neighbourObject);
    }

    // neighboursFiltered.forEach(async (neighbour) => {
    //   let id = neighbour.domElement.getAttribute("id");

    //   let neighbourObject = window[`box${id}`];
    //   console.log(neighbourObject);
    //   await findPath(neighbourObject);
    // });
  }
}

// findPath(startPoint);
