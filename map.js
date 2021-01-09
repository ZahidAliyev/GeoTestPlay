// CAnvas

const canvas = document.querySelector("#map");

const ctx = canvas.getContext("2d");

canvas.width = document.querySelector(".Map").offsetWidth;
canvas.height = document.querySelector(".Map").offsetHeight;

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

export const clearMap = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

export const drawTotalRightAnswers = (testsQuantity, allCountriesTotal) =>  {
  ctx.font = '30px serif';
  // ctx.textAlign = 'center';
  ctx.fillText(`Total Righ Answers: ${allCountriesTotal} of ${testsQuantity}`, canvas.width*0.2, canvas.height/2, canvas.width*0.6);
  
}