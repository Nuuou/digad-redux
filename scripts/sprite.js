const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Spritesmith = require('spritesmith');
const glob = require('glob');
const templater = require('spritesheet-templates');
const sass = require('node-sass');

const pixelRatio = 2;
const spritePattern = '_ui/skin/src/img/sprite/**/*.png';
const spriteSheetImageFilename = 'sprite.png';
const spriteSheetImageOutput = '_ui/skin/src/img';
const spriteSheetStyleFilename = '_sprite.scss';
const spriteSheetStyleOutput = '_ui/skin/src/sass';

const sprites = glob.sync(spritePattern);
Spritesmith.run({
  src: sprites,
  padding: 10,
}, (err, result) => {
  if (err) {
    throw err;
  }

  /**
   * GENERATE SPRITE FILE.
   */
  //fs.writeFileSync(path.resolve(spriteSheetImageOutput), result.image);

  const spritesCoordinates = [];
  Object.entries(result.coordinates).forEach(([key, val]) => {
    const name = path.basename(key, path.extname(key));
    spritesCoordinates.push({
      x: Math.ceil(val.x / pixelRatio),
      y: Math.ceil(val.y / pixelRatio),
      width: Math.ceil(val.width / pixelRatio),
      height: Math.ceil(val.height / pixelRatio),
      name
    })
  });

  /**
   * IMAGE MINIFICATION.
   */
  (async () => {
    imagemin.buffer(result.image, {
      plugins: [
        imageminPngquant({
          speed: 3,
          quality: [0.4, 1.0],
          strip: true,
        }),
      ],
    }).then((output) => {
      fs.writeFile(path.resolve(spriteSheetImageOutput, spriteSheetImageFilename), output, (imageminErr) => {
        if (imageminErr) {
          throw imageminErr;
        }
      });
    });
  })();

  /**
   * GENERATE SASS FILE.
   */
  const customTemplate = fs.readFileSync(path.resolve('_ui/skin/src/templates/customtemplate.template.handlebars'), 'utf8');
  templater.addHandlebarsTemplate('retinaOnly', customTemplate);

  const template = templater({
    sprites: spritesCoordinates,
    spritesheet: {
      width: Math.ceil(result.properties.width / pixelRatio),
      height: Math.ceil(result.properties.height / pixelRatio),
      //image: path.relative('./', spriteSheetImageOutput),
      //image: '../img/sprite.png',
      image: path.join(path.relative(spriteSheetStyleOutput, spriteSheetImageOutput), spriteSheetImageFilename),
    }
  }, { format: 'retinaOnly'})

  fs.writeFileSync(path.resolve(spriteSheetStyleOutput, spriteSheetStyleFilename), template);
});