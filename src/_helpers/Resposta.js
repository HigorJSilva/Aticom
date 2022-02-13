exports.send = (status, menssagem, dados, erros) => {
    return {
      status,
      menssagem,
      dados,
      erros,
    };
  };