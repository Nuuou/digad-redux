const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Spritesmith = require('spritesmith');
const glob = require('glob');
const templater = require('spritesheet-templates');
const sass = require('node-sass');

const pixelRatio = 2;
const spritePattern = 'src/**/*.png';
const spriteSheetImageOutput = 'dist/sprite.png';
const spriteSheetStyleOutput = 'sprite.scss';

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

  fs.writeFile(path.resolve('./dist/sprite-original.png'), result.image, (spriteErr) => {
    if (spriteErr) {
      throw spriteErr;
    }
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
      fs.writeFile(path.resolve(spriteSheetImageOutput), output, (imageminErr) => {
        if (imageminErr) {
          throw imageminErr;
        }
      });
    });
  })();

  /**
   * GENERATE SASS FILE.
   */
  const customTemplate = fs.readFileSync(path.resolve('./customtemplate.template.handlebars'), 'utf8');
  templater.addHandlebarsTemplate('retinaOnly', customTemplate);

  const template = templater({
    sprites: spritesCoordinates,
    spritesheet: {
      width: Math.ceil(result.properties.width / pixelRatio),
      height: Math.ceil(result.properties.height / pixelRatio),
      image: path.relative('./', spriteSheetImageOutput),
    }
  }, { format: 'retinaOnly'})

  fs.writeFileSync(path.resolve(spriteSheetStyleOutput), template);

  /**
   * SASS COMPILATION. TODO: REMOVE.
   */
  sass.render({
    file: path.resolve('./style.scss'),
    outFile: path.resolve('./style.css'),
    sourceMap: true,
  }, (sassErr, sassResult) => {
    fs.writeFile(path.resolve('./style.css'), sassResult.css, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }
    });
  });
});