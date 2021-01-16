// CAnvas

const canvas = document.querySelector("#map");

const ctx = canvas.getContext("2d");
const canvasContainerWidth = document.querySelector(".Map").offsetWidth;
const canvasContainerHeight = document.querySelector(".Map").offsetHeight;
canvas.width = canvasContainerWidth;
canvas.height = canvasContainerHeight;

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
      canvasContainerWidth,
      canvasContainerHeight
    );
  };
};

export const clearMap = () =>
  ctx.clearRect(0, 0, canvasContainerWidth, canvasContainerHeight);

export const drawTotalRightAnswers = (testsQuantity, allCountriesTotal) => {
  ctx.font = "30px serif";
  ctx.fillText(
    `Total Righ Answers: ${allCountriesTotal} of ${testsQuantity}`,
    canvas.width * 0.2,
    canvasContainerWidth / 2,
    canvasContainerHeight * 0.6
  );
};
