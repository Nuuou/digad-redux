const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Spritesmith = require('spritesmith');
const glob = require('glob');
const templater = require('spritesheet-templates');
const packageJson = require('../package.json');

const spriteData = packageJson.digad.sprites;
const spriteConfigDefault = {
  pixelRatio: 2,
  sourcePattern: '_ui/skin/src/img/sprite/**/*.png',
  outputImagePath: '_ui/skin/src/img',
  outputImageFilename: 'sprite.png',
  outputStylePath: '_ui/skin/src/sass',
  outputStyleFilename: '_sprite.scss',
  template: '_ui/skin/src/templates/customtemplate.template.handlebars',
  padding: 2,
  algorithm: 'binary-tree',
  algorithmOptions: {},
};

Object.values(spriteData).forEach((spriteConfigCustom) => {
  const spriteConfig = {
    ...spriteConfigDefault,
    ...spriteConfigCustom,
  };

  const sprites = glob.sync(spriteConfig.sourcePattern);
  Spritesmith.run({
    src: sprites,
    padding: spriteConfig.padding,
    algorithm: spriteConfig.algorithm,
    algorithmOpts: spriteConfig.algorithmOptions,
  }, (err, result) => {
    if (err) {
      throw err;
    }

    /**
     * GENERATE SPRITE FILE.
     */

    const spritesCoordinates = [];
    Object.entries(result.coordinates).forEach(([key, val]) => {
      const name = path.basename(key, path.extname(key));
      spritesCoordinates.push({
        x: Math.ceil(val.x / spriteConfig.pixelRatio),
        y: Math.ceil(val.y / spriteConfig.pixelRatio),
        width: Math.ceil(val.width / spriteConfig.pixelRatio),
        height: Math.ceil(val.height / spriteConfig.pixelRatio),
        name,
      });
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
        fs.writeFile(path.resolve(spriteConfig.outputImagePath, spriteConfig.outputImageFilename), output, (imageminErr) => {
          if (imageminErr) {
            throw imageminErr;
          }
        });
      });
    })();

    /**
     * GENERATE SASS FILE.
     */
    const customTemplate = fs.readFileSync(path.resolve(spriteConfig.template), 'utf8');
    templater.addHandlebarsTemplate('retinaOnly', customTemplate);

    const template = templater({
      sprites: spritesCoordinates,
      spritesheet: {
        width: Math.ceil(result.properties.width / spriteConfig.pixelRatio),
        height: Math.ceil(result.properties.height / spriteConfig.pixelRatio),
        image: path.join(path.relative(spriteConfig.outputStylePath, spriteConfig.outputImagePath), spriteConfig.outputImageFilename),
      },
    }, { format: 'retinaOnly' });

    fs.writeFileSync(path.resolve(spriteConfig.outputStylePath, spriteConfig.outputStyleFilename), template);
  });
});
