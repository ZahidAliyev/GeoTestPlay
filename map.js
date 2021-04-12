// CAnvas
const MAP_CONTAINER = document.querySelector(".Map");
const canvas = document.querySelector("#map");

const ctx = canvas.getContext("2d");

canvas.width = MAP_CONTAINER.offsetWidth;
canvas.height = MAP_CONTAINER.offsetHeight;



export const drawMap = (country) => {
  const image = new Image();
  image.src = `${country.image}`;
  image.onload = () => {
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };
};

export const clearMap = () =>
  ctx.clearRect(0, 0, MAP_CONTAINER.offsetWidth, MAP_CONTAINER.offsetHeight);

export const drawTotalRightAnswers = (testsQuantity, allCountriesTotal) => {
  ctx.font = "30px serif";
  ctx.fillText(
    `Total Righ Answers: ${allCountriesTotal} of ${testsQuantity}`,
    MAP_CONTAINER.offsetWidth * 0.3,
    MAP_CONTAINER.offsetHeight * 0.5,
    MAP_CONTAINER.offsetWidth * 0.4
  );
};
export const changeCanvasHeightForSmallDevide = (percentOfFullHeight) =>
  (canvas.height *= percentOfFullHeight);

export const changeCanvasSizeForResize = (e) => {
  canvas.width = MAP_CONTAINER.offsetWidth
  canvas.height = MAP_CONTAINER.offsetHeight


};
