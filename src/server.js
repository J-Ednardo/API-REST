import app from './app';

const port = process.env.PORT || process.env.APP_PORT || 3005;
app.listen(port, () => {
  console.log();
  console.log(`Escutando na porta ${port}`);
  console.log(`CTRL + CLIQUE em http://localhost:${port}`);
});
