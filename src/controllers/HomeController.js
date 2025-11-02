import Aluno from '../models/Aluno';

class HomeController {
  async index(req, res){
    const novoAluno = await Aluno.create({
      nome: "Eduarda",
      sobrenome: "Fernandes",
      email: "eduardateste@gmail.com",
      idade: 21,
      peso: 56,
      altura: 1.67
    });
    res.json(novoAluno);
  }
}

export default new HomeController();
