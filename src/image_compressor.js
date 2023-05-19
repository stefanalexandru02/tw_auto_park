import compress_images from "compress-images";
import fs from 'fs';

if (!fs.existsSync("static/resources/images/")){
  fs.mkdirSync("static/resources/images/");
}

const INPUT_path_to_your_images = "images/**/*";
const OUTPUT_path = "static/resources/images/";

compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: { engine: "webp", command: ["-q", "60"] } },
                { png: { engine: "webp", command: false } },
                { svg: { engine: "svgo", command: "--multipass" } },
                { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
  function (error, completed, statistic) {
    console.log("-------------");
    console.log(error);
    console.log(completed);
    console.log(statistic);
    console.log("-------------");
  }
);

fs.readdir("images", (err, files) => {
  files.map(file => {
    if(file.includes(".webp")) {
      console.log(`Already compressed ${file}`);
      fs.copyFileSync(`images/${file}`, `static/resources/images/${file}`);
    }
  });
});