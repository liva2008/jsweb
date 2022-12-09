import { uniqueString } from "https://deno.land/x/uniquestring/mod.ts";
import { Hash } from "https://deno.land/x/checksum@1.4.0/mod.ts";

export const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
export const randomHexColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const textHash = (text: string) => {
  return new Hash("md5").digestString(text).hex();
};

export function makeCaptcha() {
  const svgHeight = 120;
  const svgWidth = 300;
  const numberOfCharacters = 4;
  const numberOfLines = 30;
  let svgContext =
    `<svg xmlns="http://www.w3.org/2000/svg" fill='' width="${svgWidth}" height="${svgHeight}" viewBox="0,0,${svgWidth},${svgHeight}">`;
  
    //背景画线
  for(let line = 0; line < numberOfLines; line++){
    let x1 = Math.round(randomNumber(0, svgWidth));
    let y1 = Math.round(randomNumber(0, svgHeight));
    let x2 = Math.round(randomNumber(0, svgWidth));
    let y2 = Math.round(randomNumber(0, svgHeight));
    let lineColor = randomHexColor();
    let lineWidth = Math.round(randomNumber(0, 5));
    svgContext += `<line x1='${x1}' y1="${y1}" x2="${x2}" y2="${y2}" stroke='${lineColor}' fill="transparent" stroke-width="${lineWidth}" />`;
  }
  
    const text = uniqueString(numberOfCharacters);
  let textElementXPosition = 30,
    textElementYPosition = 4 * svgHeight / 5,
    textColor = "";
  for (let character = 0; character < numberOfCharacters; character++) {
    let fontSize = randomNumber(5, 7,);
    textColor = randomHexColor();
    let textRotate = randomNumber(-30, 30);

    svgContext +=
      `<text fill="${textColor}" x="${textElementXPosition}" y="${textElementYPosition}" font-size="${fontSize}rem" rotate="${textRotate}">${text[character]
      }</text>`;
    textElementXPosition += randomNumber(
      (svgWidth / 2 / numberOfCharacters),
      svgWidth / numberOfCharacters);
    textElementYPosition = 4 * svgHeight / 5;
  }
  
  svgContext += `</svg>`;
  //console.log(text);
  //console.log(svgContext);
  return {
    text: text,
    svgContext: getImageDataURL(svgContext)
  };
}

function getImageDataURL(svgXml) {
  return "data:image/svg+xml;base64," + btoa(svgXml);
}