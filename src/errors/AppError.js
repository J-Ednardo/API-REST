class AppError {
  constructor(mensagem, statusCode = 400, codigo = 'ERRO_NEGOCIO', detalhes = []) {
    this.mensagem = mensagem;
    this.statusCode = statusCode;
    this.codigo = codigo;
    this.detalhes = detalhes;
  }
}

export default AppError;
