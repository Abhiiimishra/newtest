const express = require('express');
const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const { join } = require('path');
const { enableProdMode } = require('@angular/core');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/testapp/server/main');

enableProdMode();

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), 'dist/testapp/browser');

// Set the view engine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Serve static files
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
